using HirePoint.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HirePoint.Models.Entities;

namespace HirePoint.Controllers
{
   
        [Route("api/[controller]")]
        [ApiController]
        public class ApplicationsController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public ApplicationsController(ApplicationDbContext context)
            {
                _context = context;
            }


            [HttpGet]
        public async Task<IActionResult> GetApplications()
        {
            var applications = await _context.Applications
                .Include(a => a.User)
                .Include(a => a.Job)
                .Include(a => a.CV)
                .ToListAsync();

            return Ok(applications);
        }

        
        [HttpGet("GetApplicationById/{id}")]
        public async Task<IActionResult> GetApplicationById(Guid id)
        {
            var application = await _context.Applications
                .Include(a => a.User)
                .Include(a => a.Job)
                .Include(a => a.CV)
                .FirstOrDefaultAsync(a => a.ApplicationID == id);

            if (application == null)
            {
                return NotFound("Application not found.");
            }

            return Ok(application);
        }

        
        [HttpPost]
        public async Task<IActionResult> CreateApplication(Application application)
        {
            var alreadyApplied = await _context.Applications.AnyAsync(a =>
                a.UserID == application.UserID &&
                a.JobID == application.JobID);

            if (alreadyApplied)
            {
                return BadRequest("You have already applied for this job.");
            }

            await _context.Applications.AddAsync(application);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetApplicationById),
                new { id = application.ApplicationID },
                application);
        }

       
        [HttpPut("UpdateApplication/{id}")]
        public async Task<IActionResult> UpdateApplication(Guid id, Application application)
        {
            if (id != application.ApplicationID)
            {
                return BadRequest("Application ID does not match.");
            }

            var existingApplication = await _context.Applications.FindAsync(id);

            if (existingApplication == null)
            {
                return NotFound("Application not found.");
            }

            // Updates the application details
            existingApplication.Status = application.Status;
            existingApplication.Feedback = application.Feedback;
            existingApplication.CVID = application.CVID;

            // Saves the changes
            await _context.SaveChangesAsync();

            // Returns HTTP 204 (No Content)
            return NoContent();
        }

        
        [HttpDelete("DeleteApplication/{id}")]
        public async Task<IActionResult> DeleteApplication(Guid id)
        {
            var application = await _context.Applications.FindAsync(id);

            if (application == null)
            {
                return NotFound("Application not found.");
            }

            _context.Applications.Remove(application);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
