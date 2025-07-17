import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: 'video' | 'audio';
  duration: number;
}

interface UploadingFile {
  file: File;
  progress: number;
  id: string;
}

const fakeDuration = () => Math.round(Math.random() * 200) + 30;

export default function MediaBin() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'video' | 'audio'>('all');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploads = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      id: uuidv4(),
    }));
    setUploading((prev) => [...prev, ...uploads]);
  }, []);

  useEffect(() => {
    if (!uploading.length) return;

    const interval = setInterval(() => {
      setUploading((prev) =>
        prev
          .map((u) => ({ ...u, progress: Math.min(u.progress + 20, 100) }))
          .filter((u) => {
            if (u.progress >= 100) {
              const type = u.file.type.startsWith('audio') ? 'audio' : 'video';
              const url = URL.createObjectURL(u.file);
              const newFile: MediaFile = {
                id: u.id,
                url,
                name: u.file.name,
                type,
                duration: fakeDuration(),
              };
              setFiles((f) => [...f, newFile]);
              return false;
            }
            return true;
          })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [uploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': [],
      'audio/*': [],
    },
  });

  const displayed = files.filter((f) => {
    if (filter !== 'all' && f.type !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Upload
        </button>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 flex-1"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="space-x-1" onClick={(e) => e.stopPropagation()}>
          <button
            className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-gray-300' : 'bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-2 py-1 rounded ${filter === 'video' ? 'bg-gray-300' : 'bg-gray-100'}`}
            onClick={() => setFilter('video')}
          >
            Video
          </button>
          <button
            className={`px-2 py-1 rounded ${filter === 'audio' ? 'bg-gray-300' : 'bg-gray-100'}`}
            onClick={() => setFilter('audio')}
          >
            Audio
          </button>
        </div>
      </div>
      {isDragActive && (
        <div className="border-2 border-dashed border-blue-400 flex-1 flex items-center justify-center text-blue-500">
          Drop files here
        </div>
      )}
      {!isDragActive && (
        <div className="grid grid-cols-4 gap-2 flex-1 overflow-auto">
          {uploading.map((u) => (
            <div key={u.id} className="border p-2 flex flex-col items-center justify-center">
              <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                Uploading...
              </div>
              <div className="w-full bg-gray-200 h-2 mt-2">
                <div className="bg-blue-500 h-2" style={{ width: `${u.progress}%` }} />
              </div>
              <div className="text-xs mt-1">{u.file.name}</div>
            </div>
          ))}
          {displayed.map((file) => (
            <div key={file.id} className="border p-2 flex flex-col">
              {file.type === 'video' ? (
                <video src={file.url} className="w-full h-24 object-cover" />
              ) : (
                <div className="w-full h-24 bg-gray-300 flex items-center justify-center text-sm">
                  🎵
                </div>
              )}
              <div className="mt-1 text-xs truncate" title={file.name}>{file.name}</div>
              <div className="text-xs">{file.duration}s</div>
              <span className="text-xs mt-1 px-1 bg-gray-200 rounded w-max">
                {file.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
