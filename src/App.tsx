import React from 'react';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import ChallengeGenerator from './components/ChallengeGenerator';
import ActionButtons from './components/ActionButtons';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <WelcomeSection />
        <ChallengeGenerator />
        <ActionButtons />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;