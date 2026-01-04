
import React, { useState } from 'react';
import { User, AppView, SubjectId, TopicBlock } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ThinkingLab from './components/ThinkingLab';
import ArtStudio from './components/ArtStudio';
import DiscoveryWorld from './components/DiscoveryWorld';
import TopicSelection from './components/TopicSelection';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [selectedTopic, setSelectedTopic] = useState<TopicBlock | null>(null);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setView(AppView.DASHBOARD);
  };

  const handleBackToDashboard = () => setView(AppView.DASHBOARD);
  
  const handleSelectTopic = (targetView: AppView, topic: TopicBlock) => {
    setSelectedTopic(topic);
    setView(targetView);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.LOGIN);
  };

  if (view === AppView.LOGIN || !user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-green-950 pb-20 overflow-x-hidden relative">
       {/* Falling Leaves Background */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="leaf text-2xl" 
          style={{
            top: `-5vh`,
            left: `${Math.random() * 100}%`,
            '--duration': `${15 + Math.random() * 10}s`
          } as any}
        >
          {['🌿', '🍃', '🍃', '🌱'][Math.floor(Math.random() * 4)]}
        </div>
      ))}

      {/* Persistent Navigation for Sub-views */}
      {view !== AppView.DASHBOARD && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-green-900/90 backdrop-blur-lg border-b-4 border-green-800 p-3 shadow-xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2 rounded-xl transition-all shadow-[0_4px_0_0_#b45309] active:translate-y-1 active:shadow-none font-black uppercase text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
            
            <div className="hidden sm:flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full border border-white/10">
              <span className="text-white text-xs font-black uppercase tracking-tighter">
                {selectedTopic ? (
                    <>Misión: <span className="text-amber-400">{selectedTopic.title}</span></>
                ) : (
                    <>Módulo: <span className="text-amber-400">{selectedSubject.toUpperCase()}</span></>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-sm hidden xs:block">{user.name}</span>
              <img src={user.avatar} className="w-9 h-9 rounded-xl border-2 border-amber-400" alt="Avatar" />
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className={`${view !== AppView.DASHBOARD ? 'pt-24' : 'pt-4'} transition-all`}>
        {view === AppView.DASHBOARD && (
          <Dashboard 
            user={user} 
            setView={setView} 
            setSelectedSubject={setSelectedSubject} 
          />
        )}
        {view === AppView.TOPIC_SELECTION && (
          <TopicSelection 
            subjectId={selectedSubject} 
            onSelectTopic={handleSelectTopic} 
          />
        )}
        {view === AppView.THINKING_LAB && (
          <ThinkingLab subjectId={selectedSubject} topic={selectedTopic} />
        )}
        {view === AppView.ART_STUDIO && (
          <ArtStudio />
        )}
        {view === AppView.WORLD_EXPLORER && (
          <DiscoveryWorld subjectId={selectedSubject} topic={selectedTopic} />
        )}
      </main>

      {/* Logout button fixed for dashboard */}
      {view === AppView.DASHBOARD && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center bg-rose-600 hover:bg-rose-500 text-white w-14 h-14 rounded-full shadow-xl shadow-rose-900/40 active:scale-90 transition-all border-4 border-rose-800"
            title="Cerrar Sesión"
          >
            <span className="text-2xl">🚪</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
