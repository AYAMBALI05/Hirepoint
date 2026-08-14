namespace HirePoint.Models.DTOs.Cities
{
    public class CityDto
    {
        public int CityID { get; set; }
        public string CityName { get; set; } = string.Empty;
        public int ProvinceID { get; set; }
        public string? ProvinceName { get; set; }
        public int CountryID { get; set; }
        public string? CountryName { get; set; }
    }
}
