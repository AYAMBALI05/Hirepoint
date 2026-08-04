using HirePoint.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HirePoint.Models.Entities;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase 
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("GetCVs")]
        //GET: api/CVs -GET ALL ENDPOINT
        public async Task<IActionResult> GetCVs() 
        {
            
            var cv = await _context.CVs.ToListAsync(); 
            return Ok(cv);
        }

        [HttpGet("GetCVById/{id}")] 
        public async Task<IActionResult> GetUserById(Guid id) 
        {
            var user = await _context.Users.FindAsync(id); 
            if (user == null)
            {
                return NotFound("User not found");
            }
            return Ok(user);
        }


       

        [HttpPost]
        public async Task<IActionResult> CreateUser(User user)
        {
            await _context.Users.AddAsync(user); 
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserById), new { id = user.UserID }, user); 
        }

        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, User user)
        {
            if (id != user.UserID)
                return BadRequest("User ID does not match");

            var existingUser = await _context.Users.FindAsync(id);

            if(existingUser == null)
            {
                return NotFound("User not found");
            }

            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password; 
            existingUser.RoleID = user.RoleID;
            existingUser.CityID = user.CityID;
            existingUser.IsActive = user.IsActive;
           

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
           
            if (user == null)
            {
                return NotFound("User not found");
            }
          
            user.IsActive = false; //Deactivate the user account
            user.IsDeleted = true; //Soft delete: mark the user as deleted instead of removing it from the database
            user.DeletedDate = DateTime.Now; 

            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
