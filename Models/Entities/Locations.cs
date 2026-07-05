namespace HirePoint.Models.Entities
{
    public class Locations
    {
        public Guid LocationID { get; set; }
        public string StreetName   { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
    }
}
