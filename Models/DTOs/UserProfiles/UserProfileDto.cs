namespace HirePoint.Models.DTOs.UserProfiles
{
    public class UserProfileDto
    {
        public Guid ProfileID { get; set; }

        public Guid UserID { get; set; }

        public string? FullName { get; set; }

        public string? Email { get; set; }

        public string Experience { get; set; }

        public Guid? CVID { get; set; }

        public string? CVFileName { get; set; }

        public string? CVPath { get; set; }

        public DateTime? CVUploadDate { get; set; }
    }
}
