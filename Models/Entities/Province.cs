namespace HirePoint.Models.Entities
{
    public class Province
    {
        public int ProvinceID { get; set; }
        public string ProvinceName { get; set; }

        public int CountryID { get; set; }
        public Country Country { get; set; }

        public ICollection<City> Cities { get; set; }
    }
}
