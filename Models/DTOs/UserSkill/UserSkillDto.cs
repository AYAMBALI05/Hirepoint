namespace HirePoint.Models.DTOs.UserSkill
{
    public class UserSkillDto
    {
        public Guid UserSkillID { get; set; }

        public Guid UserID { get; set; }

        public int SkillID { get; set; }
        public string SkillName { get; set; }
    }
}
