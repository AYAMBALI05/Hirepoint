using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Companies
{
    public class CreateCompanyDto
    {
        // The recruiter that owns the company.
        [Required]
        public Guid UserID { get; set; }

        // Company name is required.
        [Required]
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        // Company location.
        [Required]
        public int CityID { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        // Optional fields.
        public string? Website { get; set; }

        public string? LogoPath { get; set; }
    }
}
