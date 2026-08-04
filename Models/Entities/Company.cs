namespace HirePoint.Models.Entities
{
    public class Company
    {
        //Stores recruiter companies details
        public Guid CompanyID { get; set; }
        public Guid UserID { get; set; }

        // Navigation Property - accesses the related User (Recruiter)
        public User User { get; set; }

        public string CompanyName { get; set; }

        public string Description { get; set; }

        public string Email { get; set; }

        public int CityID { get; set; }
        public City City { get; set; }

        public string PhoneNumber { get; set; }

        // Stores the company website (optional)
        public string Website { get; set; }

        // Stores the company logo file path (optional)
        public string LogoPath { get; set; }

        // Navigation Property - accesses all jobs posted by this company
        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
      
}
