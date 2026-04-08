import { useFirewall } from '@/contexts/FirewallContext';
import { LabStep } from '@/data/labData';

export const useLabValidator = () => {
  const firewall = useFirewall();

  const validateStep = (step: LabStep, activeTab?: string): boolean => {
    if (!step.validation) return true;
    const { type, target, expected } = step.validation;

    if (type === 'manual') return true; // manual steps are always completable

    if (type === 'navigate') {
      return activeTab === target;
    }

    if (type === 'create' || type === 'exists') {
      const collection = (firewall as any)[target];
      if (!Array.isArray(collection) || !expected) return false;
      return collection.some((item: any) => {
        return Object.entries(expected).every(([key, val]) => item[key] === val);
      });
    }

    if (type === 'update') {
      const collection = (firewall as any)[target];
      if (!Array.isArray(collection) || !expected) return false;
      return collection.some((item: any) => {
        return Object.entries(expected).every(([key, val]) => item[key] === val);
      });
    }

    return false;
  };

  return { validateStep };
};
