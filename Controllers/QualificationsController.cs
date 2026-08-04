using HirePoint.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HirePoint.Models.Entities;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QualificationsController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public QualificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]

        public async Task<IActionResult> GetQualifications()
        {
            var qualification = await _context.Qualifications.ToListAsync();
            return Ok(qualification);
        }

        [HttpGet("GetQualificationById/{id}")]
        public async Task<IActionResult> GetQualificationById(int id)
        {
            var qualification = await _context.Qualifications.FindAsync(id);
            if (qualification == null)
            {
                return NotFound("Qualification not found");
            }
            return Ok(qualification);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQualification(Qualification qualification)
        {
            await _context.Qualifications.AddAsync(qualification);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetQualificationById), new { id = qualification.QualificationID }, qualification);
        }

        [HttpPut("UpdateQualification/{id}")]
        public async Task<IActionResult> UpdateQualification(int id, Qualification qualification)
        {
            if (id != qualification.QualificationID)
                return BadRequest("Qualification ID does not match");

            var existingQualification = await _context.Qualifications.FindAsync(id);

            if (existingQualification == null)
            {
                return NotFound("Qualification not found");
            }
            existingQualification.QualificationName = qualification.QualificationName;

            _context.Qualifications.Update(existingQualification);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
