namespace MonitorBackend.Models
{
    public class SystemMetrics
    {
        public DateTime Timestamp { get; set; }
        public double CpuUsage { get; set; }          // %
        public double MemoryUsage { get; set; }       // %
        public double DiskUsage { get; set; }         // %
        public int ProcessCount { get; set; }         // quantidade
        public long Uptime { get; set; }              // segundos
        public double NetworkIn { get; set; }         // MB/s
        public double NetworkOut { get; set; }        // MB/s
    }
}