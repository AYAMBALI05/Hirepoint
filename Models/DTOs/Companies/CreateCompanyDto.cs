namespace HirePoint.Models.DTOs.Companies
{
    public class CreateCompanyDto
    {
        public Guid UserID { get; set; }

        public string CompanyName { get; set; }

        public string Description { get; set; }

        public string Email { get; set; }

        public int CityID { get; set; }

        public string PhoneNumber { get; set; }

        public string Website { get; set; }

        public string LogoPath { get; set; }
    }
}
