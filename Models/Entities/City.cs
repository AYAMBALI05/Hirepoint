namespace HirePoint.Models.Entities
{
    public class City
    {
        public int CityID { get; set; }

        public string CityName { get; set; }

        // Foreign Key - identifies the province this city belongs to
        public int ProvinceID { get; set; }

        // Navigation Property - accesses the related Province
        public Province Province { get; set; }

        // Navigation Property - accesses all users who are located in this city
        public ICollection<User> Users { get; set; } = new List<User>();

        // Navigation Property - accesses all companies located in this city
        public ICollection<Company> Companies { get; set; } = new List<Company>();

        // Navigation Property - accesses all jobs available in this city
        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}
