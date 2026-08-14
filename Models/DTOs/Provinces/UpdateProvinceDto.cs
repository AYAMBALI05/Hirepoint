using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Provinces
{
    public class UpdateProvinceDto
    {
        [Required]
        [StringLength(100)]
       
        public string ProvinceName { get; set; } = string.Empty;
      
        //Every province must belong to a country
        [Required]
        public int CountryID { get; set; }
    }
}
