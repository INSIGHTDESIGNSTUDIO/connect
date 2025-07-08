import { AppContextProvider } from '@/lib/context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RoleSelectionStep } from '@/components/RoleSelectionStep';
import { NeedSelectionStep } from '@/components/NeedSelectionStep';
import { ResourceListStep } from '@/components/ResourceListStep';
import { useAppContext } from '@/lib/context';

function MainContent() {
  const { step } = useAppContext();
  
  return (
    <main className="flex-grow py-8">
      {step === 1 && <RoleSelectionStep />}
      {step === 2 && <NeedSelectionStep />}
      {step === 3 && <ResourceListStep />}
    </main>
  );
}

export default function Home() {
  return (
    <AppContextProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </AppContextProvider>
  );
}
