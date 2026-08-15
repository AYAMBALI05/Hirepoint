using HirePoint.Data;
using HirePoint.Models.DTOs.Provinces;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
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

            var provinceDtos = provinces.Select(p => new ProvinceDto
            {
                ProvinceID = p.ProvinceID,
                ProvinceName = p.ProvinceName,
                CountryID = p.CountryID,
                CountryName = p.Country?.CountryName // Use null-conditional operator to avoid NullReferenceException if the country navigation property is null/not loaded
            });

            return Ok(provinceDtos);
        }

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

            var provinceDto = new ProvinceDto
            {
                ProvinceID = province.ProvinceID,
                ProvinceName = province.ProvinceName,
                CountryID = province.CountryID,
                CountryName = province.Country?.CountryName // Use null-conditional operator to avoid NullReferenceException if the country navigation property is null/not loaded
            };

             return Ok(provinceDto);
        }


        [Authorize(Roles = "1")]
        [HttpPost]
        public async Task<IActionResult> CreateProvince(CreateProvinceDto createProvinceDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Prevent duplicate province names within the same country
            var provinceExists = await _context.Provinces
                .AnyAsync(p => p.ProvinceName == createProvinceDto.ProvinceName &&
                               p.CountryID == createProvinceDto.CountryID);

            if (provinceExists)
            {
                return BadRequest("Province already exists in this country.");
            }

            var province = new Province
            {
                ProvinceName = createProvinceDto.ProvinceName,
                CountryID = createProvinceDto.CountryID
            };

            await _context.Provinces.AddAsync(province);
            await _context.SaveChangesAsync();

            var createdProvince = await _context.Provinces
                .Include(p => p.Country)
                .FirstAsync(p => p.ProvinceID == province.ProvinceID);

            var provinceDto = new ProvinceDto
            {
                ProvinceID = createdProvince.ProvinceID,
                ProvinceName = createdProvince.ProvinceName,
                CountryID = createdProvince.CountryID,
                CountryName = createdProvince.Country?.CountryName
            };

            return CreatedAtAction(nameof(GetProvinceById),
                new { id = province.ProvinceID },
                provinceDto);
        }

        [Authorize(Roles = "1")]
        [HttpPut("UpdateProvince/{id}")]
        public async Task<IActionResult> UpdateProvince(int id, UpdateProvinceDto updateProvinceDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           
            var existingProvince = await _context.Provinces.FindAsync(id);

            if (existingProvince == null)
            {
                return NotFound("Province not found.");
            }

            // Prevent duplicate province names within the same country
            var provinceExists = await _context.Provinces
                .AnyAsync(p => p.ProvinceName == updateProvinceDto.ProvinceName &&
                               p.CountryID == updateProvinceDto.CountryID &&
                               p.ProvinceID != id);

            if (provinceExists)
            {
                return BadRequest("Province already exists in this country.");
            }

            existingProvince.ProvinceName = updateProvinceDto.ProvinceName;
            existingProvince.CountryID = updateProvinceDto.CountryID;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "1")]
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
