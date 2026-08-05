namespace HirePoint.Models.DTOs.UserQualifications
{
    public class UserQualificationDto
    {
        public int UserQualificationID { get; set; }

        public Guid UserID { get; set; }

        public int QualificationID { get; set; }
        public string QualificationName { get; set; }
    }
}
