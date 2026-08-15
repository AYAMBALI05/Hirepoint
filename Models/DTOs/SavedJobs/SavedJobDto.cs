namespace HirePoint.Models.DTOs.SavedJobs
{
    public class SavedJobDto
    {
        public Guid SavedJobID { get; set; }

        public Guid UserID { get; set; }

        
        public string? UserName { get; set; }

        public Guid JobID { get; set; }

        // Return useful information about the saved job
        // instead of exposing the entire Job entity.
        public string? JobTitle { get; set; }

        public string? CompanyName { get; set; }

        public int CityID { get; set; }

        public string? CityName { get; set; }

        public DateTime SavedDate { get; set; }
    }
}
