namespace HirePoint.Models.DTOs.UserProfiles
{
    public class UserProfileDto
    {
        public Guid ProfileID { get; set; }

        public Guid UserID { get; set; }

        public string Experience { get; set; }

        public string CVPath { get; set; }
    }
}
