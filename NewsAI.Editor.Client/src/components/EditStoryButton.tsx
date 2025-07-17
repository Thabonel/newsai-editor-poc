
interface Props {
  status: 'disabled' | 'ready' | 'processing' | 'complete';
  onClick: () => void;
}

export default function EditStoryButton({ status, onClick }: Props) {
  const pulse = status === 'ready' ? 'animate-pulse' : '';
  const disabled = status === 'disabled' || status === 'processing';
  const text = status === 'complete' ? 'Edit Complete \u2713' : 'EDIT STORY';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-[300px] h-[80px] rounded text-white font-bold flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 ${pulse} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="text-2xl">🤖 {text}</span>
      {status !== 'complete' && (
        <span className="text-xs">AI will create your rough cut</span>
      )}
    </button>
  );
}
