namespace HirePoint.Models.DTOs.Jobs
{
    public class JobDto
    {
        public Guid JobID { get; set; }

        public Guid CompanyID { get; set; }
        public string CompanyName { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public float Salary { get; set; }
        public string ExperienceRequired { get; set; }

        public string EmploymentType { get; set; }
        public int AvailableVacancies { get; set; }

        public int CityID { get; set; }
        public string CityName { get; set; }

        public DateTime PostDate { get; set; }
        public DateTime ClosingDate { get; set; }
    }
}
