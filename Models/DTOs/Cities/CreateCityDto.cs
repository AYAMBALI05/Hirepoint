using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Cities
{
    public class CreateCityDto
    {
        [Required]
        [StringLength(100)]
        public string CityName { get; set; } = string.Empty;

        // Every city must belong to a province.
        [Required]
        public int ProvinceID { get; set; }
    }
}
