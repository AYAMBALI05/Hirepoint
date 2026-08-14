using HirePoint.Data;
using HirePoint.Models.DTOs.UserProfiles;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfilesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public UserProfilesController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [Authorize] //Accesible to everyone since everyone has user profiles
        [HttpGet]
        [Route("GetUserProfiles")]
        //GET: api/UserProfiles -GET ALL ENDPOINT
        public async Task<IActionResult> GetUserProfiles() 
        {

            // Get all user profiles together with their users.
            var profiles = await _context.UserProfiles
                .Include(p => p.User)
                .ToListAsync();

            // Create a list to store the DTOs.
            var profileDtos = new List<UserProfileDto>();

            // Go through each profile.
            foreach (var profile in profiles)
            {
                // Find the CV belonging to this user.
                var cv = await _context.CVs
                    .FirstOrDefaultAsync(c => c.UserID == profile.UserID);

                // Create the DTO.
                var profileDto = new UserProfileDto
                {
                    ProfileID = profile.ProfileID,

                    UserID = profile.UserID,

                    FullName = profile.User == null
                        ? null
                        : $"{profile.User.FirstName} {profile.User.LastName}",

                    Email = profile.User?.Email,

                    Experience = profile.Experience,

                    CVID = cv?.CVID,

                    CVFileName = cv?.FileName,

                    CVPath = cv?.FilePath,

                    CVUploadDate = cv?.UploadDate
                };

                // Add the DTO to the list.
                profileDtos.Add(profileDto);
            }

            return Ok(profileDtos); 
        }

        [Authorize]
        [HttpGet("{id}")] 
        public async Task<IActionResult> GetUserProfileById(Guid id) 
        {
            var profile = await _context.UserProfiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.ProfileID == id); 

            if (profile == null)
            {
                return NotFound("User Profile not found");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (profile.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            // Find the CV belonging to this user.
            var cv = await _context.CVs
                .FirstOrDefaultAsync(c => c.UserID == profile.UserID);

            var profileDto = new UserProfileDto
            {
                ProfileID = profile.ProfileID,

                UserID = profile.UserID,

                FullName = profile.User == null
                    ? null
                    : $"{profile.User.FirstName} {profile.User.LastName}",

                Email = profile.User?.Email,

                Experience = profile.Experience,

                // CV information.
                CVID = cv?.CVID,

                CVFileName = cv?.FileName,

                CVPath = cv?.FilePath,

                CVUploadDate = cv?.UploadDate
            };

            return Ok(profileDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateUserProfile(CreateUserProfileDto createUserProfileDto)
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

            if (createUserProfileDto.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            // Ensure the user exists.
            var userExists = await _context.Users
                .AnyAsync(u => u.UserID == createUserProfileDto.UserID);

            if (!userExists)
            {
                return BadRequest("User does not exist.");
            }

            // Prevent one user from having multiple profiles.
            var profileExists = await _context.UserProfiles
                .AnyAsync(p => p.UserID == createUserProfileDto.UserID);

            if (profileExists)
            {
                return BadRequest("This user already has a profile.");
            }

            // Make sure a CV was selected.
            if (createUserProfileDto.CVFile == null ||
                createUserProfileDto.CVFile.Length == 0)
            {
                return BadRequest("Please select a CV file.");
            }


            // Get the file extension.
            var extension = Path
                .GetExtension(createUserProfileDto.CVFile.FileName)
                .ToLowerInvariant();

            // Allowed CV file types.
            var allowedExtensions = new[]
            {
                ".pdf",
                ".doc",
                ".docx"
            };


            // Reject unsupported file types.
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(
                    "Only PDF, DOC and DOCX files are allowed.");
            }


            // Maximum CV size = 5 MB.
            const long maxFileSize = 5 * 1024 * 1024;


            if (createUserProfileDto.CVFile.Length > maxFileSize)
            {
                return BadRequest(
                    "CV file size cannot exceed 5 MB.");
            }

            // Get the wwwroot folder.
            var wwwRootPath = _environment.WebRootPath;


            // Create:
            // wwwroot/Uploads/CVs
            var uploadFolder = Path.Combine(
                wwwRootPath,
                "Uploads",
                "CVs");


            // Create the folder if it doesn't exist.
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            // Generate a unique name for the uploaded CV.
            var uniqueFileName =
                $"{Guid.NewGuid()}{extension}";


            // Create the complete physical file path.
            var filePath = Path.Combine(
                uploadFolder,
                uniqueFileName);

            // Create the file on the server.
            using (var stream = new FileStream(
                filePath,
                FileMode.Create))
            {
                // Copy the uploaded CV into the file.
                await createUserProfileDto.CVFile
                    .CopyToAsync(stream);
            }

            var cv = new CV
            {
                CVID = Guid.NewGuid(),

                UserID = createUserProfileDto.UserID,

                // Original filename.
                FileName =
                  createUserProfileDto.CVFile.FileName,

                // Path stored in the database.
                FilePath =
                  $"/Uploads/CVs/{uniqueFileName}",

                UploadDate = DateTime.Now
            };

            // Add CV to the database.
            await _context.CVs.AddAsync(cv);


            var profile = new UserProfile
            {
                ProfileID = Guid.NewGuid(),

                UserID = createUserProfileDto.UserID,

                Experience =
                     createUserProfileDto.Experience
            };

            await _context.UserProfiles.AddAsync(profile);
            await _context.SaveChangesAsync();

            var profileDto = new UserProfileDto
            {
                ProfileID = profile.ProfileID,

                UserID = profile.UserID,

                Experience = profile.Experience,

                CVID = cv.CVID,

                CVFileName = cv.FileName,

                CVPath = cv.FilePath,

                CVUploadDate = cv.UploadDate
            };


            return CreatedAtAction(
                nameof(GetUserProfileById),
                new { id = profile.ProfileID },
                profileDto);        
        }


        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserProfile(Guid id,[FromForm] UpdateUserProfileDto updateUserProfileDto)
        {

            var profile = await _context.UserProfiles.FindAsync(id);

            // Check if the profile exists.
            if (profile == null)
            {
                return NotFound("User Profile not found.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (profile.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            // Update the user's experience.
            profile.Experience = updateUserProfileDto.Experience;

            // Check if the user selected a new CV.
            if (updateUserProfileDto.CVFile != null)
            {
                // Find the user's current CV.
                var oldCV = await _context.CVs
                    .FirstOrDefaultAsync(c => c.UserID == profile.UserID);

                // Delete the old CV file.
                if (oldCV != null)
                {
                    var oldFilePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        oldCV.FilePath.TrimStart('/')
                            .Replace("/", Path.DirectorySeparatorChar.ToString()));

                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }

                    // Delete the old CV from the database.
                    _context.CVs.Remove(oldCV);
                }

                // Get the new file extension.
                var extension = Path
                    .GetExtension(updateUserProfileDto.CVFile.FileName)
                    .ToLower();

                // Allowed CV file types.
                var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(
                        "Only PDF, DOC and DOCX files are allowed.");
                }

                // Maximum CV size is 5 MB.
                if (updateUserProfileDto.CVFile.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(
                        "CV file size cannot exceed 5 MB.");
                }

                // Folder where CV files are stored.
                var uploadFolder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "Uploads",
                    "CVs");

                // Create the folder if it doesn't exist.
                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                // Give the new CV a unique filename.
                var newFileName =
                    Guid.NewGuid() + extension;

                // Create the full file path.
                var newFilePath = Path.Combine(
                    uploadFolder,
                    newFileName);

                // Save the new CV.
                using (var stream = new FileStream(
                    newFilePath,
                    FileMode.Create))
                {
                    await updateUserProfileDto.CVFile
                        .CopyToAsync(stream);
                }

                // Create the new CV database record.
                var newCV = new CV
                {
                    CVID = Guid.NewGuid(),

                    UserID = profile.UserID,

                    FileName = updateUserProfileDto.CVFile.FileName,

                    FilePath =
                        $"/Uploads/CVs/{newFileName}",

                    UploadDate = DateTime.Now
                };

                await _context.CVs.AddAsync(newCV);
            }

            // Save all changes.
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            // Find the profile.
            var profile = await _context.UserProfiles.FindAsync(id);

            if (profile == null)
            {
                return NotFound("User Profile not found.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (profile.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }


            var cv = await _context.CVs
                     .FirstOrDefaultAsync(c => c.UserID == profile.UserID);

            if (cv == null)
            {
                return NotFound("CV not found.");
            }

            // Create the physical path to the CV file.
            var filePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                cv.FilePath.TrimStart('/')
                    .Replace("/", Path.DirectorySeparatorChar.ToString()));

            // Delete the actual CV file.
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            // Delete the CV from the database.
            _context.CVs.Remove(cv);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
