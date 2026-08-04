using HirePoint.Data;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedJobsController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public SavedJobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSavedJobs()
        {
            // Retrieve all saved jobs together with their related User and Job information
            var savedJobs = await _context.SavedJobs
                .Include(s => s.User)
                .Include(s => s.Job)
                .ToListAsync();

            return Ok(savedJobs);
        }

        [HttpGet("GetSavedJobById/{id}")]

        public async Task<IActionResult> GetSavedJobById(Guid id)
        {
            var savedJob = await _context.SavedJobs
                .Include(s => s.User)
                .Include(s => s.Job)
                .FirstOrDefaultAsync(s => s.SavedJobID == id);

            if (savedJob == null)
            {
                return NotFound();
            }
            return Ok(savedJob);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSavedJob(SavedJob savedJob)
        {

            // Checks whether this user has already saved the same job
            var alreadySaved = await _context.SavedJobs.AnyAsync(s =>
                s.UserID == savedJob.UserID &&
                s.JobID == savedJob.JobID);

            // Prevents duplicate saved jobs
            if (alreadySaved)
            {
                return BadRequest("This job has already been saved.");
            }

            // Marks the new saved job to be inserted into the database
            
            await _context.SavedJobs.AddAsync(savedJob);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSavedJobById), new { id = savedJob.SavedJobID }, savedJob);
        }

        [HttpDelete("DeleteSavedJob/{id}")]
        public async Task<IActionResult> DeleteSavedJob(Guid id)
        {
            // Searches for the saved job using its primary key
            var savedJob = await _context.SavedJobs.FindAsync(id);

            // Returns HTTP 404 if the saved job does not exist
            if (savedJob == null)
            {
                return NotFound("Saved job not found.");
            }

            // Marks the saved job for deletion
            _context.SavedJobs.Remove(savedJob);

            // Executes the SQL DELETE statement
            await _context.SaveChangesAsync();

            // Returns HTTP 204 (No Content) indicating the deletion was successful
            return NoContent();
        }


    }
}
