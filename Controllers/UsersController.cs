using HirePoint.Data;
using HirePoint.Models.DTOs.Users;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [Authorize(Roles = "1")]
        [HttpGet]
        [Route("GetUsers")]
        //GET: api/Users -GET ALL ENDPOINT
        //Returns a list of all users
        //We are returning Dto objects instead of the actual user entities to avoid exposing sensitive information like passwords
        public async Task<IActionResult> GetUser() 
        {
            

            var users = await _context.Users
                .Include(u => u.Role)
                .ToListAsync();

            /*Convert each User Entity into a UserDto object.
             * This process is called "mapping".
             * The purpose is to only return the information that the client needs.*/

            var userDtos = users.Select(u => new UserDto
            {
                UserID = u.UserID,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                RoleID = u.RoleID,
                RoleName = u.Role?.RoleName, // Use null-conditional operator to avoid NullReferenceException if the role navigation property is null/ not loaded
                                             //return the name of the role.
                                             //Allows frontend to display "Recruiter" instead of the number 2
                IsActive = u.IsActive
            });

            return Ok(userDtos);
        }

        [Authorize(Roles = "1,2")]
        [HttpGet("GetUserById/{id}")] 
        public async Task<IActionResult> GetUserById(Guid id) 
        {
            var user = await _context.Users
                .Include(u => u.Role)
                           .FirstOrDefaultAsync(u => u.UserID == id);

                if (user == null)
                {
                    return NotFound("User not found");
                }


            var userDto = new UserDto
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                RoleID = user.RoleID,
                RoleName = user.Role?.RoleName,
                IsActive = user.IsActive


            };


            
            return Ok(userDto);
        }



     /*   [HttpPost]
        public async Task<IActionResult> CreateUser(RegisterUserDto registerUserDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //Map the RegisterUserDto to a User entity
            //EF can only save entities to the database, so dto must be converted back to entities
            var user = new User
            {
                UserID = Guid.NewGuid(),//generates  a new unique identifier for the user
                FirstName = registerUserDto.FirstName, //Copies registration data from the dto
                LastName = registerUserDto.LastName,
                Email = registerUserDto.Email,
                //We'll hash the passwords later
                Password = registerUserDto.Password, //Stores the users password in the database
                ConfirmPassword = registerUserDto.ConfirmPassword,
                RoleID = registerUserDto.RoleID, //stores selected role id in the database
                IsActive = true, //New users are active by default
                IsDeleted = false //New users are not deleted by default
            };

            await _context.Users.AddAsync(user); 
            await _context.SaveChangesAsync();

            var createdUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserID == user.UserID);

            //Returning a Dto instead of a entity
            var userDto = new UserDto
            {
                UserID = createdUser.UserID,
                FirstName = createdUser.FirstName,
                LastName = createdUser.LastName,
                Email = createdUser .Email,

                RoleID = createdUser.RoleID,
                RoleName = createdUser.Role?.RoleName, 
                IsActive = createdUser.IsActive

            };
            return CreatedAtAction(
                  nameof(GetUserById),
                  new { id = user.UserID },
                  userDto);
        }*/

        [Authorize(Roles = "1")]
        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserDto updateUserDto)
        {
            //Checks if incoming data passed validation(validation attributes in the UpdateUserDto)
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var existingUser = await _context.Users.FindAsync(id);

            if(existingUser == null)
            {
                return NotFound("User not found");
            }

            existingUser.FirstName = updateUserDto.FirstName;
            existingUser.LastName = updateUserDto.LastName;
            existingUser.Email = updateUserDto.Email;
            existingUser.RoleID = updateUserDto.RoleID; //Users should be allowed to reselect right role
            existingUser.IsActive = updateUserDto.IsActive;
           

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "1")]
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
