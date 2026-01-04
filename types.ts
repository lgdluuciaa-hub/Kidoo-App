
export interface User {
  name: string;
  avatar: string;
  points: number;
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  THINKING_LAB = 'THINKING_LAB',
  ART_STUDIO = 'ART_STUDIO',
  WORLD_EXPLORER = 'WORLD_EXPLORER'
}

export type SubjectId = 'math' | 'language' | 'science' | 'history' | 'geography' | 'civics' | 'art';

export interface TopicBlock {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Subject {
  id: SubjectId;
  title: string;
  icon: string;
  color: string;
  description: string;
  view: AppView;
  blocks: TopicBlock[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
