using HirePoint.Data;
using HirePoint.Models.DTOs.SavedJobs;
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
    public class SavedJobsController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public SavedJobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "3")]
        [HttpGet]
        public async Task<IActionResult> GetSavedJobs()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var userGuid = Guid.Parse(userId);

            var savedJobs = await _context.SavedJobs
                .Include(s => s.User)
                .Include(s => s.Job)
                    .ThenInclude(j => j.Company)
                .Include(s => s.Job)
                    .ThenInclude(j => j.City)
                .Where(s => s.UserID == userGuid)
                .OrderByDescending(s => s.SavedDate)
                .ToListAsync();

            var savedJobDtos = savedJobs.Select(s => new SavedJobDto
            {
                SavedJobID = s.SavedJobID,

                UserID = s.UserID,

                // Return the user's full name.
                UserName = s.User == null
                   ? null
                   : $"{s.User.FirstName} {s.User.LastName}",

                JobID = s.JobID,

                // Return the job title.
                JobTitle = s.Job?.Title,

                // Return the company name.
                CompanyName = s.Job?.Company?.CompanyName,

                // Return the city ID.
                CityID = s.Job?.CityID ?? 0,

                // Return the city name.
                CityName = s.Job?.City?.CityName,

                // Return when the job was saved.
                SavedDate = s.SavedDate

            }).ToList();

            return Ok(savedJobDtos);
        }

        [Authorize(Roles = "3")]
        [HttpGet("GetSavedJobById/{id}")]

        public async Task<IActionResult> GetSavedJobById(Guid id)
        {
            var savedJob = await _context.SavedJobs
               .Include(s => s.User)
               .Include(s => s.Job)
                   .ThenInclude(j => j.Company)
               .Include(s => s.Job)
                   .ThenInclude(j => j.City)
               .FirstOrDefaultAsync(s => s.SavedJobID == id);

            if (savedJob == null)
            {
                return NotFound("Saved job not found.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (savedJob.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            var savedJobDto = new SavedJobDto
            {
                SavedJobID = savedJob.SavedJobID,

                UserID = savedJob.UserID,

                UserName = savedJob.User == null
                   ? null
                   : $"{savedJob.User.FirstName} " +
                     $"{savedJob.User.LastName}",

                JobID = savedJob.JobID,

                JobTitle = savedJob.Job?.Title,

                CompanyName = savedJob.Job?.Company?.CompanyName,

                CityID = savedJob.Job?.CityID ?? 0,

                CityName = savedJob.Job?.City?.CityName,

                SavedDate = savedJob.SavedDate
            };

            return Ok(savedJobDto);
        }

        [Authorize(Roles = "3")]
        [HttpPost]
        public async Task<IActionResult> CreateSavedJob(CreateSavedJobDto createSavedJobDto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (createSavedJobDto.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            var userExists = await _context.Users
                .AnyAsync(u => u.UserID == createSavedJobDto.UserID);

            if (!userExists)
            {
                return BadRequest("User does not exist.");
            }

            // Make sure the job being saved actually exists.
            var jobExists = await _context.Jobs
                .AnyAsync(j => j.JobID == createSavedJobDto.JobID);

            if (!jobExists)
            {
                return BadRequest("Job does not exist.");
            }

            /* Prevents duplicate saved jobs
             * Check whether this user has already saved this job.
                A user should not be able to save the same job twice.*/

            var alreadySaved = await _context.SavedJobs
                .AnyAsync(s =>
                    s.UserID == createSavedJobDto.UserID &&
                    s.JobID == createSavedJobDto.JobID);

            if (alreadySaved)
            {
                return BadRequest("This job has already been saved.");
            }

            // Create the database entity.
            var savedJob = new SavedJob
            {
                // Generate a unique ID.
                SavedJobID = Guid.NewGuid(),

                // Store the user who saved the job.
                UserID = createSavedJobDto.UserID,

                // Store the job that was saved.
                JobID = createSavedJobDto.JobID,

                // Record the date and time.
                SavedDate = DateTime.Now
            };

            
            await _context.SavedJobs.AddAsync(savedJob);
            await _context.SaveChangesAsync();

            var createdSavedJob = await _context.SavedJobs
              .Include(s => s.User)
              .Include(s => s.Job)
                  .ThenInclude(j => j.Company)
              .Include(s => s.Job)
                  .ThenInclude(j => j.City)
              .FirstOrDefaultAsync(
                  s => s.SavedJobID == savedJob.SavedJobID);

            var savedJobDto = new SavedJobDto
            {
                SavedJobID = createdSavedJob!.SavedJobID,

                UserID = createdSavedJob.UserID,

                UserName = createdSavedJob.User == null
                    ? null
                    : $"{createdSavedJob.User.FirstName} " +
                      $"{createdSavedJob.User.LastName}",

                JobID = createdSavedJob.JobID,

                JobTitle = createdSavedJob.Job?.Title,

                CompanyName =
                    createdSavedJob.Job?.Company?.CompanyName,

                CityID =
                    createdSavedJob.Job?.CityID ?? 0,

                CityName =
                    createdSavedJob.Job?.City?.CityName,

                SavedDate = createdSavedJob.SavedDate
            };


            return CreatedAtAction(
                            nameof(GetSavedJobById),
                            new { id = savedJob.SavedJobID },
                            savedJobDto);
        }

        [Authorize(Roles = "3")]
        [HttpDelete("DeleteSavedJob/{id}")]
        public async Task<IActionResult> DeleteSavedJob(Guid id)
        {
            var savedJob = await _context.SavedJobs.FindAsync(id);

            if (savedJob == null)
            {
                return NotFound("Saved job not found.");
            }

            // Get the logged-in user's ID.
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            // Make sure this saved job belongs to the logged-in user.
            if (savedJob.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            _context.SavedJobs.Remove(savedJob);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "3")]
        // Retrieves only the saved jobs belonging to one user.
        [HttpGet("User/{userId}")]
        public async Task<IActionResult> GetSavedJobsByUser(Guid userId)
        {
            var loggedInUserId = User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (loggedInUserId == null)
            {
                return Unauthorized();
            }

            if (userId != Guid.Parse(loggedInUserId))
            {
                return Forbid();
            }


            var userExists = await _context.Users
                      .AnyAsync(u => u.UserID == userId);

            if (!userExists)
            {
                return NotFound("User not found.");
            }
            var savedJobs = await _context.SavedJobs
                .Include(s => s.User)
                .Include(s => s.Job)
                    .ThenInclude(j => j.Company)
                .Include(s => s.Job)
                    .ThenInclude(j => j.City)
                .Where(s => s.UserID == userId)
                .OrderByDescending(s => s.SavedDate)
                .ToListAsync();


            var savedJobDtos = savedJobs.Select(s => new SavedJobDto
            {
                SavedJobID = s.SavedJobID,

                UserID = s.UserID,

                UserName = s.User == null
                    ? null
                    : $"{s.User.FirstName} {s.User.LastName}",

                JobID = s.JobID,

                JobTitle = s.Job?.Title,

                CompanyName = s.Job?.Company?.CompanyName,

                CityID = s.Job?.CityID ?? 0,

                CityName = s.Job?.City?.CityName,

                SavedDate = s.SavedDate

            }).ToList();


            return Ok(savedJobDtos);
        }
    }
    }
