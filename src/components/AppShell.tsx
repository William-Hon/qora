import React, { useState } from 'react';
import { JournalFlow } from './JournalFlow';
import { PastJournals } from './PastJournals';
import '../styles/AppShell.css';

type Tab = 'journal' | 'past';

export const AppShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('journal');
  
  // A key to force remount JournalFlow when starting a new entry
  const [flowKey, setFlowKey] = useState(0);

  const handleNewEntry = () => {
    setFlowKey(prev => prev + 1);
    setActiveTab('journal');
  };

  return (
    <div className="app-container">
      <nav className="app-nav flex-row justify-center">
        <button 
          className={`nav-tab ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}
        >
          Journal
        </button>
        <button 
          className={`nav-tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Journals
        </button>
      </nav>
      
      <main className="app-main">
        {activeTab === 'journal' ? (
          <JournalFlow 
            key={flowKey} 
            onComplete={handleNewEntry} 
            onViewPast={() => setActiveTab('past')} 
          />
        ) : (
          <PastJournals />
        )}
      </main>
    </div>
  );
};
