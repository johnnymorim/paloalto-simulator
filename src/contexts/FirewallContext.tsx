import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  FirewallInterface, Zone, StaticRoute, SecurityRule, NATRule,
  AddressObject, ServiceObject, SecurityProfile, TrafficLog, ThreatLog,
  defaultInterfaces, defaultZones, defaultStaticRoutes, defaultSecurityRules,
  defaultNATRules, defaultAddressObjects, defaultServiceObjects, defaultSecurityProfiles,
  defaultTrafficLogs, defaultThreatLogs, systemInfo,
} from '@/data/mockData';

interface FirewallState {
  interfaces: FirewallInterface[];
  zones: Zone[];
  staticRoutes: StaticRoute[];
  securityRules: SecurityRule[];
  natRules: NATRule[];
  addressObjects: AddressObject[];
  serviceObjects: ServiceObject[];
  securityProfiles: SecurityProfile[];
  trafficLogs: TrafficLog[];
  threatLogs: ThreatLog[];
  systemInfo: typeof systemInfo;
  hasUncommittedChanges: boolean;
  commitHistory: { timestamp: string; status: 'success' | 'fail'; message: string }[];
}

interface FirewallContextType extends FirewallState {
  updateInterface: (name: string, data: Partial<FirewallInterface>) => void;
  addZone: (zone: Zone) => void;
  updateZone: (name: string, data: Partial<Zone>) => void;
  deleteZone: (name: string) => void;
  addStaticRoute: (route: StaticRoute) => void;
  updateStaticRoute: (name: string, data: Partial<StaticRoute>) => void;
  deleteStaticRoute: (name: string) => void;
  addSecurityRule: (rule: SecurityRule) => void;
  updateSecurityRule: (id: string, data: Partial<SecurityRule>) => void;
  deleteSecurityRule: (id: string) => void;
  moveSecurityRule: (id: string, direction: 'up' | 'down') => void;
  cloneSecurityRule: (id: string) => void;
  addNATRule: (rule: NATRule) => void;
  updateNATRule: (id: string, data: Partial<NATRule>) => void;
  deleteNATRule: (id: string) => void;
  addAddressObject: (obj: AddressObject) => void;
  updateAddressObject: (name: string, data: Partial<AddressObject>) => void;
  deleteAddressObject: (name: string) => void;
  addServiceObject: (obj: ServiceObject) => void;
  updateServiceObject: (name: string, data: Partial<ServiceObject>) => void;
  deleteServiceObject: (name: string) => void;
  commitChanges: () => Promise<void>;
}

const FirewallContext = createContext<FirewallContextType | null>(null);

export const useFirewall = () => {
  const ctx = useContext(FirewallContext);
  if (!ctx) throw new Error('useFirewall must be used within FirewallProvider');
  return ctx;
};

