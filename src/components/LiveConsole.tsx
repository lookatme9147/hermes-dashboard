"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TaskLog } from '@/lib/supabase';
import { Terminal, Search, Trash2, ArrowDownCircle, RefreshCw } from 'lucide-react';

interface LiveConsoleProps {
  logs: TaskLog[];
  onClear?: () => void;
  activeTaskStatus?: string;
}

export const LiveConsole: React.FC<LiveConsoleProps> = ({ logs, onClear, activeTaskStatus }) => {
  const [filterText, setFilterText] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INFO' | 'ERROR'>('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesText = log.log_line.toLowerCase().includes(filterText.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesText && matchesLevel;
  });

  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[480px]">
      {/* Console Bar Header */}
      <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-gray-200">실시간 Execution Log 콘솔</h2>
          {activeTaskStatus && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse font-mono">
              ● {activeTaskStatus}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="로그 검색..."
              className="bg-gray-900/90 border border-gray-700 rounded-lg pl-8 pr-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 w-32 sm:w-40"
            />
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="bg-gray-900/90 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">전체 로그</option>
            <option value="INFO">INFO만</option>
            <option value="ERROR">ERROR만</option>
          </select>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded-lg border transition-colors ${
              autoScroll
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                : 'bg-gray-800 text-gray-400 border-gray-700'
            }`}
            title="Auto Scroll"
          >
            <ArrowDownCircle className="w-4 h-4" />
          </button>

          {/* Clear Logs */}
          {onClear && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              title="Clear Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal View Output */}
      <div className="flex-1 p-4 bg-black/90 font-mono text-xs overflow-y-auto terminal-scrollbar space-y-1.5 select-text">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 italic">
            대기 중... 작업이 실행되면 이곳에 실시간 stdout/stderr 로그가 스트리밍됩니다.
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const isError = log.level === 'ERROR' || log.log_line.toLowerCase().includes('error') || log.log_line.toLowerCase().includes('failed');
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            return (
              <div key={log.id || index} className="flex items-start space-x-2 leading-relaxed hover:bg-white/5 px-1 py-0.5 rounded">
                <span className="text-gray-600 select-none min-w-[50px] text-[10px] pt-0.5">{timeStr}</span>
                <span className={isError ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                  {isError ? '[ERROR]' : '[INFO]'}
                </span>
                <span className={isError ? 'text-rose-300' : 'text-gray-200'}>
                  {log.log_line}
                </span>
              </div>
            );
          })
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
};
