using HirePoint.Data;
using HirePoint.Models.DTOs.Companies;
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
    public class CompaniesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CompaniesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Companies
        // Retrieves all companies together with their recruiter and location
        [HttpGet]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _context.Companies
                .Include(c => c.User)
                .Include(c => c.City)
                .ToListAsync();

            var companyDtos = companies.Select(c => new CompanyDto
            {
                CompanyID = c.CompanyID,

                UserID = c.UserID,

                // Return the recruiter's full name instead of the entire User object.
                RecruiterName = c.User == null
                   ? null
                   : $"{c.User.FirstName} {c.User.LastName}",

                CompanyName = c.CompanyName,
                Description = c.Description,
                Email = c.Email,

                CityID = c.CityID,

                // Return the city name instead of the City object.
                CityName = c.City?.CityName,

                PhoneNumber = c.PhoneNumber,
                Website = c.Website,
                LogoPath = c.LogoPath
            });

            return Ok(companyDtos);

        }

        // GET: api/Companies/{id}
        // Retrieves a specific company
        [HttpGet("GetCompanyById/{id}")]
        public async Task<IActionResult> GetCompanyById(Guid id)
        {
            var company = await _context.Companies
                .Include(c => c.User)
                .Include(c => c.City)
                .FirstOrDefaultAsync(c => c.CompanyID == id);

            if (company == null)
            {
                return NotFound("Company not found.");
            }

            var companyDto = new CompanyDto
            {
                CompanyID = company.CompanyID,

                UserID = company.UserID,

                RecruiterName = company.User == null
                   ? null
                   : $"{company.User.FirstName} {company.User.LastName}",

                CompanyName = company.CompanyName,
                Description = company.Description,
                Email = company.Email,

                CityID = company.CityID,
                CityName = company.City?.CityName,

                PhoneNumber = company.PhoneNumber,
                Website = company.Website,
                LogoPath = company.LogoPath
            };

            return Ok(companyDto);
        }


        [Authorize(Roles = "2")]
        [HttpGet("MyCompany")]
        public async Task<IActionResult> GetMyCompany()
        {
            var userIDClaim = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userIDClaim == null)
            {
                return Unauthorized();
            }

            var userID = Guid.Parse(userIDClaim);


            var company = await _context.Companies
                .Include(c => c.User)
                .Include(c => c.City)
                .FirstOrDefaultAsync(
                    c => c.UserID == userID);


            if (company == null)
            {
                return NotFound(
                    "No company profile found.");
            }


            var companyDto = new CompanyDto
            {
                CompanyID = company.CompanyID,

                UserID = company.UserID,

                RecruiterName = company.User == null
                    ? null
                    : $"{company.User.FirstName} {company.User.LastName}",

                CompanyName = company.CompanyName,

                Description = company.Description,

                Email = company.Email,

                CityID = company.CityID,

                CityName = company.City?.CityName,

                PhoneNumber = company.PhoneNumber,

                Website = company.Website,

                LogoPath = company.LogoPath
            };


            return Ok(companyDto);
        }



        [Authorize(Roles = "2")]
        [HttpPost]
        public async Task<IActionResult> CreateCompany(
     CreateCompanyDto createCompanyDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var userIDClaim = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userIDClaim == null)
            {
                return Unauthorized();
            }

            var userID = Guid.Parse(userIDClaim);


            var recruiterAlreadyHasCompany =
                await _context.Companies
                    .AnyAsync(c => c.UserID == userID);

            if (recruiterAlreadyHasCompany)
            {
                return BadRequest(
                    "You already have a company profile.");
            }


            // Ensure the selected city exists.
            var cityExists = await _context.Cities
                .AnyAsync(c =>
                    c.CityID == createCompanyDto.CityID);

            if (!cityExists)
            {
                return BadRequest("City does not exist.");
            }


            // Prevent duplicate company names.
            var companyExists = await _context.Companies
                .AnyAsync(c =>
                    c.CompanyName ==
                    createCompanyDto.CompanyName);

            if (companyExists)
            {
                return BadRequest(
                    "A company with this name already exists.");
            }


            var company = new Company
            {
                CompanyID = Guid.NewGuid(),

                UserID = userID,

                CompanyName =
                    createCompanyDto.CompanyName,

                Description =
                    createCompanyDto.Description,

                Email =
                    createCompanyDto.Email,

                CityID =
                    createCompanyDto.CityID,

                PhoneNumber =
                    createCompanyDto.PhoneNumber,

                Website =
                    createCompanyDto.Website,

                LogoPath =
                    createCompanyDto.LogoPath
            };


            await _context.Companies.AddAsync(company);

            await _context.SaveChangesAsync();


            var createdCompany = await _context.Companies
                .Include(c => c.User)
                .Include(c => c.City)
                .FirstOrDefaultAsync(c => c.CompanyID == company.CompanyID);

            var companyDto = new CompanyDto
            {
                CompanyID = createdCompany.CompanyID,
                UserID = createdCompany.UserID,
                RecruiterName = createdCompany.User == null
                   ? null
                   : $"{createdCompany.User.FirstName} {createdCompany.User.LastName}",
                CompanyName = createdCompany.CompanyName,
                Description = createdCompany.Description,
                Email = createdCompany.Email,
                CityID = createdCompany.CityID,
                CityName = createdCompany.City?.CityName,
                PhoneNumber = createdCompany.PhoneNumber,
                Website = createdCompany.Website,
                LogoPath = createdCompany.LogoPath
            };

            return CreatedAtAction(
                nameof(GetCompanyById),
                new { id = company.CompanyID },
                companyDto);
        }

        [Authorize(Roles = "2")]
        [HttpPut("UpdateCompany/{id}")]
        public async Task<IActionResult> UpdateCompany(Guid id, UpdateCompanyDto updateCompanyDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCompany = await _context.Companies.FindAsync(id);

            if (existingCompany == null)
            {
                return NotFound("Company not found.");
            }

            // Ensure the recruiter exists.
            var recruiterExists = await _context.Users
                .AnyAsync(u => u.UserID == updateCompanyDto.UserID);

            if (!recruiterExists)
            {
                return BadRequest("Recruiter does not exist.");
            }

            // Ensure the city exists.
            var cityExists = await _context.Cities
                .AnyAsync(c => c.CityID == updateCompanyDto.CityID);

            if (!cityExists)
            {
                return BadRequest("City does not exist.");
            }

            // Prevent duplicate company names.
            var companyExists = await _context.Companies
                .AnyAsync(c =>
                    c.CompanyName == updateCompanyDto.CompanyName &&
                    c.CompanyID != id);

            if (companyExists)
            {
                return BadRequest("A company with this name already exists.");
            }

            // Update editable fields.
            existingCompany.UserID = updateCompanyDto.UserID;
            existingCompany.CompanyName = updateCompanyDto.CompanyName;
            existingCompany.Description = updateCompanyDto.Description;
            existingCompany.Email = updateCompanyDto.Email;
            existingCompany.CityID = updateCompanyDto.CityID;
            existingCompany.PhoneNumber = updateCompanyDto.PhoneNumber;
            existingCompany.Website = updateCompanyDto.Website;
            existingCompany.LogoPath = updateCompanyDto.LogoPath;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "2")]
        [HttpDelete("DeleteCompany/{id}")]
        public async Task<IActionResult> DeleteCompany(Guid id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
            {
                return NotFound("Company not found.");
            }

            // Prevents deleting a company that still has job postings
            var hasJobs = await _context.Jobs
                .AnyAsync(j => j.CompanyID == id);

            if (hasJobs)
            {
                return BadRequest("Cannot delete a company that has active job postings.");
            }

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
