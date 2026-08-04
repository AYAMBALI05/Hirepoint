using HirePoint.Data;
using HirePoint.Models;     
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConn")));
#region Explanation
/* 
" builder.Services": is where you register services that your application will use.
                   : Think of it as a list of things your application needs.(Eg. Logging, Authentication, Email service)
".AddDbContext<ApplicationDbContext>()":tells ASP.NET Core that the application will use ApplicationDbContext to communicate with the database."
"options": used to configure your ApplicationDbContext
"x.UseSqlServer(...)": tells Entity Framework to use SQL Server as the database provider.
"builder.Configuration.GetConnectionString("DbConn")": retrieves the connection string named "DbConn" from your appsettings.json.

 THESE ARE REQUIRED FOR THE APPLICATION TO CONNECT TO THE DATABASE. WITHOUT THEM, THE APPLICATION CANNOT INTERACT WITH THE DATABASE.
 */
#endregion 



builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;     
    });// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
