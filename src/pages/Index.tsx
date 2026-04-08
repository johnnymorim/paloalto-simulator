import { useState } from 'react';
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

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <FirewallProvider>
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'hsl(210, 15%, 97%)' }}>
        <PanHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'acc' && <ACCPage />}
          {activeTab === 'monitor' && <MonitorPage />}
          {activeTab === 'policies' && <PoliciesPage />}
          {activeTab === 'objects' && <ObjectsPage />}
          {activeTab === 'network' && <NetworkPage />}
          {activeTab === 'device' && <DevicePage />}
        </div>
        <PanFooter />
      </div>
    </FirewallProvider>
  );
};

export default Index;
