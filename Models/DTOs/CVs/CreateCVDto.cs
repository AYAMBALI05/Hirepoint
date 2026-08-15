using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.CVs
{
    public class CreateCVDto
    {
        [Required]
        public Guid UserID { get; set; }

        [Required]
        public IFormFile CVFile { get; set; } = null!;
    }
}
