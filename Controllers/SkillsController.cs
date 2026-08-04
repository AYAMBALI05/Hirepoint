using HirePoint.Data;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public SkillsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetSkills")]
        public async Task<IActionResult> GetSkills()
        {
            var skill = await _context.Skills.ToListAsync();
            return Ok(skill);
        }

        [HttpGet("GetSkillsById/{id}")]

        public async Task<IActionResult> GetSkillsById(int id)
        {
            var skill = await _context.Skills.FindAsync(id);
            if(skill == null)
            {
                return NotFound();
            }
            return Ok(skill);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSkill(Skill skill)
        {
            await _context.Skills.AddAsync(skill); 
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSkillsById), new { id = skill.SkillID }, skill);
        }

        [HttpPut("UpdateSkill/{id}")]
        public async Task<IActionResult> UpdateSkill(int id, Skill skill)
        {
            if (id != skill.SkillID)
                return BadRequest("Skill ID does not match");

            var existingSkill = await _context.Skills.FindAsync(id);

            if (existingSkill == null)
            {
                return NotFound("Skill not found");
            }

            existingSkill.SkillName = skill.SkillName;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("DeleteSkill/{id}")]
        public async Task<IActionResult> DeleteSkill(int id)
        {
            var skill = await _context.Skills.FindAsync(id);

            if (skill == null)
            {
                return NotFound("Skill not found");
            }

             _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
