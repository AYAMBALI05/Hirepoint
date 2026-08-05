namespace HirePoint.Models.DTOs.SavedJobs
{
    public class SavedJobDto
    {
        public Guid SavedJobID { get; set; }

        public Guid UserID { get; set; }

        public Guid JobID { get; set; }

        public string JobTitle { get; set; }
        public string CompanyName { get; set; }
        public string CityName { get; set; }

        public DateTime SavedDate { get; set; }
    }
}
