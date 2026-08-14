namespace HirePoint.Models.DTOs.Authentication
{
    public class LoginResponseDto
    {
        //what the API will return after a successful login.
        public string Token { get; set; }

        public Guid UserID { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public int RoleID { get; set; }
    }
}
