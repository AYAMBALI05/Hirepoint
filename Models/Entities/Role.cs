namespace HirePoint.Models.Entities
{
    public class Role
    {
        //aDD ON DB
        public int RoleID { get; set; }
        public required string RoleName { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
