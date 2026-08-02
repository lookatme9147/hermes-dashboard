"use client";

import React, { useState } from 'react';
import { FileText, Clock, X, ExternalLink, Copy, Check, TrendingUp } from 'lucide-react';

interface ReportViewerProps {
  tasks: any[];
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'stock_management' | 'threads_monitor' | 'youtube_subscription'>('ALL');

  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED' || t.status === 'FAILED');

  const filteredTasks = completedTasks.filter((t) => {
    if (activeTab === 'ALL') return true;
    return t.agent_id === activeTab;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-5 flex flex-col h-[480px]">
      {/* Header & Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-gray-200">리포트 보관함</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
            {completedTasks.length}건
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activeTab === 'ALL' ? 'bg-indigo-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveTab('stock_management')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activeTab === 'stock_management' ? 'bg-indigo-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📈 주식
          </button>
          <button
            onClick={() => setActiveTab('threads_monitor')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activeTab === 'threads_monitor' ? 'bg-indigo-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🧵 Tech뉴스
          </button>
        </div>
      </div>

      {/* Report Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 text-xs italic bg-black/20 rounded-xl border border-white/5">
          <TrendingUp className="w-8 h-8 text-gray-600 mb-2 opacity-50" />
          <span>아직 생성된 리포트가 없습니다.</span>
          <span className="text-[11px] text-gray-600 mt-1">에이전트를 실행하여 분석 보고서를 만들어보세요.</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-3 pr-1">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTask(t)}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-950/20 transition-all cursor-pointer group text-xs relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors">
                    {t.agent_id === 'stock_management' ? '📈 주식 분석 리포트' : t.agent_id === 'threads_monitor' ? '🧵 Tech 이슈 브리핑' : t.agent_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span>{new Date(t.created_at || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="bg-gray-900/80 p-2.5 rounded-lg font-mono text-gray-300 text-[11px] border border-gray-800 line-clamp-2 leading-relaxed">
                {t.summary || t.full_log || '리포트 원문 보기...'}
              </div>

              <div className="mt-2 text-[11px] text-indigo-400 font-medium group-hover:underline flex items-center justify-end space-x-1">
                <span>리포트 원문 열기</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Report Reader Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-3xl rounded-2xl border border-white/10 p-6 relative overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {selectedTask.agent_id === 'stock_management' ? '📊 주식 포트폴리오 분석 보고서' : '📰 이슈 브리핑 리포트'}
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    생성 시각: {new Date(selectedTask.created_at || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(selectedTask.full_log || selectedTask.summary || '')}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사됨!' : '마크다운 복사'}</span>
                </button>

                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Markdown Report Reader Content */}
            <div className="flex-1 overflow-y-auto terminal-scrollbar bg-gray-950 p-5 rounded-xl border border-white/5 text-gray-200 text-xs leading-relaxed font-sans select-text whitespace-pre-wrap">
              {selectedTask.full_log || selectedTask.summary || '리포트 내용이 없습니다.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
