using HirePoint.Data;
using HirePoint.Models.DTOs.CVs;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CVsController : ControllerBase
    {
        public readonly ApplicationDbContext _context;
        public readonly IWebHostEnvironment _environment;

        public CVsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [Authorize(Roles = "3")]
        [HttpGet]
        [Route("GetCVs")]
        //GET: api/CVs -GET ALL ENDPOINT
        public async Task<IActionResult> GetCVs()
        {

            // Get the UserID of the currently logged-in user from the JWT token.
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // If the UserID cannot be found, the user is not properly authenticated.
            if (userId == null)
            {
                return Unauthorized();
            }

            // Convert the UserID from the token from string to Guid.
            var userGuid = Guid.Parse(userId);

            // Get only the CVs that belong to the logged-in user.
            var cv = await _context.CVs
                .Include(c => c.User)
                .Where(c => c.UserID == userGuid)
                .ToListAsync();


            var cvDtos = cv.Select(c => new CVDto
            {
                CVID = c.CVID,
                UserID = c.UserID,

                ApplicantName = c.User == null
            ? null
            : $"{c.User.FirstName} {c.User.LastName}",

                FileName = c.FileName,
                FilePath = c.FilePath,
                UploadDate = c.UploadDate
            });

            return Ok(cvDtos);
        }

        [Authorize(Roles = "3")]
        [HttpGet("GetCVById/{id}")]
        public async Task<IActionResult> GetCVById(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // If the UserID cannot be found, the user is not properly authenticated.
            if (userId == null)
            {
                return Unauthorized();
            }

            // Convert the UserID from the token from string to Guid.
            var userGuid = Guid.Parse(userId);



            // Find the CV and load the related User.
            var cv = await _context.CVs
                 .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CVID == id);

            if (cv == null)
            {
                return NotFound("CV not found.");
            }

            // Make sure this CV belongs to the logged-in user.
            if (cv.UserID != userGuid)
            {
                return Forbid();
            }

            var cvDto = new CVDto
            {
                CVID = cv.CVID,
                UserID = cv.UserID,

                ApplicantName = cv.User == null
                  ? null
                  : $"{cv.User.FirstName} {cv.User.LastName}",

                FileName = cv.FileName,
                FilePath = cv.FilePath,
                UploadDate = cv.UploadDate
            };

            return Ok(cvDto);
        }

        [Authorize(Roles = "3")]
        [HttpPost]
        public async Task<IActionResult> CreateCV([FromForm]CreateCVDto createCvDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get the logged-in user's ID from the JWT token.
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var userGuid = Guid.Parse(userId);

            // Make sure the CV is being created for the logged-in user.
            if (createCvDto.UserID != userGuid)
            {
                return Forbid();
            }

            //   GET THE FILE EXTENTION
            //===========================
            var extension =
                Path.GetExtension(createCvDto.CVFile.FileName) //Will extract .pdf from the FileName
                    .ToLowerInvariant();

            var allowedExtensions = new[] { ".pdf", ".doc", ".docx" }; //Array defines allowed types

            if (!allowedExtensions.Contains(extension)) //checks is extention type of uploaded file exists in allowed types list
            {
                return BadRequest(
                    "Only PDF, DOC and DOCX files are allowed.");
            }

            //   CHECK FILE SIZE
            //=====================
            /* 
             Maximum size is 5MB
             File sizes are measured in bytes -> 1024 bytes = 1KB and 1024 KB = 1 MB
             */
            const long maxFileSize = 5 * 1024 * 1024;

            //cvfILE.Length contains the size of uploaded file in bytes
            if (createCvDto.CVFile.Length > maxFileSize)
            {
                return BadRequest(
                    "CV file size cannot exceed 5 MB.");
            }

            //  GET THE WWWROOT FOLDER
            //=============================
            // _environment.WebRootPath gives us the physical location of the application's wwwroot folder on the computer.
            var wwwRootPath = _environment.WebRootPath;



            //CREATE THE CV UPLOAD FOLDER PATH
            //=================================
            // Path.Combine() safely joins folder names together.
            // Instead of manually writing:"wwwroot/Uploads/CVs" - PathCombine uses the correct directory separator
            var uploadFolder = Path.Combine(
                wwwRootPath,
                "Uploads",
                "CVs");



            // CREATE THE FOLDER IF IT DOESN'T EXIST
            //=======================================
            // Directory.Exists() checks whether the upload foldeR already exists.
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder); //// If the folder does not exist, create it
            }



            //GENERATE UNIQUE FILENAME
            //=========================
            /* We don't save the file using the original filename.
             * If we used the original filename, one user's CV could potentially overwrite another user's CV.
             * Guid.NewGuid() generates a unique identifier.
             * We then add the original file extension.
             */
            var uniqueFileName =
               $"{Guid.NewGuid()}{extension}";

            //CREATE COMPLETE FILE PATH
            //===========================
            // Combine the upload folder with the unique filename.
            var filePath = Path.Combine(
                uploadFolder,
                uniqueFileName);


            // SAVE THE UPLOADED FILE
            // ========================
            /* FileStream creates a connection between our application
              * and the physical file that we want to create.
              * FileMode.Create means: "Create a new file at this location."
              * If a file with same name existed - replaced
              */
            using (var stream = new FileStream(
                filePath,
                FileMode.Create))
            {
                //CopyToAsync() copies the uploaded file's contents yo FileStream
                await createCvDto.CVFile.CopyToAsync(stream);
            }


            // CREATE DATABASE RECORD
            // =========================
            /* The file has now been saved physically.
             * We create a CV entity containing information
             * SQL Server does not store the actual file
             */
            var cv = new CV
            {
                CVID = Guid.NewGuid(),   // Generate a unique ID for this CV database record.


                UserID = createCvDto.UserID, // Connect this CV to the user who uploaded it.

                FileName = createCvDto.CVFile.FileName, // Store the original filename selected by the user.

                FilePath =
                    $"/Uploads/CVs/{uniqueFileName}", // Store the relative path to the uploaded file.

                UploadDate = DateTime.Now
            };

            await _context.CVs.AddAsync(cv);

            await _context.SaveChangesAsync();


            
            // RETURN CREATED CV WITHITS USER
            // ==================================

            // Load the related user for the response.
            var createdCV = await _context.CVs
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CVID == cv.CVID);

            var cvDto = new CVDto
            {
                CVID = createdCV!.CVID,

                UserID = createdCV.UserID,

                ApplicantName = createdCV.User == null
                    ? null
                    : $"{createdCV.User.FirstName} " +
                      $"{createdCV.User.LastName}",

                FileName = createdCV.FileName,

                FilePath = createdCV.FilePath,

                UploadDate = createdCV.UploadDate
            };

            return CreatedAtAction(
                nameof(GetCVById),
                new { id = cv.CVID },
                cvDto);
        
        }

        [Authorize(Roles = "3")]
        [HttpPut("UpdateCV/{id}")]
        public async Task<IActionResult> UpdateCV(Guid id, CreateCVDto createCvDto)
        {
            
            // Get the logged-in user's ID from the JWT token.
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var userGuid = Guid.Parse(userId);

            // Find the existing CV.
            var existingCV = await _context.CVs.FindAsync(id);

            if (existingCV == null)
            {
                return NotFound("CV not found.");
            }

            // Make sure the CV belongs to the logged-in user.
            if (existingCV.UserID != userGuid)
            {
                return Forbid();
            }

            // Check that a new file was provided.
            if (createCvDto.CVFile == null)
            {
                return BadRequest("Please select a new CV file.");
            }

            // Get the new file extension.
            var extension = Path.GetExtension(
                createCvDto.CVFile.FileName)
                .ToLowerInvariant();

            var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(
                    "Only PDF, DOC and DOCX files are allowed.");
            }

            // Maximum file size is 5 MB.
            const long maxFileSize = 5 * 1024 * 1024;

            if (createCvDto.CVFile.Length > maxFileSize)
            {
                return BadRequest(
                    "CV file size cannot exceed 5 MB.");
            }

            // Get the CV upload folder.
            var uploadFolder = Path.Combine(
                _environment.WebRootPath,
                "Uploads",
                "CVs");

            // Generate a new unique filename.
            var uniqueFileName =
                $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(
                uploadFolder,
                uniqueFileName);

            // Save the new CV file.
            using (var stream = new FileStream(
                filePath,
                FileMode.Create))
            {
                await createCvDto.CVFile.CopyToAsync(stream);
            }

            // Delete the old physical CV file.
            var oldFilePath = Path.Combine(
                _environment.WebRootPath,
                existingCV.FilePath.TrimStart('/'));

            if (System.IO.File.Exists(oldFilePath))
            {
                System.IO.File.Delete(oldFilePath);
            }

            // Update the database record.
            existingCV.FileName =
                createCvDto.CVFile.FileName;

            existingCV.FilePath =
                $"/Uploads/CVs/{uniqueFileName}";

            existingCV.UploadDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "3")]
        [HttpDelete("DeleteCV/{id}")]
        public async Task<IActionResult> DeleteCV(Guid id)
        {
            // Get the logged-in user's ID from the JWT token.
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var userGuid = Guid.Parse(userId);

            // Find the CV.
            var cv = await _context.CVs.FindAsync(id);

            if (cv == null)
            {
                return NotFound("CV not found.");
            }

            // Make sure the CV belongs to the logged-in user.
            if (cv.UserID != userGuid)
            {
                return Forbid();
            }

            // Get the physical location of the CV.
            var filePath = Path.Combine(
                _environment.WebRootPath,
                cv.FilePath.TrimStart('/'));

            // Delete the physical file.
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            // Delete the database record.
            _context.CVs.Remove(cv);

            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
