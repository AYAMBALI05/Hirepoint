namespace HirePoint.Models.Entities
{
    public class UserProfiles
    {
        /*Will store profiles of users - different from users table, this is where
        they will set up their account*/
        public int ProfileID { get; set; }
        public int UserID { get; set; }
        public string Experience { get; set; }
        public string Education {  get; set; }
        public string Skills { get; set; }
        public string CV { get; set; }
    }
}
