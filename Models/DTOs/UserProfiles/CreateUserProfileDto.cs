using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.UserProfiles
{
    public class CreateUserProfileDto
    {
        [Required]
        public Guid UserID { get; set; }

        [Required]
        public string Experience { get; set; } = string.Empty;

        public IFormFile CVFile { get; set; } = null!;
    }
}
