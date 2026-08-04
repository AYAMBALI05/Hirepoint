namespace HirePoint.Models.Entities
{
    public class SavedJob
    {
        public Guid SavedJobID { get; set; }
        public Guid UserID { get; set; } //serID stores the ID.

        // Navigation Property - accesses the related User
        public User User { get; set; } //gives you access to the entire User object.

        // Foreign Key - identifies the saved job
        public Guid JobID { get; set; }

        // Navigation Property - accesses the related Job
        public Job Job { get; set; }

        // Stores the date and time the job was saved
        public DateTime SavedDate { get; set; } = DateTime.Now;
    }
}
