import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import ActionButtons from './components/ActionButtons';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <WelcomeSection />
        <ActionButtons />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;