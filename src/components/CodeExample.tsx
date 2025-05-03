import React, { useState } from 'react';

interface CodeExampleProps {
  examples: {
    language: string;
    code: string;
    name: string;
  }[];
}

export default function CodeExample({ examples }: CodeExampleProps) {
  const [activeTab, setActiveTab] = useState(0);
  
  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-lg bg-slate-900 dark:ring-1 dark:ring-white/10">
      <div className="flex overflow-x-auto">
        {examples.map((example, index) => (
          <button
            key={example.name}
            className={`flex min-w-0 items-center border-b px-4 py-2 text-sm font-medium ${
              activeTab === index
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {example.name}
          </button>
        ))}
      </div>
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-xs text-white" style={{ fontFamily: 'Menlo, monospace' }}>
          <code>{examples[activeTab].code}</code>
        </pre>
        <button
          type="button"
          className="absolute top-4 right-4 h-8 w-8 rounded border border-slate-600 flex items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-200"
          onClick={() => {
            navigator.clipboard.writeText(examples[activeTab].code);
          }}
        >
          <span className="sr-only">Copy</span>
          <svg
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}