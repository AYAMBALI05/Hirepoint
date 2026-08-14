namespace HirePoint.Models.DTOs.Authentication
{
    public class RegisterDto
    {
        //sends the information needed to create an account.
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        public int RoleID { get; set; }

       
    }
}