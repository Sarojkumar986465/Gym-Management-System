import React, { useState } from 'react';
import { javaProjectFiles } from '../data/javaProjectCode';
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
  Server,
  PackageCheck,
  Sparkles,
  HelpCircle,
  FileArchive,
  Layers
} from 'lucide-react';

export const JavaProjectExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(javaProjectFiles[0].path);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const selectedFile = javaProjectFiles.find(f => f.path === selectedFilePath) || javaProjectFiles[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
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
      
      {/* Header Banner with Direct ZIP Download Buttons */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#121d28] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1.5">
              <Server className="w-3.5 h-3.5" />
              <span>Production Java Backend Architecture</span>
              <span>·</span>
              <span>Spring Boot 3.3 & MySQL 8</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Java Spring Boot + MySQL Project Package
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Complete, ready-to-extract Maven project with Spring Security 6, BCrypt, JPA/Hibernate entities, MySQL 8 schema with 14 normalized tables, and REST/MVC endpoints.
            </p>
          </div>

          {/* Action Download Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="/gym-management-system-backend.zip"
              download="gym-management-system-backend.zip"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <FileArchive className="w-4 h-4" />
              <span>Download Backend (.ZIP)</span>
            </a>

            <a
              href="/gym-management-system-full.zip"
              download="gym-management-system-full.zip"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Download Full Stack (.ZIP)</span>
            </a>

            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>{showSetupGuide ? 'Hide Setup' : 'Setup Guide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Step-by-Step Setup Guide */}
      {showSetupGuide && (
        <div className="bg-[#0b101b] border border-emerald-500/30 rounded-xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <PackageCheck className="w-4 h-4" />
              <span>Step-by-Step Local Setup Guide (Windows 11, IntelliJ, VS Code & XAMPP)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Tested on Java 17 + MySQL 8</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px]">1</span>
                <span>Extract the ZIP</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Click <b>Download Backend (.ZIP)</b> above and extract the contents to your development directory:
              </p>
              <code className="block p-1.5 bg-black/50 text-slate-300 rounded font-mono text-[10px]">
                C:\Projects\gym-management-system-backend
              </code>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px]">2</span>
                <span>Setup MySQL Database</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Start MySQL (via XAMPP or MySQL 8 Windows Service). Open MySQL CLI or phpMyAdmin and execute:
              </p>
              <code className="block p-1.5 bg-black/50 text-cyan-300 rounded font-mono text-[10px]">
                mysql -u root -p &lt; schema.sql
              </code>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px]">3</span>
                <span>Verify Properties</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Inspect <code className="text-slate-200">application.properties</code> in <code className="text-slate-300">src/main/resources/</code> and ensure your password matches:
              </p>
              <code className="block p-1.5 bg-black/50 text-amber-300 rounded font-mono text-[10px]">
                spring.datasource.password=your_pw
              </code>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[11px]">4</span>
                <span>Launch & Test</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Open terminal in project root and run with Maven:
              </p>
              <code className="block p-1.5 bg-black/50 text-purple-300 rounded font-mono text-[10px]">
                mvn spring-boot:run
              </code>
              <p className="text-[10px] text-slate-400">Open <b className="text-white">http://localhost:8080</b></p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Terminal Guide Strip for Windows 11 */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs text-slate-300">
        <div className="flex items-center justify-between gap-2 text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Windows 11 Execution Commands (PowerShell / Command Prompt)</span>
          </div>
          <span className="text-[10px] text-slate-500 hidden sm:inline">Maven Wrapper included (mvnw / mvnw.cmd)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">1. Clean & Compile:</span>
            <code className="text-emerald-400 font-bold">mvn clean compile</code>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">2. Start Spring Boot Server:</span>
            <code className="text-emerald-400 font-bold">mvn spring-boot:run</code>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">3. Access Web Application:</span>
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
            <span>Project Explorer ({filteredFiles.length})</span>
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
                onClick={handleDownloadSingleFile}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Download this file"
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
