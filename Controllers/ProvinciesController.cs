using HirePoint.Data;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProvinciesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProvinciesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Provinces
        // Retrieves all provinces together with their countries
        [HttpGet]
        public async Task<IActionResult> GetProvinces()
        {
            var provinces = await _context.Provinces
                .Include(p => p.Country)
                .ToListAsync();

            return Ok(provinces);
        }

        // GET: api/Provinces/5
        // Retrieves a specific province
        [HttpGet("GetProvinceById/{id}")]
        public async Task<IActionResult> GetProvinceById(int id)
        {
            var province = await _context.Provinces
                .Include(p => p.Country)
                .FirstOrDefaultAsync(p => p.ProvinceID == id);

            if (province == null)
            {
                return NotFound("Province not found.");
            }

            return Ok(province);
        }

        // POST: api/Provinces
        // Creates a new province
        [HttpPost]
        public async Task<IActionResult> CreateProvince(Province province)
        {
            // Prevent duplicate province names within the same country
            var provinceExists = await _context.Provinces
                .AnyAsync(p => p.ProvinceName == province.ProvinceName &&
                               p.CountryID == province.CountryID);

            if (provinceExists)
            {
                return BadRequest("Province already exists in this country.");
            }

            await _context.Provinces.AddAsync(province);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProvinceById),
                new { id = province.ProvinceID },
                province);
        }

        // PUT: api/Provinces/5
        // Updates an existing province
        [HttpPut("UpdateProvince/{id}")]
        public async Task<IActionResult> UpdateProvince(int id, Province province)
        {
            if (id != province.ProvinceID)
            {
                return BadRequest("Province ID does not match.");
            }

            var existingProvince = await _context.Provinces.FindAsync(id);

            if (existingProvince == null)
            {
                return NotFound("Province not found.");
            }

            // Prevent duplicate province names within the same country
            var provinceExists = await _context.Provinces
                .AnyAsync(p => p.ProvinceName == province.ProvinceName &&
                               p.CountryID == province.CountryID &&
                               p.ProvinceID != id);

            if (provinceExists)
            {
                return BadRequest("Province already exists in this country.");
            }

            existingProvince.ProvinceName = province.ProvinceName;
            existingProvince.CountryID = province.CountryID;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Provinces/5
        // Deletes a province if it has no cities
        [HttpDelete("DeleteProvince/{id}")]
        public async Task<IActionResult> DeleteProvince(int id)
        {
            var province = await _context.Provinces.FindAsync(id);

            if (province == null)
            {
                return NotFound("Province not found.");
            }

            // Prevent deleting a province that still contains cities
            var hasCities = await _context.Cities
                .AnyAsync(c => c.ProvinceID == id);

            if (hasCities)
            {
                return BadRequest("Cannot delete a province that contains cities.");
            }

            _context.Provinces.Remove(province);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
