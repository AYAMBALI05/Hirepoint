namespace HirePoint.Models.Entities
{
    public class Country
    {
        public int CountryID { get; set; }
        public string CountryName { get; set; }

        public ICollection<Province> Provinces { get; set; }
    }
}
