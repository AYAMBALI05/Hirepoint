using HirePoint.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HirePoint.Models.Entities;
using HirePoint.Models.DTOs.Users;

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
        [Route("GetUsers")]
        //GET: api/Users -GET ALL ENDPOINT
        //Returns a list of all users
        //We are returning Dto objects instead of the actual user entities to avoid exposing sensitive information like passwords
        public async Task<IActionResult> GetUser() 
        {
            /*Loads the related Role and City tables.
             * Without Include(), Role and City would be null because Entity Framework
             * does not automatically load navigation properties.*/

            var users = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.City)
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
                                             //return both the CityID and the name of the role.
                                             //Allows frontend to display "Recruiter" instead of the number 2

                CityID = u.CityID,//returns CityID stored in Users table
                CityName = u.City?.CityName, // returns CityName stored in the cities table
                IsActive = u.IsActive
            });

            return Ok(userDtos);
        }

        [HttpGet("GetUserById/{id}")] 
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
        public async Task<IActionResult> CreateUser(RegisterUserDto registerUserDto)
        {
            if(ModelState.IsValid)
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
                RoleID = registerUserDto.RoleID, //stores selected role id in the database
                CityID = registerUserDto.CityID,
                IsActive = true, //New users are active by default
                IsDeleted = false //New users are not deleted by default
            };

            await _context.Users.AddAsync(user); 
            await _context.SaveChangesAsync();

            //Returning a Dto instead of a entity
            var userDto = new UserDto
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,

                RoleID = user.RoleID,
                RoleName = null, // Role wasn't loaded during creation

                CityID = user.CityID,
                CityName = null, // City wasn't loaded during creation

                IsActive = user.IsActive

            };
            return CreatedAtAction(
                  nameof(GetUserById),
                  new { id = user.UserID },
                  userDto);
        }

        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserDto updateUserDto)
        {
            //Checks if incoming data passed validation(validation attributes in the UpdateUserDto)
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }



            /* Removed because the UpdateUserDto does not contain a UserID property, and the ID is already being passed in the URL.
             * if (id != updateUserDto.UserID)
                  return BadRequest("User ID does not match");*/

            var existingUser = await _context.Users.FindAsync(id);

            if(existingUser == null)
            {
                return NotFound("User not found");
            }

            existingUser.FirstName = updateUserDto.FirstName;
            existingUser.LastName = updateUserDto.LastName;
            existingUser.Email = updateUserDto.Email;
            existingUser.RoleID = updateUserDto.RoleID;
            existingUser.CityID = updateUserDto.CityID;
            existingUser.IsActive = updateUserDto.IsActive;
           

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
