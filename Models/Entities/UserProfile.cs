using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.Entities
{
    public class UserProfile
    {
        /*Will store profiles of users - different from users table, this is where
        they will set up their account*/

        [Key]
        public Guid ProfileID { get; set; }
        // Foreign Key
        public Guid UserID { get; set; }
        // Navigation Property
        public User User { get; set; }
       
        public string Experience { get; set; }
      //  public string Education { get; set; }
       // public string CVPath { get; set; }
    }
}
