namespace HirePoint.Models.DTOs.Users
{
    public class UserDto
    {
        //Dto will be used to send user data to the client without exposing sensitive information like passwords
        //Only used by the administrator to view all users in the system
        public Guid UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int RoleID { get; set; }
        public string RoleName { get; set; } //The navigation property in our user entity allows us to access the role name directly, so we can include it in the DTO for convenience
        public int CityID { get; set; }
        public string CityName { get; set; }
        public bool IsActive { get; set; }
    }
}
