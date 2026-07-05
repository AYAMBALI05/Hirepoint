namespace HirePoint.Models.Entities
{
    public class Applications
    {
        public Guid ApplicationID { get; set; }
        public int UserID { get; set; }
        public int JobID { get; set; }
        public int CvID { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string Status { get; set; }
        public string Feedback { get; set; } //Add - Recruiter's comments or decision.
    }
}
