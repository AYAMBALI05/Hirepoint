using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Cities
{
    public class UpdateCityDto
    {
        [Required]
        [StringLength(100)]
        public string CityName { get; set; } = string.Empty;

        // A city may be reassigned to another province.
        [Required]
        public int ProvinceID { get; set; }
    }
}
