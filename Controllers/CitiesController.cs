using HirePoint.Data;
using HirePoint.Models.DTOs.Cities;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Cities
        // Retrieves all cities together with their provinces
        [HttpGet]
        public async Task<IActionResult> GetCities()
        {
            var cities = await _context.Cities.Include(c => c.Province).ThenInclude(p => p.Country).ToListAsync();

            var cityDtos = cities.Select(c => new CityDto               
            {
                CityID = c.CityID,   
                CityName = c.CityName,
                ProvinceID = c.ProvinceID,
                ProvinceName = c.Province?.ProvinceName, // Use null-conditional operator to avoid NullReferenceException if the province navigation property is null/not loaded
                CountryID = c.Province.CountryID, // Use null-conditional operator to avoid NullReferenceException if the province navigation property is null/not loaded
                CountryName = c.Province.Country?.CountryName // Use null-conditional operator to avoid NullReferenceException if the province or country navigation properties are null/not loaded
            });

            return Ok(cityDtos);
        }

        // GET: api/Cities/5
        // Retrieves a specific city
        [HttpGet("GetCityById/{id}")]
        public async Task<IActionResult> GetCityById(int id)
        {
            var city = await _context.Cities.Include(c => c.Province).ThenInclude(p => p.Country).FirstOrDefaultAsync(c => c.CityID == id);

            if (city == null)
            {
                return NotFound("City not found.");
            }

            var cityDto = new CityDto
            {
                CityID = city.CityID,
                CityName = city.CityName,
                ProvinceID = city.ProvinceID,
                ProvinceName = city.Province?.ProvinceName, // Use null-conditional operator to avoid NullReferenceException if the province navigation property is null/not loaded
                CountryID = city.Province.CountryID, // Use null-conditional operator to avoid NullReferenceException if the province navigation property is null/not loaded
                CountryName = city.Province.Country?.CountryName // Use null-conditional operator to avoid NullReferenceException if the province or country navigation properties are null/not loaded
            };

            return Ok(cityDto);
        }

        [Authorize(Roles = "1")]
        [HttpPost]
        public async Task<IActionResult> CreateCity(CreateCityDto createCityDto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Prevent duplicate city names within the same province
            var cityExists = await _context.Cities
                .AnyAsync(c => c.CityName == createCityDto.CityName &&
                               c.ProvinceID == createCityDto.ProvinceID);

            if (cityExists)
            {
                return BadRequest("City already exists in this province.");
            }

            var city = new City
            {
                CityName = createCityDto.CityName,
                ProvinceID = createCityDto.ProvinceID
            };

            await _context.Cities.AddAsync(city);
            await _context.SaveChangesAsync();

            var createdCity = await _context.Cities
                .Include(c => c.Province)
                .ThenInclude(p => p.Country)
                .FirstOrDefaultAsync(c => c.CityID == city.CityID);

            var cityDto = new CityDto
            {
                CityID = createdCity.CityID,
                CityName = createdCity.CityName,
                ProvinceID = createdCity.ProvinceID,
                ProvinceName = createdCity.Province?.ProvinceName,
                CountryID = createdCity.Province.CountryID,
                CountryName = createdCity.Province.Country?.CountryName
            };

            return CreatedAtAction(nameof(GetCityById),
                new { id = createdCity.CityID },
                cityDto);
        }

        [Authorize(Roles = "1")]
        [HttpPut("UpdateCity/{id}")]
        public async Task<IActionResult> UpdateCity(int id, UpdateCityDto updateCityDto)
        {
          if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCity = await _context.Cities.FindAsync(id);

            if (existingCity == null)
            {
                return NotFound("City not found.");
            }


            // Prevent duplicate city names within the same province
            var cityExists = await _context.Cities
                .AnyAsync(c => c.CityName == updateCityDto.CityName &&
                               c.ProvinceID == updateCityDto.ProvinceID &&
                               c.CityID != id);

            if (cityExists)
            {
                return BadRequest("City already exists in this province.");
            }

            existingCity.CityName = updateCityDto.CityName;
            existingCity.ProvinceID = updateCityDto.ProvinceID;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "1")]
        [HttpDelete("DeleteCity/{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);

            if (city == null)
            {
                return NotFound("City not found.");
            }

           

           

            // Prevent deleting a city that is assigned to companies
            var companiesExist = await _context.Companies
                .AnyAsync(c => c.CityID == id);

            if (companiesExist)
            {
                return BadRequest("Cannot delete a city that is assigned to companies.");
            }

            // Prevent deleting a city that is assigned to jobs
            var jobsExist = await _context.Jobs
                .AnyAsync(j => j.CityID == id);

            if (jobsExist)
            {
                return BadRequest("Cannot delete a city that is assigned to jobs.");
            }

            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
