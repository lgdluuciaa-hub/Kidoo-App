
import React, { useState } from 'react';
import { User, AppView, SubjectId, TopicBlock, GameResult } from './types';
import Login from './components/Login';
import Dashboard, { SUBJECTS } from './components/Dashboard';
import ThinkingLab from './components/ThinkingLab';
import DiscoveryWorld from './components/DiscoveryWorld';
import TopicSelection from './components/TopicSelection';
import SubjectGame from './components/SubjectGame';
import AdultPanel from './components/AdultPanel';
import { AvatarIcon } from './components/AvatarIcon';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [selectedTopic, setSelectedTopic] = useState<TopicBlock | null>(null);
  const [allResults, setAllResults] = useState<GameResult[]>([]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setView(AppView.DASHBOARD);
  };

  const handleBackToDashboard = () => {
    setSelectedTopic(null);
    setView(AppView.DASHBOARD);
  };
  
  const handleSelectTopic = (targetView: AppView, topic: TopicBlock) => {
    setSelectedTopic(topic);
    setView(targetView);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.LOGIN);
  };

  const handleGameFinish = (score: number) => {
    if (selectedTopic) {
      const subjectTitle = SUBJECTS.find(s => s.id === selectedSubject)?.title || selectedSubject;
      const newResult: GameResult = {
        subject: subjectTitle,
        topic: selectedTopic.title,
        score: score,
        date: new Date().toLocaleString()
      };
      setAllResults(prev => [newResult, ...prev]);
      
      if (user) {
        setUser({ ...user, points: user.points + score });
      }
    }
    
    setSelectedTopic(null);
    setView(AppView.DASHBOARD);
  };

  if (view === AppView.LOGIN || !user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-lime-500 to-emerald-600 pb-20 overflow-x-hidden relative text-slate-800">
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-yellow-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {view !== AppView.DASHBOARD && view !== AppView.ADULT_PANEL && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-xl border-b-4 border-white/40 p-3 shadow-2xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-xl transition-all shadow-[0_4px_0_0_#c2410c] active:translate-y-1 active:shadow-none font-black uppercase text-xs"
            >
              Volver
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-white/40 px-4 py-1.5 rounded-full border border-white/50 shadow-inner">
              <span className="text-emerald-900 text-[10px] font-black uppercase tracking-tighter">
                {selectedTopic ? (
                    <>Misión: <span className="text-orange-600">{selectedTopic.title}</span></>
                ) : (
                    <>Sección: <span className="text-orange-600">{selectedSubject.toUpperCase()}</span></>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-white bg-amber-400 flex items-center justify-center p-1 shadow-lg">
                <AvatarIcon id={user.avatar} />
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={`${view !== AppView.DASHBOARD && view !== AppView.ADULT_PANEL ? 'pt-24' : 'pt-4'} transition-all relative z-10`}>
        {view === AppView.DASHBOARD && <Dashboard user={user} setView={setView} setSelectedSubject={setSelectedSubject} />}
        {view === AppView.TOPIC_SELECTION && <TopicSelection subjectId={selectedSubject} onSelectTopic={handleSelectTopic} />}
        {view === AppView.THINKING_LAB && <ThinkingLab subjectId={selectedSubject} topic={selectedTopic} />}
        {view === AppView.WORLD_EXPLORER && <DiscoveryWorld subjectId={selectedSubject} topic={selectedTopic} />}
        {view === AppView.SUBJECT_GAME && <SubjectGame topic={selectedTopic} subjectId={selectedSubject} onFinish={handleGameFinish} />}
        {view === AppView.ADULT_PANEL && <AdultPanel results={allResults} onBack={handleBackToDashboard} />}
      </main>

      {view === AppView.DASHBOARD && (
        <div className="fixed bottom-6 right-6 z-50">
          <button onClick={handleLogout} className="flex items-center justify-center bg-rose-500 hover:bg-rose-400 text-white w-16 h-16 rounded-full shadow-2xl active:scale-90 transition-all border-4 border-white/50 group">
            <span className="text-3xl group-hover:rotate-12 transition-transform">🚪</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
