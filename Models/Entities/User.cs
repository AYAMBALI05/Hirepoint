using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace HirePoint.Models.Entities
{
    public class User
    {
        //Stores all users - Admins, Recruiters, and Job seekers
        public Guid UserID { get; set;}
        public required string  FirstName { get; set;}
        public required string LastName { get; set; } 
        public string Email { get; set; }
        public required string  Password { get; set; }

        [NotMapped]
        public  string ConfirmPassword { get; set; } //The [NotMapped] attribute tells Entity Framework to not create a confirmpassword column
        public required int  RoleID { get; set; } 
        public Role Role { get; set; }//This is navigation property 
      
        public UserProfile UserProfile { get; set; }

        public required bool IsActive { get; set; } = true; //To check if the account is active or not
        public required bool IsDeleted { get; set; } = false;// Indicates whether the account has been deleted
        public DateTime? DeletedDate { get; set; }   // Stores the date the account was deleted
        //Navigation Property - accesses all companies managed by this recruiter
        public ICollection<Company> Companies { get; set; } = new List<Company>();
        // Navigation Property - accesses all notifications received by this user
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<Application> Applications { get; set; } = new List<Application>();

        public ICollection<CV> CVs { get; set; } = new List<CV>();

        public ICollection<SavedJob> SavedJobs { get; set; } = new List<SavedJob>();




        //navigation properties (Role and Location) are not stored as columns—they're used by Entity Framework to link related tables

    }
}
