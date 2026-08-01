"use client";

import React from 'react';
import { Agent } from '@/lib/supabase';
import { Play, Cpu, HardDrive, Clock, CheckCircle2, AlertTriangle, Activity, XCircle } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onRunTask: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onRunTask }) => {
  const getStatusBadge = () => {
    switch (agent.status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>RUNNING</span>
          </span>
        );
      case 'IDLE':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>IDLE</span>
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>ERROR</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span>OFFLINE</span>
          </span>
        );
    }
  };

  const getRelativeTime = (timestamp: string) => {
    try {
      const diff = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
      if (diff < 10) return 'just now';
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      return `${Math.floor(diff / 3600)}h ago`;
    } catch {
      return 'unknown';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
      {/* Background Ambient Glow */}
      <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl opacity-20 pointer-events-none transition-all ${
        agent.status === 'RUNNING' ? 'bg-emerald-500 opacity-40' : 'bg-indigo-500'
      }`} />

      <div>
        {/* Top Header: Category & Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-medium">
            {agent.category}
          </span>
          {getStatusBadge()}
        </div>

        {/* Agent Title & Description */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
          {agent.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {agent.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-black/30 border border-white/5">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>CPU</span>
              </span>
              <span className="font-mono text-gray-200">{agent.cpu_usage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, agent.cpu_usage))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="flex items-center space-x-1">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                <span>RAM</span>
              </span>
              <span className="font-mono text-gray-200">{agent.mem_usage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, agent.mem_usage))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Heartbeat & Run Action */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
        <div className="flex items-center space-x-1 text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Heartbeat: {getRelativeTime(agent.last_heartbeat)}</span>
        </div>

        <button
          onClick={() => onRunTask(agent)}
          disabled={agent.status === 'RUNNING'}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all shadow-md active:scale-95 ${
            agent.status === 'RUNNING'
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 shadow-indigo-600/30 hover:shadow-indigo-500/50'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>작업 실행</span>
        </button>
      </div>
    </div>
  );
};
