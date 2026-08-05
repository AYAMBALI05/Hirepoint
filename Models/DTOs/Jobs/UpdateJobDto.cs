namespace HirePoint.Models.DTOs.Jobs
{
    public class UpdateJobDto
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public float Salary { get; set; }
        public string ExperienceRequired { get; set; }

        public string EmploymentType { get; set; }
        public int AvailableVacancies { get; set; }

        public int CityID { get; set; }

        public DateTime ClosingDate { get; set; }
    }
}
