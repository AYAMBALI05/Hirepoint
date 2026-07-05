namespace HirePoint.Models.Entities
{
    public class Jobs
    {
        //Stores every job vacancy posted by recruiters
        public Guid JobID { get; set; }
        public string CompanyID { get; set; } //SUPPOSED TO BE A FOREIGNKEY
        public string Title { get; set; }
        public string Description { get; set; } //Details about job responsibilities
      //  public string Responsibility { get; set; } - remove on the DB
        public float SalaryRange { get; set; }
        public string qualificationsRequired { get; set; }
        public DateTime EmployementDate { get; set; }//spelt wrong - remove unimportant
        public DateTime ContractDuration { get; set; } //employment type aswell
        public string ExperienceLevel { get; set; }//What is this for? REMOVE
        public int NumberOfPositions { get; set; } //add 
        public int LocationID { get; set; } //FOREIGNKEY
        public DateTime PostDate { get; set; } //change from CreatedDate
        public DateTime ClosingDate { get; set; } 
    }
}
