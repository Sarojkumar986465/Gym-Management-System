import React, { useState } from 'react';
import { javaProjectFiles, JavaSourceFile } from '../data/javaProjectCode';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  FolderTree, 
  FileCode, 
  Database, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';

export const JavaProjectExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(javaProjectFiles[0].path);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const selectedFile = javaProjectFiles.find(f => f.path === selectedFilePath) || javaProjectFiles[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.path.split('/').pop() || 'file.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const categories = [
    { id: 'ALL', label: 'All Files' },
    { id: 'config', label: 'Maven & Config' },
    { id: 'sql', label: 'MySQL Schema & Data' },
    { id: 'security', label: 'Spring Security' },
    { id: 'entity', label: 'JPA Entities' },
    { id: 'service', label: 'Services' },
    { id: 'controller', label: 'Controllers' },
    { id: 'doc', label: 'Windows Setup Guide' },
  ];

  const filteredFiles = javaProjectFiles.filter(f => activeCategory === 'ALL' || f.category === activeCategory);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#121d28] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
              <Server className="w-3.5 h-3.5" />
              <span>Production Java Backend Architecture</span>
              <span>·</span>
              <span>Spring Boot 3 & MySQL 8</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Java Spring Boot + MySQL Project Package
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect, copy, and export complete Java 17 source files, Maven pom.xml, Spring Security 6 configurations, and MySQL 8 DDL schemas ready to run locally on Windows 11.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export {selectedFile.path.split('/').pop()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Terminal Guide Strip for Windows 11 */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs text-slate-300">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">Windows 11 Execution Commands (PowerShell / CMD)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">1. Run Tests:</span>
            <code className="text-emerald-400 font-bold">mvn clean test</code>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">2. Start Server:</span>
            <code className="text-emerald-400 font-bold">mvn spring-boot:run</code>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">3. Access Web UI:</span>
            <code className="text-cyan-400 font-bold">http://localhost:8080/</code>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeCategory === c.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Code Explorer: File Tree (Left) + Code Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: File Tree */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-2">
            <FolderTree className="w-4 h-4 text-emerald-400" />
            <span>Project Explorer</span>
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {filteredFiles.map((file) => {
              const isSelected = file.path === selectedFilePath;
              const fileName = file.path.split('/').pop();
              const isSql = file.path.endsWith('.sql');
              const isJava = file.path.endsWith('.java');

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between group ${
                    isSelected
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isSql ? (
                      <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : isJava ? (
                      <Code2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{fileName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase ml-2 opacity-60 group-hover:opacity-100">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Code Viewer */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          
          {/* File Header Bar */}
          <div className="p-3.5 sm:p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="text-xs font-mono font-bold text-white block truncate">
                  {selectedFile.path}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {selectedFile.description}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 overflow-x-auto bg-[#070b12] text-xs font-mono leading-relaxed text-slate-200 max-h-[650px] overflow-y-auto">
            <pre className="tab-size-4">
              <code>{selectedFile.code}</code>
            </pre>
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Encoding: UTF-8</span>
            <span>Lines: {selectedFile.code.split('\n').length}</span>
            <span>Target: Java 17 / Spring Boot 3</span>
          </div>

        </div>

      </div>

    </div>
  );
};
