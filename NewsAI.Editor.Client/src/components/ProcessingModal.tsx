import { useEffect, useState } from 'react';

const STEPS = [
  'Analyzing script',
  'Identifying required shots',
  'Matching interviews',
  'Creating timeline',
  'Adjusting audio',
];

interface Props {
  open: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

export default function ProcessingModal({ open, onCancel, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!open) return;

    setProgress(0);
    setCurrentStep(0);

    const durations = STEPS.map(() => 2000 + Math.random() * 1000);
    let step = 0;
    let interval: number;

    const runStep = () => {
      const start = Date.now();
      const duration = durations[step];
      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const part = Math.min(elapsed / duration, 1);
        setCurrentStep(step);
        setProgress(((step + part) / STEPS.length) * 100);
        if (part >= 1) {
          clearInterval(interval);
          step += 1;
          if (step < STEPS.length) {
            runStep();
          } else {
            setCurrentStep(STEPS.length - 1);
            setProgress(100);
            onComplete();
          }
        }
      }, 100);
    };

    runStep();
    return () => clearInterval(interval);
  }, [open, onComplete]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] h-[400px] rounded shadow-lg p-6 flex flex-col">
        <div className="text-lg font-bold mb-4 text-center">Processing</div>
        <div className="flex items-center justify-center mb-2 h-6">
          <span className="mr-2">{STEPS[currentStep]}</span>
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
        </div>
        <div className="w-full bg-gray-200 h-3 rounded mb-4">
          <div className="bg-blue-500 h-3 rounded" style={{ width: `${progress}%` }} />
        </div>
        <ul className="flex-1 space-y-1">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              {i < currentStep ? (
                <span className="text-green-600">&#10003;</span>
              ) : i === currentStep ? (
                <span className="text-gray-600">&#x27f3;</span>
              ) : (
                <span className="text-gray-400">&#9675;</span>
              )}
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 self-end px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
