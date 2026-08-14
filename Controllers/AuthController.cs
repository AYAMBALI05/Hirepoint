using HirePoint.Data;
using HirePoint.Models.DTOs.Authentication;
using HirePoint.Models.Entities;
using HirePoint.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordService _passwordService;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context,PasswordService passwordService,IConfiguration configuration)
        {
            _context = context;
            _passwordService = passwordService;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check whether the passwords match.
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            // Check whether the email is already registered.
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == registerDto.Email);

            if (emailExists)
            {
                return BadRequest("An account with this email already exists.");
            }

            // Create the new user.
            var user = new User
            {
                UserID = Guid.NewGuid(),

                FirstName = registerDto.FirstName,

                LastName = registerDto.LastName,

                Email = registerDto.Email,

                // Hash the password before storing it.
                Password = _passwordService.HashPassword(
                    registerDto.Password),

                RoleID = registerDto.RoleID,


                IsActive = true,

                IsDeleted = false,

                DeletedDate = null
            };

            // Add the user to the Users table.
            await _context.Users.AddAsync(user);

            // Save the user to the database.
            await _context.SaveChangesAsync();

            return Ok("Account created successfully.");
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the user using their email.
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            // If no user was found, reject the login.
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Check the entered password against
            // the hashed password in the database.
            var passwordCorrect = _passwordService.VerifyPassword(
                loginDto.Password,
                user.Password);

            if (!passwordCorrect)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Make sure the account is active.
            if (!user.IsActive || user.IsDeleted)
            {
                return Unauthorized("This account is not active.");
            }

            // Information that will be stored inside the JWT.
            var claims = new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.UserID.ToString()),

                new Claim(
                    ClaimTypes.Email,
                    user.Email),

                new Claim(
                    ClaimTypes.Role,
                    user.RoleID.ToString())
            };

            // Get the secret JWT key from appsettings.json.
            var key = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                       _configuration["Jwt:Key"]!));

            // Create the credentials used to sign the token.
            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            // Create the JWT token.
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(
                        _configuration["Jwt:ExpiryMinutes"])),
                signingCredentials: credentials);

            // Convert the token into a string.
            var tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);

            // Prepare the response sent back to the frontend.
            var response = new LoginResponseDto
            {
                Token = tokenString,

                UserID = user.UserID,

                FirstName = user.FirstName,

                LastName = user.LastName,

                Email = user.Email,

                RoleID = user.RoleID
            };

            return Ok(response);
        }
    }
}
