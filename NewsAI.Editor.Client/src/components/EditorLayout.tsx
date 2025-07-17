import { useState, useEffect } from 'react';
import ScriptEditor, { SAMPLE_SCRIPT } from './ScriptEditor';
import MediaBin, { type MediaFile } from './MediaBin';
import VideoPreview from './VideoPreview';
import EditStoryButton from './EditStoryButton';

interface Props {
  onLogout?: () => void;
}

export default function EditorLayout({ onLogout }: Props) {
  const [showMediaBin, setShowMediaBin] = useState(true);
  const [script, setScript] = useState(SAMPLE_SCRIPT);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [editStatus, setEditStatus] = useState<'disabled' | 'ready' | 'processing' | 'complete'>('disabled');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (script.trim() && mediaFiles.length > 0) {
      setEditStatus((s) => (s === 'complete' ? 'complete' : 'ready'));
    } else {
      setEditStatus('disabled');
    }
  }, [script, mediaFiles]);

  const handleEdit = () => {
    if (editStatus !== 'ready') return;
    setEditStatus('processing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 10, 100);
        if (next >= 100) {
          clearInterval(interval);
          setEditStatus('complete');
        }
        return next;
      });
    }, 300);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <header className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
        <div className="font-bold text-lg">NewsAI Editor</div>
        <div className="space-x-2">
          <button className="px-3 py-1 bg-gray-700 rounded">New</button>
          <button className="px-3 py-1 bg-gray-700 rounded">Open</button>
          <button className="px-3 py-1 bg-gray-700 rounded">Save</button>
          <button className="px-3 py-1 bg-gray-700 rounded">Export</button>
        </div>
        <div>
          <button
            className="px-3 py-1 bg-gray-700 rounded"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-[30%_1fr_30%] h-full relative">
        <div className="border-r border-gray-300 overflow-auto p-2">
          <ScriptEditor value={script} onChange={setScript} />
        </div>
        <div className="flex flex-col items-center justify-center border-r border-gray-300 overflow-auto p-2">
          <VideoPreview />
        </div>
        <div className="overflow-auto p-2 flex flex-col items-center">
          <EditStoryButton status={editStatus} onClick={handleEdit} progress={progress} />
          <div className="mt-4">Timeline</div>
        </div>
        <div className="absolute top-0 left-[30%] w-1 bg-gray-200 cursor-col-resize" />
        <div className="absolute top-0 left-[70%] w-1 bg-gray-200 cursor-col-resize" />
      </div>

      {showMediaBin && (
        <div className="h-[200px] border-t border-gray-300 bg-gray-50 p-2">
          <MediaBin onMediaChange={setMediaFiles} />
        </div>
      )}
      <button
        onClick={() => setShowMediaBin((prev) => !prev)}
        className="absolute bottom-2 right-2 px-3 py-1 bg-gray-700 text-white rounded"
      >
        {showMediaBin ? 'Hide Bin' : 'Show Bin'}
      </button>
    </div>
  );
}
