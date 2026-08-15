using HirePoint.Models.Enums;

namespace HirePoint.Models.DTOs.Applications
{
    public class ApplicationDto
    {
        public Guid ApplicationID { get; set; }

        public Guid UserID { get; set; }

        // Display the applicant's full name.
        public string? ApplicantName { get; set; }

        public Guid JobID { get; set; }

        // Display the job title.
        public string? JobTitle { get; set; }

    //    public string QualificationRequired { get; set; };
        public Guid CVID { get; set; }

        // Display the uploaded CV path.
        public string? CVPath { get; set; }

        public DateTime ApplicationDate { get; set; }

        public ApplicationStatus Status { get; set; }

        public string? Feedback { get; set; }
    }
}
