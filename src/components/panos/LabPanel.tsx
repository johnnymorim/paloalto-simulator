import { useState } from 'react';
import { Lab } from '@/data/labData';
import { useLabValidator } from './LabStepValidator';
import { ChevronRight, ChevronLeft, Lightbulb, CheckCircle2, Circle, X, ArrowRight } from 'lucide-react';

interface LabPanelProps {
  lab: Lab;
  currentStep: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
  onComplete: () => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  completedSteps: Set<number>;
  onStepComplete: (step: number) => void;
}

export const LabPanel = ({
  lab, currentStep, onStepChange, onClose, onComplete, onNavigate,
  activeTab, completedSteps, onStepComplete,
}: LabPanelProps) => {
  const [showHint, setShowHint] = useState(false);
  const { validateStep } = useLabValidator();
  const step = lab.steps[currentStep];
  const allDone = completedSteps.size === lab.steps.length;

  const handleCheck = () => {
    const valid = validateStep(step, activeTab);
    if (valid) {
      onStepComplete(currentStep);
      if (currentStep < lab.steps.length - 1) {
        setTimeout(() => onStepChange(currentStep + 1), 400);
      } else if (completedSteps.size === lab.steps.length - 1) {
        setTimeout(() => onComplete(), 600);
      }
    }
  };

  const handleMarkComplete = () => {
    onStepComplete(currentStep);
    if (currentStep < lab.steps.length - 1) {
      setTimeout(() => onStepChange(currentStep + 1), 300);
    } else if (completedSteps.size === lab.steps.length - 1) {
      setTimeout(() => onComplete(), 500);
    }
  };

  return (
    <div className="w-[340px] border-l flex flex-col h-full" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(210, 15%, 85%)' }}>
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between" style={{ background: 'hsl(215, 40%, 16%)', borderColor: 'hsl(215, 30%, 25%)' }}>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold tracking-wider" style={{ color: 'hsl(100, 55%, 53%)' }}>
            ACTIVE LAB
          </div>
          <div className="text-[12px] font-medium truncate" style={{ color: 'hsl(0, 0%, 100%)' }}>
            {lab.title}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10" title="Close Lab">
          <X className="w-3.5 h-3.5" style={{ color: 'hsl(210, 10%, 75%)' }} />
        </button>
      </div>

      {/* Progress dots */}
      <div className="px-3 py-2 flex items-center gap-1 border-b" style={{ borderColor: 'hsl(210, 15%, 90%)' }}>
        {lab.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => onStepChange(i)}
            className="relative"
            title={`Step ${i + 1}`}
          >
            {completedSteps.has(i) ? (
              <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(100, 55%, 40%)' }} />
            ) : i === currentStep ? (
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'hsl(210, 70%, 50%)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(210, 70%, 50%)' }} />
              </div>
            ) : (
              <Circle className="w-4 h-4" style={{ color: 'hsl(210, 10%, 75%)' }} />
            )}
          </button>
        ))}
        <span className="text-[10px] ml-auto" style={{ color: 'hsl(210, 10%, 50%)' }}>
          {completedSteps.size}/{lab.steps.length}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-auto p-3">
        <div className="text-[10px] font-semibold mb-1" style={{ color: 'hsl(210, 10%, 50%)' }}>
          STEP {currentStep + 1} OF {lab.steps.length}
        </div>
        <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'hsl(215, 25%, 15%)' }}>
          {step.instruction}
        </p>

        {/* Navigate button */}
        {step.navigateTo && activeTab !== step.navigateTo.tab && (
          <button
            onClick={() => onNavigate(step.navigateTo!.tab)}
            className="w-full mb-3 px-3 py-1.5 text-[11px] rounded flex items-center justify-center gap-1.5"
            style={{ background: 'hsl(210, 70%, 50%)', color: 'hsl(0, 0%, 100%)' }}
          >
            Go to {step.navigateTo.tab.charAt(0).toUpperCase() + step.navigateTo.tab.slice(1)}
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        {/* Hint */}
        {step.hint && (
          <div className="mb-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1 text-[11px] font-medium"
              style={{ color: 'hsl(30, 80%, 50%)' }}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="mt-1.5 p-2 rounded text-[11px] leading-relaxed" style={{ background: 'hsl(40, 80%, 95%)', color: 'hsl(30, 50%, 30%)' }}>
                {step.hint}
              </div>
            )}
          </div>
        )}

        {/* Objectives (show on first step) */}
        {currentStep === 0 && (
          <div className="mt-3 p-2 rounded" style={{ background: 'hsl(210, 30%, 96%)' }}>
            <div className="text-[10px] font-semibold mb-1" style={{ color: 'hsl(210, 10%, 40%)' }}>OBJECTIVES</div>
            {lab.objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px] mb-1" style={{ color: 'hsl(215, 20%, 25%)' }}>
                <span style={{ color: 'hsl(210, 10%, 60%)' }}>•</span>
                {obj}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: 'hsl(210, 15%, 90%)' }}>
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="p-1.5 rounded disabled:opacity-30"
          style={{ background: 'hsl(210, 15%, 93%)' }}
        >
          <ChevronLeft className="w-3.5 h-3.5" style={{ color: 'hsl(215, 25%, 30%)' }} />
        </button>

        {completedSteps.has(currentStep) ? (
          <button
            onClick={() => currentStep < lab.steps.length - 1 ? onStepChange(currentStep + 1) : onComplete()}
            className="flex-1 py-1.5 text-[11px] font-medium rounded"
            style={{ background: 'hsl(100, 45%, 45%)', color: 'hsl(0, 0%, 100%)' }}
          >
            {currentStep < lab.steps.length - 1 ? 'Next Step' : allDone ? '✓ Lab Complete' : 'Next Step'}
          </button>
        ) : step.validation?.type === 'manual' ? (
          <button
            onClick={handleMarkComplete}
            className="flex-1 py-1.5 text-[11px] font-medium rounded"
            style={{ background: 'hsl(210, 70%, 50%)', color: 'hsl(0, 0%, 100%)' }}
          >
            Mark Complete
          </button>
        ) : (
          <button
            onClick={handleCheck}
            className="flex-1 py-1.5 text-[11px] font-medium rounded"
            style={{ background: 'hsl(210, 70%, 50%)', color: 'hsl(0, 0%, 100%)' }}
          >
            ✓ Check Step
          </button>
        )}

        <button
          onClick={() => onStepChange(Math.min(lab.steps.length - 1, currentStep + 1))}
          disabled={currentStep === lab.steps.length - 1}
          className="p-1.5 rounded disabled:opacity-30"
          style={{ background: 'hsl(210, 15%, 93%)' }}
        >
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'hsl(215, 25%, 30%)' }} />
        </button>
      </div>
    </div>
  );
};
