using HirePoint.Data;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

            return Ok(companies);
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

            return Ok(company);
        }

        // POST: api/Companies
        // Creates a new company
        [HttpPost]
        public async Task<IActionResult> CreateCompany(Company company)
        {
            // Prevents duplicate company names
            var companyExists = await _context.Companies
                .AnyAsync(c => c.CompanyName == company.CompanyName);

            if (companyExists)
            {
                return BadRequest("A company with this name already exists.");
            }

            await _context.Companies.AddAsync(company);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCompanyById),
                new { id = company.CompanyID },
                company);
        }

        // PUT: api/Companies/{id}
        // Updates an existing company
        [HttpPut("UpdateCompany/{id}")]
        public async Task<IActionResult> UpdateCompany(Guid id, Company company)
        {
            if (id != company.CompanyID)
            {
                return BadRequest("Company ID does not match.");
            }

            var existingCompany = await _context.Companies.FindAsync(id);

            if (existingCompany == null)
            {
                return NotFound("Company not found.");
            }

            existingCompany.UserID = company.UserID;
            existingCompany.CompanyName = company.CompanyName;
            existingCompany.Description = company.Description;
            existingCompany.Email = company.Email;
            existingCompany.CityID = company.CityID;
            existingCompany.PhoneNumber = company.PhoneNumber;
            existingCompany.Website = company.Website;
            existingCompany.LogoPath = company.LogoPath;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Companies/{id}
        // Deletes a company
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
