import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import ChatButton from './components/ChatButton';
import ChatWindow from './components/ChatWindow';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <main className="flex-grow">
        <HeroSection onOpenChat={() => setIsChatOpen(true)} />
      </main>
      <Footer />
      {!isChatOpen && <ChatButton onClick={() => setIsChatOpen(true)} />}
      {isChatOpen && (
        <ChatWindow onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
}

export default App;

