namespace HirePoint.Models.DTOs.SavedJobs
{
    public class CreateSavedJobDto
    {
        // Identifies the user saving the job.
        public Guid UserID { get; set; }

        // Identifies the job being saved.
        public Guid JobID { get; set; }
    }
}
