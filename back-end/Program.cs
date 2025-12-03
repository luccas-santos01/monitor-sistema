var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS para permitir o Vite
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVite",
        policy => policy
            .WithOrigins("http://localhost:5173") // Porta padrão do Vite
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowVite");
app.UseAuthorization();
app.MapControllers();

// Endpoint simples de teste
app.MapGet("/", () => "🚀 Backend .NET 8 funcionando!");
app.MapGet("/api/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });

// Endpoint de métricas (mockado por enquanto)
app.MapGet("/api/metrics", () =>
{
    var random = new Random();
    return new
    {
        cpu = Math.Round(random.NextDouble() * 100, 1),
        memory = Math.Round(60 + random.NextDouble() * 30, 1),
        disk = Math.Round(40 + random.NextDouble() * 40, 1),
        processes = random.Next(100, 300),
        uptime = random.Next(3600, 86400),
        timestamp = DateTime.UtcNow
    };
});

app.Run();