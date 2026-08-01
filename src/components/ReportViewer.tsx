"use client";

import React from 'react';
import { FileText, CheckCircle, Clock, Tag } from 'lucide-react';

interface ReportViewerProps {
  tasks: any[];
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ tasks }) => {
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED' || t.status === 'FAILED');

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-gray-200">실행 결과 및 리포트 뷰어</h2>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          총 {completedTasks.length}건 실행됨
        </span>
      </div>

      {completedTasks.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-xs italic bg-black/20 rounded-xl border border-white/5">
          아직 완료된 작업 결과가 없습니다. 에이전트를 실행하여 리포트를 생성해 보세요.
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto terminal-scrollbar pr-1">
          {completedTasks.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all text-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-300">{t.agent_id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{t.duration_sec ? `${t.duration_sec}s` : 'N/A'}</span>
                </div>
              </div>

              <div className="bg-gray-900/80 p-2.5 rounded-lg font-mono text-gray-300 text-[11px] border border-gray-800 line-clamp-3">
                {t.summary || t.error_message || '작업이 정상적으로 마무리되었습니다.'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
