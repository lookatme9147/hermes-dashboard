"use client";

import React from 'react';
import { Bot, Cpu, Wifi, Github, ExternalLink, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface NavbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass-panel backdrop-blur-md px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                Hermes Agent
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                v1.0 Multi-Agent
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Local PC Orchestrator & Cloud Control Dashboard
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center space-x-3">
          {/* Cloud DB Connection Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/60 text-xs">
            <Wifi className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="hidden md:inline font-medium text-gray-300">
              {isSupabaseConfigured ? 'Supabase Live' : 'Local Demo Mode'}
            </span>
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all flex items-center justify-center active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/lookatme9147"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-medium transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
