using HirePoint.Data;
using HirePoint.Models.DTOs.Countries;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        public readonly ApplicationDbContext _context;
        public CountriesController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetCountries()
        {
            var countries = await _context.Countries.ToListAsync();

            var countryDtos = countries.Select(c => new CountryDto
            {
                CountryID = c.CountryID,
                CountryName = c.CountryName
            });
            return Ok(countryDtos);
        }
        

        [HttpGet("GetCountryById/{id}")]
        public async Task<IActionResult> GetCountryById(int id)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                return NotFound("Country not found");
            }

            var countryDto = new CountryDto
            {
                CountryID = country.CountryID,
                CountryName = country.CountryName
            };

            return Ok(countryDto);
        }

        [Authorize(Roles = "1")]
        [HttpPost]
        public async Task<IActionResult> CreateCountry(CreateCountryDto createCountryDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Prevent duplicate country names
            var countryExists = await _context.Countries
                .AnyAsync(c => c.CountryName == createCountryDto.CountryName);

            if (countryExists)
            {
                return BadRequest("Country already exists.");
            }

            var country = new Country
            {
                
                CountryName = createCountryDto.CountryName
            };

            await _context.Countries.AddAsync(country);
            await _context.SaveChangesAsync();

            var countryDto = new CountryDto
            {
                CountryID = country.CountryID,
                CountryName = country.CountryName
            };

            return CreatedAtAction(
                nameof(GetCountryById),
                new { id = country.CountryID },
                countryDto);
        }

        [Authorize(Roles = "1")]
        [HttpPut("UpdateCountry/{id}")]
        public async Task<IActionResult> UpdateCountry(int id, UpdateCuntryDto updateCountryDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           

            var existingCountry = await _context.Countries.FindAsync(id);

            if (existingCountry == null)
            {
                return NotFound("Country not found");
            }

            // Prevent another country from having the same name
            var countryExists = await _context.Countries
                .AnyAsync(c => c.CountryName == updateCountryDto.CountryName &&
                               c.CountryID != id);

            if (countryExists)
            {
                return BadRequest("Country already exists.");
            }

            existingCountry.CountryName = updateCountryDto.CountryName;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "1")]
        [HttpDelete("DeleteCountry/{id}")]
        public async Task<IActionResult> DeleteCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                return NotFound("Country not found.");
            }

            // Prevent deleting a country that still has provinces
            var hasProvinces = await _context.Provinces.AnyAsync(p => p.CountryID == id);

            if (hasProvinces)
            {
                return BadRequest("Cannot delete a country that has provinces.");
            }

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
