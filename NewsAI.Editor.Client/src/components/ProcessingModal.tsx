import { useEffect, useState } from 'react';
import { HubConnectionBuilder, type HubConnection } from '@microsoft/signalr';
import { useAuthStore } from '../stores/authStore';

const STEPS = [
  'Analyzing script',
  'Transcribing media files',
  'Matching content to script',
  'Generating timeline',
  'Processing audio'
];

interface Props {
  open: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

export default function ProcessingModal({ open, onCancel, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!open || !token) return;

    setProgress(0);
    setCurrentStep(0);

    const conn = new HubConnectionBuilder()
      .withUrl('/hubs/editing', { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    conn.on('ProgressUpdate', (data: { step: string; percent: number }) => {
      const stepIndex = STEPS.findIndex((s) => s === data.step);
      if (stepIndex >= 0) {
        setCurrentStep(stepIndex);
      }
      setProgress(data.percent);
    });

    conn.on('ProcessingComplete', () => {
      setProgress(100);
      onComplete();
    });

    conn.start().then(() => {
      conn.invoke('StartEditing');
    });

    setConnection(conn);

    return () => {
      conn.stop();
      setConnection(null);
    };
  }, [open, token, onComplete]);

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
          onClick={() => {
            if (connection) {
              connection.invoke('CancelEditing');
              connection.stop();
            }
            onCancel();
          }}
          className="mt-4 self-end px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
