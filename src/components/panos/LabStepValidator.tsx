import { useFirewall } from '@/contexts/FirewallContext';
import { LabStep } from '@/data/labData';

export const useLabValidator = () => {
  const firewall = useFirewall();

  const validateStep = (step: LabStep, activeTab?: string): boolean => {
    if (!step.validation) return true;
    const { type, target, expected } = step.validation;

    if (type === 'navigate') {
      return activeTab === target;
    }

    if (type === 'create' || type === 'exists') {
      const collection = (firewall as any)[target];
      if (!Array.isArray(collection) || !expected) return false;
      return collection.some((item: any) => {
        return Object.entries(expected).every(([key, val]) => {
          const itemVal = item[key];
          if (Array.isArray(itemVal) && typeof val === 'string') {
            return itemVal.includes(val);
          }
          return itemVal === val;
        });
      });
    }

    if (type === 'update') {
      const collection = (firewall as any)[target];
      if (!Array.isArray(collection) || !expected) return false;
      return collection.some((item: any) => {
        return Object.entries(expected).every(([key, val]) => {
          const itemVal = item[key];
          if (Array.isArray(itemVal) && typeof val === 'string') {
            return itemVal.includes(val);
          }
          return itemVal === val;
        });
      });
    }

    if (type === 'field_check') {
      const collection = (firewall as any)[target];
      if (!expected) return false;
      // For non-array targets (like systemInfo)
      if (!Array.isArray(collection) && typeof collection === 'object' && collection !== null) {
        return Object.entries(expected).every(([key, val]) => collection[key] === val);
      }
      if (!Array.isArray(collection)) return false;
      const { _match, ...fields } = expected;
      if (_match) {
        // Find item matching _match criteria, then check fields
        const item = collection.find((i: any) =>
          Object.entries(_match).every(([k, v]) => i[k] === v)
        );
        if (!item) return false;
        return Object.entries(fields).every(([key, val]) => {
          const itemVal = item[key];
          if (Array.isArray(itemVal) && typeof val === 'string') {
            return itemVal.includes(val);
          }
          if (typeof val === 'boolean') return itemVal === val;
          return itemVal === val;
        });
      }
      // Without _match, check if any item matches all fields
      return collection.some((item: any) =>
        Object.entries(fields).every(([key, val]) => {
          const itemVal = item[key];
          if (Array.isArray(itemVal) && typeof val === 'string') {
            return itemVal.includes(val);
          }
          return itemVal === val;
        })
      );
    }

    if (type === 'count_check') {
      const collection = (firewall as any)[target];
      if (!Array.isArray(collection) || !expected) return false;
      const { min, max } = expected;
      if (min !== undefined && collection.length < min) return false;
      if (max !== undefined && collection.length > max) return false;
      return true;
    }

    if (type === 'rule_position') {
      const collection = (firewall as any)[target];
      if (!Array.isArray(collection) || !expected) return false;
      const { firstRule, secondRule, matchField } = expected;
      const field = matchField || 'name';
      const firstIdx = collection.findIndex((r: any) => r[field] === firstRule);
      const secondIdx = collection.findIndex((r: any) => r[field] === secondRule);
      if (firstIdx === -1 || secondIdx === -1) return false;
      return firstIdx < secondIdx;
    }

    if (type === 'committed') {
      const history = firewall.commitHistory;
      if (!expected) return history.length > 0;
      const { minCount } = expected;
      if (minCount) return history.length >= minCount;
      return history.length > 0;
    }

    if (type === 'disabled') {
      const collection = (firewall as any)[target];
      if (!Array.isArray(collection) || !expected) return false;
      const { _match } = expected;
      if (!_match) return false;
      const item = collection.find((i: any) =>
        Object.entries(_match).every(([k, v]) => i[k] === v)
      );
      return item && item.enabled === false;
    }

    return false;
  };

  return { validateStep };
};
