import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Agent {
  id: string;
  name: string;
  category: string;
  status: 'IDLE' | 'RUNNING' | 'ERROR' | 'OFFLINE';
  last_heartbeat: string;
  cpu_usage: number;
  mem_usage: number;
  description: string;
}

export interface Task {
  id: string;
  agent_id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  params?: any;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  exit_code?: number;
  duration_sec?: number;
  error_message?: string;
}

export interface TaskLog {
  id: number;
  task_id: string;
  timestamp: string;
  log_line: string;
  level: 'INFO' | 'WARN' | 'ERROR';
}

// Fallback Mock Agents for offline / initial preview
export const INITIAL_MOCK_AGENTS: Agent[] = [
  {
    id: "stock_management",
    name: "Stock Management Agent",
    category: "Finance",
    status: "IDLE",
    last_heartbeat: new Date().toISOString(),
    cpu_usage: 4.2,
    mem_usage: 38.5,
    description: "주식 시세 수집, 뉴스 수집, Notion 업데이트 및 보고서 생성"
  },
  {
    id: "threads_monitor",
    name: "Threads Monitor Agent",
    category: "Social",
    status: "IDLE",
    last_heartbeat: new Date().toISOString(),
    cpu_usage: 2.1,
    mem_usage: 32.0,
    description: "Threads 및 네이버 게시글 모니터링, 데이터 파싱"
  },
  {
    id: "youtube_subscription",
    name: "YouTube Transcript & Daily Check",
    category: "Media",
    status: "IDLE",
    last_heartbeat: new Date().toISOString(),
    cpu_usage: 1.5,
    mem_usage: 29.8,
    description: "구독 채널 영상 데일리 체크 및 자막/트랜스크립트 추출"
  },
  {
    id: "openrouter_free_models",
    name: "OpenRouter Free Models Parser",
    category: "AI Tools",
    status: "IDLE",
    last_heartbeat: new Date().toISOString(),
    cpu_usage: 0.8,
    mem_usage: 25.1,
    description: "OpenRouter 무료 LLM 모델 최신 목록 및 상태 수집"
  },
  {
    id: "wine_note",
    name: "Wine Note Agent",
    category: "Personal",
    status: "IDLE",
    last_heartbeat: new Date().toISOString(),
    cpu_usage: 0.5,
    mem_usage: 24.0,
    description: "와인 정보 DB 조회 및 노트 데이터 업데이트"
  },
  {
    id: "sapporo_guide",
    name: "Sapporo Travel Assistant",
    category: "Travel",
    status: "IDLE",
    last_heartbeat: new Date().toISOString(),
    cpu_usage: 0.4,
    mem_usage: 22.8,
    description: "삿포로 지도 및 장소 이미지/테이블 데이터 탐색기"
  }
];
