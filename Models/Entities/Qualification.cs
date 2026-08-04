using Microsoft.Identity.Client;

namespace HirePoint.Models.Entities
{
    public class Qualification
    {
        public int QualificationID {  get; set; }
        public string QualificationName { get; set; }
        // Navigation Property - accesses all jobs that require this qualification
        public ICollection<JobQualification> JobQualifications { get; set; } = new List<JobQualification>();
        public ICollection<UserQualification> UserQualifications { get; set; } = new List<UserQualification>();

    }
}
