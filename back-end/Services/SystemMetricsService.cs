using System.Diagnostics;
using System.Runtime.Versioning;
using MonitorBackend.Models;

namespace MonitorBackend.Services
{
    public interface ISystemMetricsService
    {
        Task<SystemMetrics> GetMetricsAsync();
    }

    // Esta classe SÓ funciona no Windows
    [SupportedOSPlatform("windows")]
    public class WindowsMetricsService : ISystemMetricsService
    {
        public async Task<SystemMetrics> GetMetricsAsync()
        {
            return await Task.Run(() => GetRealWindowsMetrics());
        }

        private SystemMetrics GetRealWindowsMetrics()
        {
            var metrics = new SystemMetrics
            {
                Timestamp = DateTime.UtcNow,
                CpuUsage = GetCpuUsage(),
                MemoryUsage = GetMemoryUsage(),
                DiskUsage = GetDiskUsage(),
                ProcessCount = Process.GetProcesses().Length,
                Uptime = GetUptime(),
                NetworkIn = 0.5,  // Vamos implementar depois
                NetworkOut = 0.2   // Vamos implementar depois
            };

            return metrics;
        }

        private double GetCpuUsage()
        {
            try
            {
                using (var cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total"))
                {
                    // Primeira leitura é sempre 0
                    cpuCounter.NextValue();
                    System.Threading.Thread.Sleep(1000); // Espera 1 segundo

                    // Segunda leitura é o valor real
                    return Math.Round(cpuCounter.NextValue(), 1);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro CPU: {ex.Message}");
                return 25.0; // Fallback
            }
        }

        private double GetMemoryUsage()
        {
            try
            {
                using (var memCounter = new PerformanceCounter("Memory", "% Committed Bytes In Use"))
                {
                    return Math.Round(memCounter.NextValue(), 1);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro Memória: {ex.Message}");
                return 60.0; // Fallback
            }
        }

        private double GetDiskUsage()
        {
            try
            {
                using (var diskCounter = new PerformanceCounter("LogicalDisk", "% Disk Time", "_Total"))
                {
                    return Math.Round(diskCounter.NextValue(), 1);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro Disco: {ex.Message}");
                return 35.0; // Fallback
            }
        }

        private long GetUptime()
        {
            try
            {
                using (var uptime = new PerformanceCounter("System", "System Up Time"))
                {
                    uptime.NextValue(); // Primeira leitura
                    return (long)uptime.NextValue(); // Segunda leitura é o valor
                }
            }
            catch
            {
                // Fallback: tempo desde início do processo
                return (long)(DateTime.UtcNow - Process.GetCurrentProcess().StartTime.ToUniversalTime()).TotalSeconds;
            }
        }
    }
}