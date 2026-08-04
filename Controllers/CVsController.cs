using HirePoint.Data;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CVsController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public CVsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetCVs")]
        //GET: api/CVs -GET ALL ENDPOINT
        public async Task<IActionResult> GetCVs()
        {

            var cv = await _context.CVs.Include(c => c. User).ToListAsync();
            return Ok(cv);
        }

        [HttpGet("GetCVById/{id}")]
        public async Task<IActionResult> GetCVById(Guid id)
        {
            var cv = await _context.CVs.FindAsync(id);
            if (cv == null)
            {
                return NotFound("CV not found");
            }
            return Ok(cv);
        }


        [HttpPost]
        public async Task<IActionResult> CreateCV(CV cv)
        {
            await _context.CVs.AddAsync(cv); 
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCVById), new { id = cv.CVID }, cv);  
        }

        [HttpPut("UpdateCV/{id}")]
        public async Task<IActionResult> UpdateCV(Guid id, CV cv)
        {
            if (id != cv.CVID)
                return BadRequest("CV ID does not match");

            var existingCV = await _context.CVs.FindAsync(id);

            if (existingCV == null)
            {
                return NotFound("CV not found");
            }

            existingCV.FileName = cv.FileName;
            existingCV.FilePath = cv.FilePath;


            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("DeleteCV/{id}")]
        public async Task<IActionResult> DeleteCV(Guid id)
        {
            var cv = await _context.CVs.FindAsync(id);

            if (cv == null)
            {
                return NotFound("CV not found");
            }

            _context.CVs.Remove(cv);
            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}
