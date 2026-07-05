namespace HirePoint.Models.Entities
{
    public class User
    {
        //Stores all users - Admins, Recruiters, and Job seekers
        public Guid UserID { get; set;}
        public string  FirstName { get; set;}
        public string LastName { get; set; } //ADD ON DATABASE
        public string  Email { get; set; }
        public string  Password { get; set; }
        public string  Role { get; set; } //CREATE A SEPARATE TABLE
        public int LocationID { get; set; } //Foreign key
        public bool IsActive { get; set; } //To check if the account is active or not

    }
}
