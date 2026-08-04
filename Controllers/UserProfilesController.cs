using HirePoint.Data;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfilesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserProfilesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetUserProfiles")]
        //GET: api/UserProfiles -GET ALL ENDPOINT
        public async Task<IActionResult> GetUserProfiles() 
        {
            
            var profile = await _context.UserProfiles.Include(p => p.User).ToListAsync();  
            return Ok(profile);
        }

        [HttpGet("{id}")] 
        public async Task<IActionResult> GetUserProfileById(Guid id) 
        {
            var profile = await _context.UserProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.ProfileID == id); 
            if (profile == null)
            {
                return NotFound("User Profile not found");
            }
            return Ok(profile);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserProfile(UserProfile userProfile)
        {
            await _context.UserProfiles.AddAsync(userProfile); 
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserProfileById), new { id = userProfile.ProfileID }, userProfile); 
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserProfile(Guid id, UserProfile userProfile)
        {
            if (id != userProfile.ProfileID)
                return BadRequest("Profile ID does not match");

            var existingUserProfile = await _context.UserProfiles.FindAsync(id);

            if (existingUserProfile == null)
            {
                return NotFound("User Profile not found");
            }

            existingUserProfile.Experience = userProfile.Experience;
            existingUserProfile.CVPath = userProfile.CVPath;
          
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var profile = await _context.UserProfiles.FindAsync(id);

            if (profile == null)
            {
                return NotFound("User not found");
            }
             _context.UserProfiles.Remove(profile);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
