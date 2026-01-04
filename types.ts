
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
  WORLD_EXPLORER = 'WORLD_EXPLORER',
  SUBJECT_GAME = 'SUBJECT_GAME'
}

export type SubjectId = 'math' | 'language' | 'science' | 'history' | 'geography' | 'civics';

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
