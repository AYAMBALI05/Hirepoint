namespace HirePoint.Models.Entities
{
    public class UserQualification
    {
        public int UserQualificationID { get; set; }

        // Foreign Key - identifies the user
        public Guid UserID { get; set; }

        // Navigation Property - accesses the related User
        public User User { get; set; }

        // Foreign Key - identifies the qualification
        public int QualificationID { get; set; }

        // Navigation Property - accesses the related Qualification
        public Qualification Qualification { get; set; }
    }
}
