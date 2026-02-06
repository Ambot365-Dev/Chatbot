import React, { useState } from 'react';
import { FlowProvider } from './context/FlowContext';
import SidebarBlocks from './components/SidebarBlocks';
import FlowCanvas from './components/FlowCanvas';
import FlowMap from './components/FlowMap';
import ChatPreview from './components/ChatPreview';
import PublishModal from './components/PublishModal';
import { LayoutList, GitGraph, MonitorPlay } from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  return (
    <FlowProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        {/* Left Sidebar - Block Selection */}
        <SidebarBlocks />

        {/* Center Canvas - Flow Builder */}
        <div className="flex-1 flex flex-col h-full relative z-0">
          <header className="flex-none bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-20">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Chatbot Flow Builder</h1>
              <p className="text-xs text-gray-500">Design your conversation flow</p>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutList size={16} />
                Builder
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <GitGraph size={16} />
                Visual Map
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPublishOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ring-4 ring-transparent hover:ring-brand-100"
              >
                <MonitorPlay size={16} />
                Publish
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden relative bg-gray-50/50">
            {viewMode === 'list' ? (
              <div className="h-full overflow-y-auto w-full">
                <div className="max-w-3xl mx-auto py-12 px-8">
                  <FlowCanvas />
                </div>
              </div>
            ) : (
              <FlowMap />
            )}
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <ChatPreview />

        {/* Modals */}
        <PublishModal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} />
      </div>
    </FlowProvider>
  );
}

export default App;
