namespace HirePoint.Models.DTOs.Companies
{
    public class CompanyDto
    {
        public Guid CompanyID { get; set; }

        public Guid UserID { get; set; }

        // Useful for displaying which recruiter owns the company.
        public string? RecruiterName { get; set; }

        public string CompanyName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int CityID { get; set; }

        public string? CityName { get; set; }

        public string PhoneNumber { get; set; } = string.Empty;

        public string? Website { get; set; }

        public string? LogoPath { get; set; }
    }
}
