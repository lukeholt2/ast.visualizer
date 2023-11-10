using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;


WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews().AddNewtonsoftJson();

builder.Services.AddSpaStaticFiles(configuration => configuration.RootPath = "ClientApp/build");
builder.WebHost.ConfigureKestrel(opt =>
{
    int port = 8080;
    opt.AllowSynchronousIO = true;
    if (args.Length > 0)
        _ = int.TryParse(args[0], out port);
    if (args.Length > 2)
        opt.ListenLocalhost(port, listenOpts => listenOpts.UseHttps(args[1], args[2]));
    else
        opt.ListenLocalhost(port);
});

WebApplication? app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();
app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");
});

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    if (app.Environment.IsDevelopment())
        spa.UseReactDevelopmentServer(npmScript: "start");
});

app.Run();
