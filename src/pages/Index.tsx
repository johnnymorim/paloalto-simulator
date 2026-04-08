import { useState, useEffect, useCallback } from 'react';
import { FirewallProvider } from '@/contexts/FirewallContext';
import { PanHeader } from '@/components/panos/PanHeader';
import { PanFooter } from '@/components/panos/PanFooter';
import { DashboardPage } from './DashboardPage';
import { ACCPage } from './ACCPage';
import { MonitorPage } from './MonitorPage';
import { PoliciesPage } from './PoliciesPage';
import { ObjectsPage } from './ObjectsPage';
import { NetworkPage } from './NetworkPage';
import { DevicePage } from './DevicePage';
import { LabsPage } from './LabsPage';
import { LabPanel } from '@/components/panos/LabPanel';
import { Lab } from '@/data/labData';

const LABS_STORAGE_KEY = 'panos-lab-progress';

const loadLabProgress = (): { completedLabs: Set<string>; labSteps: Record<string, number[]> } => {
  try {
    const raw = localStorage.getItem(LABS_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        completedLabs: new Set(data.completedLabs || []),
        labSteps: data.labSteps || {},
      };
    }
  } catch {}
  return { completedLabs: new Set(), labSteps: {} };
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeLab, setActiveLab] = useState<Lab | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [completedLabs, setCompletedLabs] = useState<Set<string>>(() => loadLabProgress().completedLabs);
  const [labSteps, setLabSteps] = useState<Record<string, number[]>>(() => loadLabProgress().labSteps);

  useEffect(() => {
    const data = { completedLabs: Array.from(completedLabs), labSteps };
    localStorage.setItem(LABS_STORAGE_KEY, JSON.stringify(data));
  }, [completedLabs, labSteps]);

  const handleStartLab = useCallback((lab: Lab) => {
    setActiveLab(lab);
    const savedSteps = labSteps[lab.id] || [];
    setCompletedSteps(new Set(savedSteps));
    setCurrentStep(0);
  }, [labSteps]);

  const handleStepComplete = useCallback((step: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(step);
      if (activeLab) {
        setLabSteps(ls => ({ ...ls, [activeLab.id]: Array.from(next) }));
      }
      return next;
    });
  }, [activeLab]);

  const handleLabComplete = useCallback(() => {
    if (activeLab) {
      setCompletedLabs(prev => {
        const next = new Set(prev);
        next.add(activeLab.id);
        return next;
      });
    }
  }, [activeLab]);

  const handleCloseLab = useCallback(() => {
    setActiveLab(null);
    setCompletedSteps(new Set());
    setCurrentStep(0);
  }, []);

  return (
    <FirewallProvider>
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'hsl(210, 15%, 97%)' }}>
        <PanHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {activeTab === 'dashboard' && <DashboardPage />}
            {activeTab === 'acc' && <ACCPage />}
            {activeTab === 'monitor' && <MonitorPage />}
            {activeTab === 'policies' && <PoliciesPage />}
            {activeTab === 'objects' && <ObjectsPage />}
            {activeTab === 'network' && <NetworkPage />}
            {activeTab === 'device' && <DevicePage />}
            {activeTab === 'labs' && <LabsPage completedLabs={completedLabs} onStartLab={handleStartLab} />}
          </div>
          {activeLab && (
            <LabPanel
              lab={activeLab}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onClose={handleCloseLab}
              onComplete={handleLabComplete}
              onNavigate={setActiveTab}
              activeTab={activeTab}
              completedSteps={completedSteps}
              onStepComplete={handleStepComplete}
            />
          )}
        </div>
        <PanFooter />
      </div>
    </FirewallProvider>
  );
};

export default Index;
