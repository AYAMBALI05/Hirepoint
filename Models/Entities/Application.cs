using HirePoint.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.Entities
{
    public class Application
    {
      
            // Primary Key - uniquely identifies each application
            [Key]
            public Guid ApplicationID { get; set; }

            // Foreign Key - identifies the user applying for the job
            public Guid UserID { get; set; }

            // Navigation Property - accesses the related User
            public User User { get; set; }

            // Foreign Key - identifies the job being applied for
            public Guid JobID { get; set; }

            // Navigation Property - accesses the related Job
            public Job Job { get; set; }

            // Foreign Key - identifies the CV used for the application
            public Guid CVID { get; set; }

            // Navigation Property - accesses the related CV
            public CV CV { get; set; }

        public string QualificationRequired { get; set; }

            // Stores the date and time the application was submitted
            public DateTime ApplicationDate { get; set; } = DateTime.Now;

        // Stores the current status of the application
        // Examples: Pending, Shortlisted, Interview, Accepted, Rejected
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
        // Stores feedback from the recruiter
        public string? Feedback { get; set; }

        // Navigation Property - accesses all job applications submitted by this user
    }
}
