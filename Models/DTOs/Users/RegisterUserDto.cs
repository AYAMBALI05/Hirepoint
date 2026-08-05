using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Users
{
    public class RegisterUserDto
    {
        [Required]
        [StringLength(50)] //prevents names longer than 50 characters from being entered
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }
        [Required]
        [EmailAddress] //Checks if the email is in a valid format
        public string Email { get; set; }
        [Required]
        [MinLength(8)] //enforces a minimum password length of 8 characters
        public string Password { get; set; }
        [Required]
        [Compare("Password", ErrorMessage = "Passwords do not match.")] //checks if the ConfirmPassword matches the Password property
        public string ConfirmPassword { get; set; }
        [Required] //ensures user selects a role from the dropdown list in the signup form
        public int RoleID { get; set; } 
        [Required] //ensures user selects a city from the dropdown list in the signup form
        public int CityID { get; set; }
    }
}
