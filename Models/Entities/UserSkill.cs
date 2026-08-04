namespace HirePoint.Models.Entities
{
    public class UserSkill
    {
        // Primary Key - uniquely identifies each UserSkill record
        public Guid UserSkillID { get; set; }

        // Foreign Key - identifies which user owns the skill
        public Guid UserID { get; set; }

        // Navigation Property - allows Entity Framework to access the related User
        public User User { get; set; }

        // Foreign Key - identifies which skill the user has
        public int SkillID { get; set; }

        // Navigation Property - allows Entity Framework to access the related Skill
        public Skill Skill { get; set; }
    }
}
