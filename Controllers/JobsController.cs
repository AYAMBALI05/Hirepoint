using HirePoint.Data;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _context.Jobs.Include(j => j.Company).Include(j => j.City).ToListAsync();

            return Ok(jobs);
        }

        [HttpGet("GetJobById/{id}")]
        public async Task<IActionResult> GetJobById(Guid id)
        {
            var job = await _context.Jobs.Include(j => j.Company).Include(j => j.City).FirstOrDefaultAsync(j => j.JobID == id);

            if (job == null)
            {
                return NotFound("Job not found.");
            }

            return Ok(job);
        }

       
        [HttpPost]
        public async Task<IActionResult> CreateJob(Job job)
        {
            await _context.Jobs.AddAsync(job);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobById),new { id = job.JobID },job);
        }

        
        [HttpPut("UpdateJob/{id}")]
        public async Task<IActionResult> UpdateJob(Guid id, Job job)
        {
           
            if (id != job.JobID)
            {
                return BadRequest("Job ID does not match.");
            }

           
            var existingJob = await _context.Jobs.FindAsync(id);

            if (existingJob == null)
            {
                return NotFound("Job not found.");
            }

            existingJob.CompanyID = job.CompanyID;
            existingJob.Title = job.Title;
            existingJob.Description = job.Description;
            existingJob.Salary = job.Salary;
            existingJob.ExperienceRequired = job.ExperienceRequired;
            existingJob.EmploymentType = job.EmploymentType;
            existingJob.AvailableVacancies = job.AvailableVacancies;
            existingJob.CityID = job.CityID;
            existingJob.PostDate = job.PostDate;
            existingJob.ClosingDate = job.ClosingDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

       
        [HttpDelete("DeleteJob/{id}")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            var job = await _context.Jobs.FindAsync(id);

            if (job == null)
            {
                return NotFound("Job not found.");
            }

            _context.Jobs.Remove(job);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
