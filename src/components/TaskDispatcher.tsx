"use client";

import React, { useState } from 'react';
import { Agent } from '@/lib/supabase';
import { Play, X, Sliders, CheckCircle, AlertCircle } from 'lucide-react';

interface TaskDispatcherProps {
  agent: Agent | null;
  onClose: () => void;
  onDispatch: (agentId: string, params: any) => Promise<void>;
}

export const TaskDispatcher: React.FC<TaskDispatcherProps> = ({ agent, onClose, onDispatch }) => {
  const [loading, setLoading] = useState(false);
  const [paramsJson, setParamsJson] = useState('{}');
  const [selectedOption, setSelectedOption] = useState('DEFAULT');

  if (!agent) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(paramsJson);
      } catch {
        parsedParams = { raw: paramsJson };
      }
      
      if (selectedOption !== 'DEFAULT') {
        parsedParams = { ...parsedParams, mode: selectedOption };
      }

      await onDispatch(agent.id, parsedParams);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 p-6 relative overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Agent Summary */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">작업 할당 및 실행</h2>
            <p className="text-xs text-indigo-300 font-medium">{agent.name}</p>
          </div>
        </div>

        <p className="text-xs text-gray-300 mb-5 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
          {agent.description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preset Selection Option */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              실행 모드 옵션
            </label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full bg-gray-900/90 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="DEFAULT">기본 표준 실행 (Default Mode)</option>
              <option value="FULL">전체 데이터 수집 및 갱신 (Full Refresh)</option>
              <option value="QUICK">빠른 체크 모드 (Quick Check)</option>
            </select>
          </div>

          {/* JSON Custom Parameters */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              추가 매개변수 (JSON)
            </label>
            <textarea
              value={paramsJson}
              onChange={(e) => setParamsJson(e.target.value)}
              rows={3}
              className="w-full bg-gray-900/90 border border-gray-700 rounded-xl p-3 text-xs font-mono text-indigo-200 focus:outline-none focus:border-indigo-500"
              placeholder='{"limit": 5, "market": "KR"}'
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>{loading ? '할당 중...' : '작업 시작'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
