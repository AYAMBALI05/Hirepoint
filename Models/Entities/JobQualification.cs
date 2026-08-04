namespace HirePoint.Models.Entities
{
    public class JobQualification
    {
        // Primary Key - uniquely identifies each record
        public Guid JobQualificationID { get; set; }

        // Foreign Key - identifies the job
        public Guid JobID { get; set; }

        // Navigation Property - accesses the related Job
        public Job Job { get; set; }

        // Foreign Key - identifies the required qualification
        public int QualificationID { get; set; }

        // Navigation Property - accesses the related Qualification
        public Qualification Qualification { get; set; }
    }
}
