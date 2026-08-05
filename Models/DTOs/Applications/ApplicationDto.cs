namespace HirePoint.Models.DTOs.Applications
{
    public class ApplicationDto
    {
        public Guid ApplicationID { get; set; }

        public Guid UserID { get; set; }

        public Guid JobID { get; set; }
        public string JobTitle { get; set; }

        public Guid CVID { get; set; }
        public string CVFileName { get; set; }

        public DateTime ApplicationDate { get; set; }

        public string Status { get; set; }

        public string Feedback { get; set; }
    }
}
