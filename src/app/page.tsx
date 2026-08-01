"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { AgentCard } from '@/components/AgentCard';
import { TaskDispatcher } from '@/components/TaskDispatcher';
import { LiveConsole } from '@/components/LiveConsole';
import { ReportViewer } from '@/components/ReportViewer';
import { supabase, isSupabaseConfigured, INITIAL_MOCK_AGENTS, Agent, Task, TaskLog } from '@/lib/supabase';
import { Cpu, HardDrive, Zap, Layers, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_MOCK_AGENTS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Fetch agents from DB
        const { data: agentData } = await supabase.from('agents').select('*');
        if (agentData && agentData.length > 0) {
          setAgents(agentData);
        }

        // Fetch recent tasks
        const { data: taskData } = await supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(20);
        if (taskData) {
          setTasks(taskData);
        }

        // Fetch recent logs
        const { data: logData } = await supabase.from('task_logs').select('*').order('timestamp', { ascending: true }).limit(100);
        if (logData) {
          setLogs(logData);
        }
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Subscribe to realtime if configured
    if (isSupabaseConfigured && supabase) {
      const channel = supabase.channel('dashboard_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => fetchDashboardData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchDashboardData())
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_logs' }, (payload) => {
          setLogs((prev) => [...prev, payload.new as TaskLog]);
        })
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, []);

  const handleDispatchTask = async (agentId: string, params: any) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      agent_id: agentId,
      status: 'PENDING',
      params,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tasks').insert({
        agent_id: agentId,
        params,
        status: 'PENDING'
      });
    } else {
      // Local Mock Execution
      setTasks((prev) => [newTask, ...prev]);
      setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, status: 'RUNNING' } : a));

      // Append mock initial log
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          task_id: newTaskId,
          timestamp: new Date().toISOString(),
          log_line: `Task '${agentId}' dispatched locally. Starting execution...`,
          level: 'INFO'
        }
      ]);

      // Simulate completion after 3 seconds
      setTimeout(() => {
        setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, status: 'IDLE' } : a));
        setTasks((prev) => prev.map((t) => t.id === newTaskId ? { ...t, status: 'COMPLETED', duration_sec: 3.2 } : t));
        setLogs((prev) => [
          ...prev,
          {
            id: Date.now(),
            task_id: newTaskId,
            timestamp: new Date().toISOString(),
            log_line: `[SUCCESS] Agent '${agentId}' completed task successfully in 3.2s.`,
            level: 'INFO'
          }
        ]);
      }, 3200);
    }
  };

  // Compute System Overview Metrics
  const activeCount = agents.filter((a) => a.status === 'RUNNING').length;
  const avgCpu = (agents.reduce((acc, a) => acc + (a.cpu_usage || 0), 0) / (agents.length || 1)).toFixed(1);
  const avgMem = (agents.reduce((acc, a) => acc + (a.mem_usage || 0), 0) / (agents.length || 1)).toFixed(1);

  return (
    <div className="min-h-screen pb-12">
      <Navbar onRefresh={fetchDashboardData} isRefreshing={isRefreshing} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">등록된 에이전트</p>
              <p className="text-xl font-bold text-white">{agents.length}개</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">실행 중인 작업</p>
              <p className="text-xl font-bold text-emerald-400">{activeCount}개 Active</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Local PC 평균 CPU</p>
              <p className="text-xl font-bold text-gray-200">{avgCpu}%</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Local PC 평균 RAM</p>
              <p className="text-xl font-bold text-gray-200">{avgMem}%</p>
            </div>
          </div>
        </div>

        {/* Multi-Agent Cards Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>멀티 에이전트 목록</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                {agents.length} Agents
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onRunTask={(a) => setSelectedAgent(a)}
              />
            ))}
          </div>
        </section>

        {/* Live Console & Report Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          <div className="lg:col-span-2">
            <LiveConsole
              logs={logs}
              onClear={() => setLogs([])}
              activeTaskStatus={activeCount > 0 ? `${activeCount} Task Running` : undefined}
            />
          </div>

          <div>
            <ReportViewer tasks={tasks} />
          </div>
        </div>
      </main>

      {/* Task Dispatcher Modal */}
      {selectedAgent && (
        <TaskDispatcher
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onDispatch={handleDispatchTask}
        />
      )}
    </div>
  );
}
