using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Countries
{
    public class UpdateCuntryDto
    {
        [Required]
        [StringLength(100)]
        public string CountryName { get; set; } = string.Empty;
    }
}
