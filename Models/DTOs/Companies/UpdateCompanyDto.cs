using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Companies
{
    public class UpdateCompanyDto
    {
        [Required]
        public Guid UserID { get; set; }

        [Required]
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int CityID { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        public string? Website { get; set; }

        public string? LogoPath { get; set; }
    }
}
