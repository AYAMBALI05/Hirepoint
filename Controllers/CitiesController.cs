using HirePoint.Data;
using HirePoint.Models.Entities;
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

            return Ok(cities);
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

            return Ok(city);
        }

        // POST: api/Cities
        // Creates a new city
        [HttpPost]
        public async Task<IActionResult> CreateCity(City city)
        {
            // Prevent duplicate city names within the same province
            var cityExists = await _context.Cities
                .AnyAsync(c => c.CityName == city.CityName &&
                               c.ProvinceID == city.ProvinceID);

            if (cityExists)
            {
                return BadRequest("City already exists in this province.");
            }

            await _context.Cities.AddAsync(city);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCityById),
                new { id = city.CityID },
                city);
        }

        // PUT: api/Cities/5
        // Updates an existing city
        [HttpPut("UpdateCity/{id}")]
        public async Task<IActionResult> UpdateCity(int id, City city)
        {
            if (id != city.CityID)
            {
                return BadRequest("City ID does not match.");
            }

            var existingCity = await _context.Cities.FindAsync(id);

            if (existingCity == null)
            {
                return NotFound("City not found.");
            }

            // Prevent duplicate city names within the same province
            var cityExists = await _context.Cities
                .AnyAsync(c => c.CityName == city.CityName &&
                               c.ProvinceID == city.ProvinceID &&
                               c.CityID != id);

            if (cityExists)
            {
                return BadRequest("City already exists in this province.");
            }

            existingCity.CityName = city.CityName;
            existingCity.ProvinceID = city.ProvinceID;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Cities/5
        // Deletes a city if it is not referenced by users, companies or jobs
        [HttpDelete("DeleteCity/{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);

            if (city == null)
            {
                return NotFound("City not found.");
            }

            // Prevent deleting a city that is assigned to users
            var usersExist = await _context.Users
                .AnyAsync(u => u.CityID == id);

            if (usersExist)
            {
                return BadRequest("Cannot delete a city that is assigned to users.");
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
