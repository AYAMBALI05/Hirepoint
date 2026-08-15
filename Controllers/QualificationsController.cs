using HirePoint.Data;
using HirePoint.Models.DTOs.Qualifications;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var qualifications = await _context.Qualifications.ToListAsync();

            var qualificationDtos = qualifications.Select(q => new QualificationDto
            {
                QualificationID = q.QualificationID,
                QualificationName = q.QualificationName
            });

            return Ok(qualificationDtos);
        }

        [HttpGet("GetQualificationById/{id}")]
        public async Task<IActionResult> GetQualificationById(int id)
        {
            var qualification = await _context.Qualifications.FindAsync(id);
          
            if (qualification == null)
            {
                return NotFound("Qualification not found");
            }

            var qualificationDto = new QualificationDto
            {
                QualificationID = qualification.QualificationID,
                QualificationName = qualification.QualificationName
            };

            return Ok(qualificationDto);
        }

        [Authorize(Roles = "1")]
        [HttpPost]
        public async Task<IActionResult> CreateQualification(CreateQualificationDto createQualificationDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            // Prevent duplicate qualification names.
            var qualificationExists = await _context.Qualifications
                .AnyAsync(q => q.QualificationName == createQualificationDto.QualificationName);

            if (qualificationExists)
            {
                return BadRequest("Qualification already exists.");
            }

            // Convert the DTO into a Qualification entity.
            var qualification = new Qualification
            {
                QualificationName = createQualificationDto.QualificationName
            };

            await _context.Qualifications.AddAsync(qualification);
            await _context.SaveChangesAsync();

            // Convert the saved entity back into a DTO.
            var qualificationDto = new QualificationDto
            {
                QualificationID = qualification.QualificationID,
                QualificationName = qualification.QualificationName
            };

            return CreatedAtAction(
                nameof(GetQualificationById),
                new { id = qualification.QualificationID },
                qualificationDto);
        }

        [Authorize(Roles = "1")]
        [HttpPut("UpdateQualification/{id}")]
        public async Task<IActionResult> UpdateQualification(int id, UpdateQualificationDto updateQualificationDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           

            var existingQualification = await _context.Qualifications.FindAsync(id);

            if (existingQualification == null)
            {
                return NotFound("Qualification not found");
            }

            var qualificationExists = await _context.Qualifications
                .AnyAsync(q => q.QualificationName == updateQualificationDto.QualificationName && q.QualificationID != id);

            if (qualificationExists)
            {
                return BadRequest("Qualification already exists.");
            }

            existingQualification.QualificationName = updateQualificationDto.QualificationName;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