export const FirewallProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<FirewallState>({
    interfaces: defaultInterfaces,
    zones: defaultZones,
    staticRoutes: defaultStaticRoutes,
    securityRules: defaultSecurityRules,
    natRules: defaultNATRules,
    addressObjects: defaultAddressObjects,
    serviceObjects: defaultServiceObjects,
    securityProfiles: defaultSecurityProfiles,
    trafficLogs: defaultTrafficLogs,
    threatLogs: defaultThreatLogs,
    systemInfo,
    hasUncommittedChanges: false,
    commitHistory: [],
  });

  const markChanged = () => setState(s => ({ ...s, hasUncommittedChanges: true }));

  const updateInterface = useCallback((name: string, data: Partial<FirewallInterface>) => {
    setState(s => ({
      ...s,
      interfaces: s.interfaces.map(i => i.name === name ? { ...i, ...data } : i),
    }));
    markChanged();
  }, []);

  const addZone = useCallback((zone: Zone) => {
    setState(s => ({ ...s, zones: [...s.zones, zone] }));
    markChanged();
  }, []);

  const updateZone = useCallback((name: string, data: Partial<Zone>) => {
    setState(s => ({
      ...s,
      zones: s.zones.map(z => z.name === name ? { ...z, ...data } : z),
    }));
    markChanged();
  }, []);

  const deleteZone = useCallback((name: string) => {
    setState(s => ({ ...s, zones: s.zones.filter(z => z.name !== name) }));
    markChanged();
  }, []);

  const addStaticRoute = useCallback((route: StaticRoute) => {
    setState(s => ({ ...s, staticRoutes: [...s.staticRoutes, route] }));
    markChanged();
  }, []);

  const updateStaticRoute = useCallback((name: string, data: Partial<StaticRoute>) => {
    setState(s => ({
      ...s,
      staticRoutes: s.staticRoutes.map(r => r.name === name ? { ...r, ...data } : r),
    }));
    markChanged();
  }, []);

  const deleteStaticRoute = useCallback((name: string) => {
    setState(s => ({ ...s, staticRoutes: s.staticRoutes.filter(r => r.name !== name) }));
    markChanged();
  }, []);

  const addSecurityRule = useCallback((rule: SecurityRule) => {
    setState(s => ({ ...s, securityRules: [...s.securityRules, rule] }));
    markChanged();
  }, []);

  const updateSecurityRule = useCallback((id: string, data: Partial<SecurityRule>) => {
    setState(s => ({
      ...s,
      securityRules: s.securityRules.map(r => r.id === id ? { ...r, ...data } : r),
    }));
    markChanged();
  }, []);

  const deleteSecurityRule = useCallback((id: string) => {
    setState(s => ({ ...s, securityRules: s.securityRules.filter(r => r.id !== id) }));
    markChanged();
  }, []);

  const moveSecurityRule = useCallback((id: string, direction: 'up' | 'down') => {
    setState(s => {
      const rules = [...s.securityRules];
      const idx = rules.findIndex(r => r.id === id);
      if (idx < 0) return s;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= rules.length) return s;
      [rules[idx], rules[newIdx]] = [rules[newIdx], rules[idx]];
      return { ...s, securityRules: rules };
    });
    markChanged();
  }, []);

  const cloneSecurityRule = useCallback((id: string) => {
    setState(s => {
      const rule = s.securityRules.find(r => r.id === id);
      if (!rule) return s;
      const newRule = { ...rule, id: String(Date.now()), name: `${rule.name} (Copy)`, hitCount: 0 };
      const idx = s.securityRules.findIndex(r => r.id === id);
      const rules = [...s.securityRules];
      rules.splice(idx + 1, 0, newRule);
      return { ...s, securityRules: rules };
    });
    markChanged();
  }, []);

  const addNATRule = useCallback((rule: NATRule) => {
    setState(s => ({ ...s, natRules: [...s.natRules, rule] }));
    markChanged();
  }, []);

  const updateNATRule = useCallback((id: string, data: Partial<NATRule>) => {
    setState(s => ({
      ...s,
      natRules: s.natRules.map(r => r.id === id ? { ...r, ...data } : r),
    }));
    markChanged();
  }, []);

  const deleteNATRule = useCallback((id: string) => {
    setState(s => ({ ...s, natRules: s.natRules.filter(r => r.id !== id) }));
    markChanged();
  }, []);

  const addAddressObject = useCallback((obj: AddressObject) => {
    setState(s => ({ ...s, addressObjects: [...s.addressObjects, obj] }));
    markChanged();
  }, []);

  const updateAddressObject = useCallback((name: string, data: Partial<AddressObject>) => {
    setState(s => ({
      ...s,
      addressObjects: s.addressObjects.map(o => o.name === name ? { ...o, ...data } : o),
    }));
    markChanged();
  }, []);

  const deleteAddressObject = useCallback((name: string) => {
    setState(s => ({ ...s, addressObjects: s.addressObjects.filter(o => o.name !== name) }));
    markChanged();
  }, []);

  const addServiceObject = useCallback((obj: ServiceObject) => {
    setState(s => ({ ...s, serviceObjects: [...s.serviceObjects, obj] }));
    markChanged();
  }, []);

  const updateServiceObject = useCallback((name: string, data: Partial<ServiceObject>) => {
    setState(s => ({
      ...s,
      serviceObjects: s.serviceObjects.map(o => o.name === name ? { ...o, ...data } : o),
    }));
    markChanged();
  }, []);

  const deleteServiceObject = useCallback((name: string) => {
    setState(s => ({ ...s, serviceObjects: s.serviceObjects.filter(o => o.name !== name) }));
    markChanged();
  }, []);

  const commitChanges = useCallback(async () => {
    await new Promise(r => setTimeout(r, 2000));
    setState(s => ({
      ...s,
      hasUncommittedChanges: false,
      commitHistory: [
        { timestamp: new Date().toLocaleString(), status: 'success', message: 'Configuration committed successfully' },
        ...s.commitHistory,
      ],
    }));
  }, []);

  return (
    <FirewallContext.Provider value={{
      ...state,
      updateInterface, addZone, updateZone, deleteZone,
      addStaticRoute, updateStaticRoute, deleteStaticRoute,
      addSecurityRule, updateSecurityRule, deleteSecurityRule,
      moveSecurityRule, cloneSecurityRule,
      addNATRule, updateNATRule, deleteNATRule,
      addAddressObject, updateAddressObject, deleteAddressObject,
      addServiceObject, updateServiceObject, deleteServiceObject,
      commitChanges,
    }}>
      {children}
    </FirewallContext.Provider>
  );
};
