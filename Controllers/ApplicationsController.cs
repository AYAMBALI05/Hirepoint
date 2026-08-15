using HirePoint.Data;
using HirePoint.Models.DTOs.Applications;
using HirePoint.Models.Entities;
using HirePoint.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HirePoint.Controllers
{
   
        [Route("api/[controller]")]
        [ApiController]
        public class ApplicationsController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            private readonly IWebHostEnvironment _environment;


        public ApplicationsController(ApplicationDbContext context,IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [Authorize(Roles = "1,2")]
        [HttpGet]
        public async Task<IActionResult> GetApplications()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var userGuid = Guid.Parse(userId);

            var applications = await _context.Applications
                .Include(a => a.User)
                .Include(a => a.Job)
                .Include(a => a.CV)
                .ToListAsync();

            // If the logged-in user is a Recruiter,
            // only show applications for their jobs.
            if (User.IsInRole("2"))
            {
                var company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.UserID == userGuid);

                if (company == null)
                {
                    return NotFound("Company not found.");
                }

                applications = applications
                    .Where(a => a.Job != null &&
                                a.Job.CompanyID == company.CompanyID)
                    .ToList();
            }

            var applicationDtos = applications.Select(a => new ApplicationDto
            {
                ApplicationID = a.ApplicationID,

                UserID = a.UserID,

                ApplicantName = a.User == null
                    ? null
                    : $"{a.User.FirstName} {a.User.LastName}",

                JobID = a.JobID,

                JobTitle = a.Job?.Title,

                CVID = a.CVID,

                CVPath = a.CV?.FilePath,

                ApplicationDate = a.ApplicationDate,

                Status = a.Status.ToString(),
                Feedback = a.Feedback

            })

            .ToList();

            return Ok(applicationDtos);
        }

        [Authorize(Roles = "1,2")]
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

            // Only recruiters need the ownership check.
            if (User.IsInRole("2"))
            {
                var userId = User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

                if (userId == null)
                {
                    return Unauthorized();
                }

                var recruiterId = Guid.Parse(userId);

                // Find the recruiter's company.
                var company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.UserID == recruiterId);

                if (company == null)
                {
                    return NotFound("Company not found.");
                }

                // Check that the application belongs to
                // a job posted by this recruiter's company.
                if (application.Job == null ||
                    application.Job.CompanyID != company.CompanyID)
                {
                    return Forbid();
                }
            }

            var applicationDto = new ApplicationDto
            {
                ApplicationID = application.ApplicationID,

                UserID = application.UserID,

                ApplicantName = application.User == null
                    ? null
                    : $"{application.User.FirstName} " +
                      $"{application.User.LastName}",

                JobID = application.JobID,

                JobTitle = application.Job?.Title,

                CVID = application.CVID,

                CVPath = application.CV?.FilePath,

                ApplicationDate = application.ApplicationDate,

                Status = application.Status.ToString(),

                Feedback = application.Feedback
            };

            return Ok(applicationDto);
        }

        [Authorize(Roles = "3")]
        [HttpGet("MyApplications")]
        public async Task<IActionResult> GetMyApplications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var userGuid = Guid.Parse(userId);

            var applications = await _context.Applications
                .Include(a => a.User)
                .Include(a => a.Job)
                .Include(a => a.CV)
                .Where(a => a.UserID == userGuid)
                .ToListAsync();

            var applicationDtos = applications.Select(a => new ApplicationDto
            {
                ApplicationID = a.ApplicationID,

                UserID = a.UserID,

                ApplicantName = a.User == null
                    ? null
                    : $"{a.User.FirstName} {a.User.LastName}",

                JobID = a.JobID,

                JobTitle = a.Job?.Title,

                CVID = a.CVID,

                CVPath = a.CV?.FilePath,

                ApplicationDate = a.ApplicationDate,

                Status = a.Status.ToString(),
                Feedback = a.Feedback

            }).ToList();

            return Ok(applicationDtos);
        }


        [Authorize(Roles = "3")]
        [HttpPost]
        public async Task<IActionResult> CreateApplication([FromForm] CreateApplicationDto createApplicationDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (createApplicationDto.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            var userExists = await _context.Users
             .AnyAsync(u => u.UserID == createApplicationDto.UserID);

            if (!userExists)
            {
                return BadRequest("User does not exist.");
            }

            // Retrieve the selected job.
            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.JobID == createApplicationDto.JobID);

            if (job == null)
            {
                return BadRequest("Job does not exist.");
            }

            // Applications cannot be submitted after the closing date.
            if (job.ClosingDate < DateTime.Now)
            {
                return BadRequest("Applications for this job have closed.");
            }

            var alreadyApplied = await _context.Applications.AnyAsync(a =>
                a.UserID == createApplicationDto.UserID &&
                a.JobID == createApplicationDto.JobID);

            if (alreadyApplied)
            {
                return BadRequest("You have already applied for this job.");
            }



            // The applicant must either: Select an existing CV OR Upload a new CV.*/
            //=======================================================================

            if (createApplicationDto.CVID == null &&
                createApplicationDto.CVFile == null)
            {
                return BadRequest(
                    "Please select an existing CV or upload a new CV.");
            }


            // The applicant should not send both options.
            if (createApplicationDto.CVID != null &&
                createApplicationDto.CVFile != null)
            {
                return BadRequest(
                    "Please choose either an existing CV or a new CV.");
            }


            // This variable will contain the CV that will be attached to the application.
            Guid cvID;


            // OPTION 1: USE EXISTING CV
            // ========================================================

            if (createApplicationDto.CVID != null)
            {
                // Find the selected CV.
                var existingCV = await _context.CVs
                    .FirstOrDefaultAsync(c =>
                        c.CVID == createApplicationDto.CVID &&
                        c.UserID == createApplicationDto.UserID);


                // Make sure the CV belongs to the applicant.
                if (existingCV == null)
                {
                    return BadRequest(
                        "The selected CV does not exist or does not belong to this user.");
                }


                // Use the existing CV.
                cvID = existingCV.CVID;
            }


            // OPTION 2: UPLOAD NEW CV
            // ========================================================

            else
            {
                // Make sure a file was supplied.
                if (createApplicationDto.CVFile == null ||
                    createApplicationDto.CVFile.Length == 0)
                {
                    return BadRequest(
                        "Please select a CV file.");
                }


                // Get the file extension.
                var extension = Path
                    .GetExtension(
                        createApplicationDto.CVFile.FileName)
                    .ToLowerInvariant();


                // Allowed CV file types.
                var allowedExtensions = new[]
                {
                    ".pdf",
                    ".doc",
                    ".docx"
                };


                // Check the file type.
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(
                        "Only PDF, DOC and DOCX files are allowed.");
                }


                // Maximum CV size = 5 MB.
                const long maxFileSize = 5 * 1024 * 1024;


                if (createApplicationDto.CVFile.Length >
                    maxFileSize)
                {
                    return BadRequest(
                        "CV file size cannot exceed 5 MB.");
                }


                // Get the wwwroot folder.
                var wwwRootPath =
                    _environment.WebRootPath;


                // Create the CV upload folder.
                var uploadFolder = Path.Combine(
                    wwwRootPath,
                    "Uploads",
                    "CVs");


                // Create the folder if it doesn't exist.
                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }


                // Give the file a unique name.
                var uniqueFileName =
                    $"{Guid.NewGuid()}{extension}";


                // Create the complete physical file path.
                var filePath = Path.Combine(
                    uploadFolder,
                    uniqueFileName);


                // Save the uploaded CV.
                using (var stream = new FileStream(
                    filePath,
                    FileMode.Create))
                {
                    await createApplicationDto.CVFile
                        .CopyToAsync(stream);
                }


                // Create the CV database record.
                var newCV = new CV
                {
                    CVID = Guid.NewGuid(),

                    UserID = createApplicationDto.UserID,

                    FileName =
                        createApplicationDto.CVFile.FileName,

                    FilePath =
                        $"/Uploads/CVs/{uniqueFileName}",

                    UploadDate = DateTime.Now
                };


                // Add the CV to the database.
                await _context.CVs.AddAsync(newCV);


                // Store the new CV ID.
                cvID = newCV.CVID;
            }



            var application = new Application
            {
                ApplicationID = Guid.NewGuid(),

                UserID = createApplicationDto.UserID,

                JobID = createApplicationDto.JobID,

                // This will be either the existing CV ID
                // or the newly uploaded CV ID.
                CVID = cvID,

                ApplicationDate = DateTime.Now,

                // Every new application starts as Pending.
                Status = ApplicationStatus.Pending,

                // No recruiter feedback when first submitted.
                Feedback = null
            };

            await _context.Applications.AddAsync(application);

            await _context.SaveChangesAsync();

            var createdApplication = await _context.Applications
                .Include(a => a.User)
                .Include(a => a.Job)
                .Include(a => a.CV)
                .FirstOrDefaultAsync(a => a.ApplicationID == application.ApplicationID);

            var applicationDto = new ApplicationDto
            {
                ApplicationID =
                      createdApplication!.ApplicationID,

                UserID =
                      createdApplication.UserID,

                ApplicantName =
                      createdApplication.User == null
                          ? null
                          : $"{createdApplication.User.FirstName} " +
                            $"{createdApplication.User.LastName}",

                JobID =
                      createdApplication.JobID,

                JobTitle =
                      createdApplication.Job?.Title,

                CVID =
                      createdApplication.CVID,

                CVPath =
                      createdApplication.CV?.FilePath,

                ApplicationDate =
                      createdApplication.ApplicationDate,

                Status =
                      createdApplication.Status.ToString(),

                Feedback =
                      createdApplication.Feedback
            };


            return CreatedAtAction(
                nameof(GetApplicationById),
                new { id = application.ApplicationID },
                applicationDto);
        }

        [Authorize(Roles = "2")] //Recruiters should update the application status

        [HttpPut("UpdateApplication/{id}")]
        public async Task<IActionResult> UpdateApplication(Guid id, UpdateApplicationDto updateApplicationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get the logged-in recruiter's ID.
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var recruiterId = Guid.Parse(userId);

            // Find the application together with its Job.
            var application = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.ApplicationID == id);

            if (application == null)
            {
                return NotFound("Application not found.");
            }

            // Find the company that owns the job.
            var company = await _context.Companies
                .FirstOrDefaultAsync(c =>
                    c.CompanyID == application.Job.CompanyID);

            if (company == null)
            {
                return NotFound("Company not found.");
            }

            // Make sure the recruiter owns the company.
            if (company.UserID != recruiterId)
            {
                return Forbid();
            }

            // Update the application status.
            application.Status = updateApplicationDto.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "1")] //We'll make this accessable to only admins for now
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
