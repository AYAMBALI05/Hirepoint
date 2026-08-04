using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HirePoint.Models.Entities;
using HirePoint.Data;

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
            return Ok(countries);
        }
        

        [HttpGet("GetCountryById/{id}")]
        public async Task<IActionResult> GetCountryById(int id)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                return NotFound("Country not found");
            }

            return Ok(country);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCountry(Country country)
        {
            // Prevent duplicate country names
            var countryExists = await _context.Countries
                .AnyAsync(c => c.CountryName == country.CountryName);

            if (countryExists)
            {
                return BadRequest("Country already exists.");
            }

            await _context.Countries.AddAsync(country);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCountryById), new { id = country.CountryID }, country);
        }

        [HttpPut("UpdateCountry/{id}")]
        public async Task<IActionResult> UpdateCountry(int id, Country country)
        {
            if (id != country.CountryID)
                return BadRequest("Country ID does not match");

            var existingCountry = await _context.Countries.FindAsync(id);

            if (existingCountry == null)
            {
                return NotFound("Country not found");
            }

            // Prevent another country from having the same name
            var countryExists = await _context.Countries
                .AnyAsync(c => c.CountryName == country.CountryName &&
                               c.CountryID != id);

            if (countryExists)
            {
                return BadRequest("Country already exists.");
            }

            existingCountry.CountryName = country.CountryName;

            await _context.SaveChangesAsync();

            return NoContent();
        }

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
