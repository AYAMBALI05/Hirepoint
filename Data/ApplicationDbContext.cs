using Microsoft.EntityFrameworkCore; 
using HirePoint.Models;
using HirePoint.Controllers;
using HirePoint.Data;
using HirePoint.Models.Entities;

namespace HirePoint.Data
{
    public class ApplicationDbContext: DbContext //ApplicationDbContext inherits everything from Entity Framework's DbContext."
    {
        //THIS CLASS IS THE BRIDGE BETWEEN OUR APPLICATION AND THE DATABASE
       
        //Constructor(Database settings<eg. server name, db name, connection string> stored inside 'options'):passes them to the base DbContext class/parent class
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        //DbSet properties represent tables in the database. Each DbSet corresponds to a specific entity class, allowing us to perform CRUD operations on those entities.
        //General rule: Dbset<Model>Tablename { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Qualification> Qualifications { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<SavedJob> SavedJobs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<CV> CVs { get; set; }

        /*IMPORTANCE OF APPLICATIONDBCONTEXT: it is like a directory that knows about all of the tables
          Without it, Entity Framework has no idea these tables exist.*/
        #region explanatiom
        /* 
         During migration, When we run "Add-migration IntialCreate" command, Entity Framework looks at the ApplicationDbContext class to determine which tables need to be created in the database. It uses the DbSet properties defined in this class to generate the necessary SQL commands for creating the corresponding tables.
         */
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==========================
            // USER
            // ==========================

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleID)
                .OnDelete(DeleteBehavior.Restrict);

         

            // ==========================
            // USER PROFILE
            // ==========================

            modelBuilder.Entity<UserProfile>()
     .HasOne(up => up.User)
     .WithOne(u => u.UserProfile)
     .HasForeignKey<UserProfile>(up => up.UserID)
     .OnDelete(DeleteBehavior.Cascade);


            // ==========================
            // COMPANY
            // ==========================

            modelBuilder.Entity<Company>()
                .HasOne(c => c.User)
                .WithMany(u => u.Companies)
                .HasForeignKey(c => c.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Company>()
                .HasOne(c => c.City)
                .WithMany(c => c.Companies)
                .HasForeignKey(c => c.CityID)
                .OnDelete(DeleteBehavior.Restrict);


            // ==========================
            // JOB
            // ==========================

            modelBuilder.Entity<Job>()
                .HasOne(j => j.Company)
                .WithMany(c => c.Jobs)
                .HasForeignKey(j => j.CompanyID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Job>()
                .HasOne(j => j.City)
                .WithMany(c => c.Jobs)
                .HasForeignKey(j => j.CityID)
                .OnDelete(DeleteBehavior.Restrict);


            // ==========================
            // CV
            // ==========================

            modelBuilder.Entity<CV>()
                .HasOne(c => c.User)
                .WithMany(u => u.CVs)
                .HasForeignKey(c => c.UserID)
                .OnDelete(DeleteBehavior.Cascade);


            // ==========================
            // APPLICATION
            // ==========================

            modelBuilder.Entity<Application>()
                .HasOne(a => a.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.CV)
                .WithMany(c => c.Applications)
                .HasForeignKey(a => a.CVID)
                .OnDelete(DeleteBehavior.Restrict);


            // ==========================
            // SAVED JOB
            // ==========================

            modelBuilder.Entity<SavedJob>()
                .HasOne(s => s.User)
                .WithMany(u => u.SavedJobs)
                .HasForeignKey(s => s.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedJob>()
                .HasOne(s => s.Job)
                .WithMany(j => j.SavedJobs)
                .HasForeignKey(s => s.JobID)
                .OnDelete(DeleteBehavior.Cascade);


            // ==========================
            // NOTIFICATION
            // ==========================

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserID)
                .OnDelete(DeleteBehavior.Cascade);


            // ==========================
            // USER SKILLS
            // ==========================
            /*
            modelBuilder.Entity<UserSkill>()
                .HasOne(us => us.User)
                .WithMany(u => u.UserSkills)
                .HasForeignKey(us => us.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserSkill>()
                .HasOne(us => us.Skill)
                .WithMany(s => s.UserSkills)
                .HasForeignKey(us => us.SkillID)
                .OnDelete(DeleteBehavior.Cascade);
            */

            // ==========================
            // USER QUALIFICATIONS
            // ==========================
            /*
            modelBuilder.Entity<UserQualification>()
                .HasOne(uq => uq.User)
                .WithMany(u => u.UserQualifications)
                .HasForeignKey(uq => uq.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserQualification>()
                .HasOne(uq => uq.Qualification)
                .WithMany(q => q.UserQualifications)
                .HasForeignKey(uq => uq.QualificationID)
                .OnDelete(DeleteBehavior.Cascade);
            */

            // ==========================
            // JOB QUALIFICATIONS
            // ==========================
            /*
            modelBuilder.Entity<JobQualification>()
                .HasOne(jq => jq.Job)
                .WithMany(j => j.JobQualifications)
                .HasForeignKey(jq => jq.JobID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobQualification>()
                .HasOne(jq => jq.Qualification)
                .WithMany(q => q.JobQualifications)
                .HasForeignKey(jq => jq.QualificationID)
                .OnDelete(DeleteBehavior.Cascade);*/


            // ==========================
            // LOCATION
            // ==========================

            modelBuilder.Entity<Province>()
                .HasOne(p => p.Country)
                .WithMany(c => c.Provinces)
                .HasForeignKey(p => p.CountryID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<City>()
                .HasOne(c => c.Province)
                .WithMany(p => p.Cities)
                .HasForeignKey(c => c.ProvinceID)
                .OnDelete(DeleteBehavior.Restrict);

        }
       }
}
