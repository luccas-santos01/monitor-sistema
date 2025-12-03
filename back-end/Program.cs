using MonitorBackend.Services;
using Microsoft.AspNetCore.Mvc;

#pragma warning disable CA1416 // Suprimir aviso de plataforma para WindowsMetricsService

var builder = WebApplication.CreateBuilder(args);

// Serviço Windows (dados REAIS)
builder.Services.AddSingleton<ISystemMetricsService, WindowsMetricsService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS para o React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

// Endpoint simples
app.MapGet("/", () => "✅ Backend Windows com dados REAIS");

// Endpoint principal
app.MapGet("/api/metrics", async ([FromServices] ISystemMetricsService metricsService) =>
{
    var metrics = await metricsService.GetMetricsAsync();
    return Results.Ok(metrics);
});

app.Run();