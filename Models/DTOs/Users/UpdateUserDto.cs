using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Users
{
    public class UpdateUserDto
    {
        //Contains fields that the user is only allowed to update/modify.
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int RoleID { get; set; }

        [Required]
        public int CityID { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}
