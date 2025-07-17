import { useState } from 'react';
import ScriptEditor from './ScriptEditor';
import MediaBin from './MediaBin';
import VideoPreview from './VideoPreview';

interface Props {
  onLogout?: () => void;
}

export default function EditorLayout({ onLogout }: Props) {
  const [showMediaBin, setShowMediaBin] = useState(true);

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
          <ScriptEditor />
        </div>
        <div className="flex flex-col items-center justify-center border-r border-gray-300 overflow-auto p-2">
          <VideoPreview />
        </div>
        <div className="overflow-auto p-2">Timeline</div>
        <div className="absolute top-0 left-[30%] w-1 bg-gray-200 cursor-col-resize" />
        <div className="absolute top-0 left-[70%] w-1 bg-gray-200 cursor-col-resize" />
      </div>

      {showMediaBin && (
        <div className="h-[200px] border-t border-gray-300 bg-gray-50 p-2">
          <MediaBin />
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
