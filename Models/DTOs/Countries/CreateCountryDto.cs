using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Countries
{
    public class CreateCountryDto
    {
        [Required]
        [StringLength(100)]
        public string CountryName { get; set; } = string.Empty;
    }
}
