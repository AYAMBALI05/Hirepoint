using HirePoint.Data;
using HirePoint.Models.DTOs.Jobs;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        //Everyone should be able to get/search for job - won't authorize this
        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.City)
                .ToListAsync();

            var jobDtos = jobs.Select(j => new JobDto
            {
                JobID = j.JobID,
                CompanyID = j.CompanyID,
                CompanyName = j.Company?.CompanyName,
                Title = j.Title,
                Description = j.Description,
                QualificationRequired = j.QualificationRequired,
                Salary = j.Salary,
                ExperienceRequired = j.ExperienceRequired,
                EmploymentType = j.EmploymentType,
                AvailableVacancies = j.AvailableVacancies,
                CityID = j.CityID,
                CityName = j.City?.CityName,
                PostDate = j.PostDate,
                ClosingDate = j.ClosingDate
            });


            return Ok(jobDtos);
        }

        [HttpGet("GetJobById/{id}")]
        public async Task<IActionResult> GetJobById(Guid id)
        {
            var job = await _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.City)
                .FirstOrDefaultAsync(j => j.JobID == id);

            if (job == null)
            {
                return NotFound("Job not found.");
            }
            var jobDto = new JobDto
            {
                JobID = job.JobID,
                CompanyID = job.CompanyID,
                CompanyName = job.Company?.CompanyName,
                Title = job.Title,
                Description = job.Description,
                QualificationRequired = job.QualificationRequired,
                Salary = job.Salary,
                ExperienceRequired = job.ExperienceRequired,
                EmploymentType = job.EmploymentType,
                AvailableVacancies = job.AvailableVacancies,
                CityID = job.CityID,
                CityName = job.City?.CityName,
                PostDate = job.PostDate,
                ClosingDate = job.ClosingDate
            };

            return Ok(jobDto);
        }

        [Authorize(Roles = "2")]
        [HttpPost]
        public async Task<IActionResult> CreateJob(CreateJobsDto createJobsDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var companyExists = await _context.Companies
              .AnyAsync(c => c.CompanyID == createJobsDto.CompanyID);

            if (!companyExists)
            {
                return BadRequest("Company does not exist.");
            }

            // Ensure the selected city exists.
            var cityExists = await _context.Cities
                .AnyAsync(c => c.CityID == createJobsDto.CityID);

            if (!cityExists)
            {
                return BadRequest("City does not exist.");
            }

            // Ensure the closing date is in the future.
            if (createJobsDto.ClosingDate <= DateTime.Now)
            {
                return BadRequest("Closing date must be in the future.");
            }

            var job = new Job
            {
                JobID = Guid.NewGuid(),
                CompanyID = createJobsDto.CompanyID,
                Title = createJobsDto.Title,
                Description = createJobsDto.Description,
                QualificationRequired = createJobsDto.QualificationRequired,
                Salary = createJobsDto.Salary,
                ExperienceRequired = createJobsDto.ExperienceRequired,
                EmploymentType = createJobsDto.EmploymentType,
                AvailableVacancies = createJobsDto.AvailableVacancies,
                CityID = createJobsDto.CityID,
                PostDate = DateTime.Now, //The server determines when the job was posted.
                ClosingDate = createJobsDto.ClosingDate
            };


            await _context.Jobs.AddAsync(job);

            await _context.SaveChangesAsync();

            var createdJob = await _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.City)
                .FirstOrDefaultAsync(j => j.JobID == job.JobID);

            var jobDto = new JobDto
            {
                JobID = createdJob.JobID,
                CompanyID = createdJob.CompanyID,
                CompanyName = createdJob.Company?.CompanyName,
                Title = createdJob.Title,
                Description = createdJob.Description,
                QualificationRequired = createdJob.QualificationRequired,
                Salary = createdJob.Salary,
                ExperienceRequired = createdJob.ExperienceRequired,
                EmploymentType = createdJob.EmploymentType,
                AvailableVacancies = createdJob.AvailableVacancies,
                CityID = createdJob.CityID,
                CityName = createdJob.City?.CityName,
                PostDate = createdJob.PostDate,
                ClosingDate = createdJob.ClosingDate
            };

            return CreatedAtAction(nameof(GetJobById),new { id = job.JobID },jobDto);
        }

        [Authorize(Roles = "2")]
        [HttpPut("UpdateJob/{id}")]
        public async Task<IActionResult> UpdateJob(Guid id, UpdateJobsDto updateJobsDto)
        {
           if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           
            var existingJob = await _context.Jobs.FindAsync(id);

            if (existingJob == null)
            {
                return NotFound("Job not found.");
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var company = await _context.Companies
                .FirstOrDefaultAsync(c =>
                    c.CompanyID == existingJob.CompanyID &&
                    c.UserID == Guid.Parse(userID));

            if (company == null)
            {
                return Forbid();
            }


            var companyExists = await _context.Companies
             .AnyAsync(c => c.CompanyID == updateJobsDto.CompanyID);

            if (!companyExists)
            {
                return BadRequest("Company does not exist.");
            }

            // Ensure the selected city exists.
            var cityExists = await _context.Cities
                .AnyAsync(c => c.CityID == updateJobsDto.CityID);

            if (!cityExists)
            {
                return BadRequest("City does not exist.");
            }

            // Ensure the closing date is still in the future.
            if (updateJobsDto.ClosingDate <= DateTime.Now)
            {
                return BadRequest("Closing date must be in the future.");
            }
            //We don't update JobID and PostDate because they are set when the job is created and should not change.
            existingJob.CompanyID = updateJobsDto.CompanyID;
            existingJob.Title = updateJobsDto.Title;
            existingJob.Description = updateJobsDto.Description;
            existingJob.QualificationRequired = updateJobsDto.QualificationRequired;
            existingJob.Salary = updateJobsDto.Salary;
            existingJob.ExperienceRequired = updateJobsDto.ExperienceRequired;
            existingJob.EmploymentType = updateJobsDto.EmploymentType;
            existingJob.AvailableVacancies = updateJobsDto.AvailableVacancies;
            existingJob.CityID = updateJobsDto.CityID;
            existingJob.ClosingDate = updateJobsDto.ClosingDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "2")]
        [HttpDelete("DeleteJob/{id}")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            var job = await _context.Jobs.FindAsync(id);

            if (job == null)
            {
                return NotFound("Job not found.");
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var company = await _context.Companies
                .FirstOrDefaultAsync(c =>
                    c.CompanyID == job.CompanyID &&
                    c.UserID == Guid.Parse(userID));

            if (company == null)
            {
                return Forbid();
            }

            // Prevent deleting a job that already has applications.
            var hasApplications = await _context.Applications
                .AnyAsync(a => a.JobID == id);

            if (hasApplications)
            {
                return BadRequest("Cannot delete a job that has applications.");
            }

            // Prevent deleting a job that users have saved.
            var hasSavedJobs = await _context.SavedJobs
                .AnyAsync(s => s.JobID == id);

            if (hasSavedJobs)
            {
                return BadRequest("Cannot delete a job that users have saved.");
            }

            // Prevent deleting a job that still has required qualifications.
           /* var hasQualifications = await _context.JobQualifications
                .AnyAsync(jq => jq.JobID == id);

            if (hasQualifications)
            {
                return BadRequest("Cannot delete a job that still has qualifications assigned.");
            }*/

            _context.Jobs.Remove(job);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost("SaveJob/{jobId}")]
        public async Task<IActionResult> SaveJob(Guid jobId)
        {
            // Get the ID of the currently logged-in user
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = Guid.Parse(userIdClaim.Value);

            // Check that the job exists
            var jobExists = await _context.Jobs
                .AnyAsync(j => j.JobID == jobId);

            if (!jobExists)
            {
                return NotFound("Job not found.");
            }

            // Check whether the user has already saved this job
            var alreadySaved = await _context.SavedJobs
                .AnyAsync(s =>
                    s.JobID == jobId &&
                    s.UserID == userId);

            if (alreadySaved)
            {
                return BadRequest("You have already saved this job.");
            }

            // Create the saved-job record
            var savedJob = new SavedJob
            {
                SavedJobID = Guid.NewGuid(),
                JobID = jobId,
                UserID = userId,
                SavedDate = DateTime.UtcNow
            };

            // Add it to the database
            await _context.SavedJobs.AddAsync(savedJob);

            await _context.SaveChangesAsync();

            return Ok("Job saved successfully.");
        }
    }
}
