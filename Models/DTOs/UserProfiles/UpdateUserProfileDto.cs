using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.UserProfiles
{
    public class UpdateUserProfileDto
    {
        [Required]
        public string Experience { get; set; }

        // Allows the user to choose a new CV from their computer.
        public IFormFile? CVFile { get; set; }
    }
}
