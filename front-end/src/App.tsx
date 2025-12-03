import { useEffect, useState } from 'react'
import axios from 'axios'
import { Cpu, MemoryStick, HardDrive, Activity, RefreshCw, Server } from 'lucide-react'

function App() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    processes: 0,
    uptime: 0,
    timestamp: ''
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      axios.get('/api/metrics')
        .then(response => {
          const data = response.data;
          setMetrics({
            cpu: data.cpuUsage,
            memory: data.memoryUsage,
            disk: data.diskUsage,
            processes: data.processCount,
            uptime: data.uptime,
            timestamp: new Date(data.timestamp).toLocaleString()
          });
        })
        .catch(console.error)
    }, 0)

    const interval = setInterval(() => {
      axios.get('/api/metrics')
        .then(response => {
          const data = response.data;
          setMetrics({
            cpu: data.cpuUsage,
            memory: data.memoryUsage,
            disk: data.diskUsage,
            processes: data.processCount,
            uptime: data.uptime,
            timestamp: new Date(data.timestamp).toLocaleString()
          });
        })
        .catch(console.error)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    // DIV PRINCIPAL COM w-screen (100% da viewport)
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6 p-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
              <Server className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Monitor do Sistema
              </h1>
              <p className="text-blue-200 text-lg">
                {metrics.timestamp 
                  ? `Última atualização: ${new Date(metrics.timestamp).toLocaleTimeString()}`
                  : 'Conectando ao servidor...'
                }
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => axios.get('/api/metrics').then(r => setMetrics(r.data))}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            <RefreshCw className="w-6 h-6" />
            <span className="text-lg">Atualizar Dados</span>
          </button>
        </div>

        {/* Grid de Métricas - Ocupando largura total */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Cada card com w-full */}
          {[
            { 
              title: 'CPU', 
              value: metrics.cpu, 
              icon: Cpu, 
              color: 'blue',
              unit: '%',
              description: 'Utilização do Processador'
            },
            { 
              title: 'Memória', 
              value: metrics.memory, 
              icon: MemoryStick, 
              color: 'green',
              unit: '%',
              description: 'Uso de Memória RAM'
            },
            { 
              title: 'Disco', 
              value: metrics.disk, 
              icon: HardDrive, 
              color: 'purple',
              unit: '%',
              description: 'Armazenamento em Uso'
            },
            { 
              title: 'Processos', 
              value: metrics.processes, 
              icon: Activity, 
              color: 'orange',
              unit: '',
              description: 'Processos Ativos'
            },
          ].map((item, index) => (
            <div 
              key={index}
              className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 bg-${item.color}-500/20 rounded-xl`}>
                      <item.icon className={`w-7 h-7 text-${item.color}-400`} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                  </div>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold text-${item.color}-400`}>
                    {item.value}
                    <span className="text-xl">{item.unit}</span>
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso apenas para % */}
              {item.unit === '%' && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(item.value, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8">Status do Servidor</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">Online</div>
              <div className="text-green-300">Backend .NET</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.processes}</div>
              <div className="text-blue-300">Processos Ativos</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {Math.floor(metrics.uptime / 3600)}h
              </div>
              <div className="text-purple-300">Tempo de Atividade</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl border border-amber-500/30">
              <div className="text-4xl font-bold text-amber-400 mb-2">5s</div>
              <div className="text-amber-300">Intervalo de Atualização</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-400">
            Sistema de Monitoramento em Tempo Real • Backend .NET 8 • Frontend React + Vite
          </p>
          <p className="text-gray-500 text-sm mt-2">
            As métricas são atualizadas automaticamente a cada 5 segundos
          </p>
        </div>
      </div>
    </div>
  )
}

export default App