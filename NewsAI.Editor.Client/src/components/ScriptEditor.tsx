import { useEffect, useRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';

loader.config({ paths: { vs: '/node_modules/monaco-editor/min/vs' } });

export const SAMPLE_SCRIPT = `[VIDEO: Shots of littered beaches, volunteers cleaning up]
EMMA (VO): Sydney's iconic beaches are under threat as plastic waste continues to wash ashore...
[SOUND BITE – Environmental Scientist]: "We're seeing a dramatic rise in microplastics..."`;

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function ScriptEditor({ value, onChange }: Props) {
  const monacoRef = useRef<Monaco | null>(null);
  const wordCount = value.split(/\s+/).filter(Boolean).length;
  const duration = Math.ceil(wordCount / 150 * 60); // seconds

  useEffect(() => {
    if (monacoRef.current) {
      const monaco = monacoRef.current;
      if (!monaco.languages.getEncodedLanguageId('news-script')) {
        monaco.languages.register({ id: 'news-script' });
        monaco.languages.setMonarchTokensProvider('news-script', {
          tokenizer: {
            root: [
              [/\[VIDEO:[^\]]*\]/, 'videoTag'],
              [/\[SOUND BITE[^\]]*\]/, 'soundbiteTag'],
              [/\(VO\)/, 'voTag'],
              [/^[A-Z]+(?=\s+\()/, 'speaker'],
            ]
          }
        });
        monaco.editor.defineTheme('news-theme', {
          base: 'vs',
          inherit: true,
          rules: [
            { token: 'videoTag', foreground: '0000ff' },
            { token: 'soundbiteTag', foreground: 'ff8800' },
            { token: 'voTag', foreground: '008800' },
            { token: 'speaker', fontStyle: 'bold' },
          ],
          colors: {}
        });
      }
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between bg-gray-100 p-2 border-b">
        <div>Words: {wordCount}</div>
        <div>Est. Duration: {duration}s</div>
        <select className="border p-1">
          <option>Templates</option>
        </select>
        <button className="px-2 py-1 bg-blue-500 text-white rounded">AI Assist</button>
      </div>
      <Editor
        height="100%"
        defaultLanguage="news-script"
        value={value}
        theme="news-theme"
        onMount={(_editor, monaco) => { monacoRef.current = monaco; }}
        onChange={(val) => onChange(val || '')}
        options={{ minimap: { enabled: false } }}
      />
    </div>
  );
}
