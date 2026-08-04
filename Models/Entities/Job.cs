using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace HirePoint.Models.Entities
{
    public class Job
    {
        //Stores every job vacancy posted by recruiters
        public Guid JobID { get; set; }
        public Guid CompanyID { get; set; } //SUPPOSED TO BE A FOREIGNKEY
        public Company Company { get; set; }
        public string Title { get; set; }
        public string Description { get; set; } //Details about job responsibilities
      //  public string Responsibility { get; set; } - remove on the DB
        public float Salary { get; set; }
        public string ExperienceRequired { get; set; }

        public string EmploymentType { get; set; } 
        public int AvailableVacancies { get; set; }
        public int CityID { get; set; }
        public City City { get; set; }

        public DateTime PostDate { get; set; } = DateTime.Now;
        public DateTime ClosingDate { get; set; }
        // Navigation Property - accesses all applications submitted for this job
        public ICollection<Application> Applications { get; set; } = new List<Application>();

        // Navigation Property - accesses all users who have saved this job
        public ICollection<SavedJob> SavedJobs { get; set; } = new List<SavedJob>();

        // Navigation Property - accesses all qualifications required for this job
        public ICollection<JobQualification> JobQualifications { get; set; } = new List<JobQualification>();
      
       
    }
}
