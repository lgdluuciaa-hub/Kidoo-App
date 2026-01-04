
export interface User {
  name: string;
  avatar: string;
  points: number;
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  THINKING_LAB = 'THINKING_LAB',
  ART_STUDIO = 'ART_STUDIO',
  WORLD_EXPLORER = 'WORLD_EXPLORER'
}

export type SubjectId = 'math' | 'language' | 'science' | 'history' | 'geography' | 'civics' | 'art';

export interface Subject {
  id: SubjectId;
  title: string;
  icon: string;
  color: string;
  description: string;
  view: AppView;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
