namespace HirePoint.Models.Entities
{
    public class RecruiterCompanies
    {
        //Stores recruiter companies details
        public int CompanyID { get; set; }
        public int UserID { get; set; }
        public string CompanyName { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public int LocationID { get; set; }
        public string PhoneNumber { get; set; }
    }
}
