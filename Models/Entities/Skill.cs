namespace HirePoint.Models.Entities
{
    public class Skill
    {
        public int SkillID { get; set; }
        public required string SkillName { get; set; }
        public ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();

    }
}
