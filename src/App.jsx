import React, { useState } from 'react';
import { FlowProvider } from './context/FlowContext';
import SidebarBlocks from './components/SidebarBlocks';
import FlowBuilder from './components/FlowBuilder';
import FlowCanvas from './components/FlowCanvas';
import FlowMap from './components/FlowMap';
import ChatPreview from './components/ChatPreview';
import PublishModal from './components/PublishModal';
import { LayoutList, GitGraph, MonitorPlay, Smartphone, X } from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <FlowProvider>
      <FlowBuilder>
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
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <Smartphone size={16} />
                  Preview
                </button>
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

          {/* Modals */}
          <PublishModal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} />

          {/* Preview Modal */}
          {isPreviewOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              {/* Mobile Device Frame styling for senior developer feel */}
              <div className="relative w-[375px] h-[812px] max-h-[90vh] bg-gray-900 rounded-[3rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden flex flex-col animate-scale-up">
                {/* Device Notch/Camera (Visual only) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>

                {/* Screen Content */}
                <div className="flex-1 bg-white overflow-hidden rounded-[2.5rem] relative">
                  <ChatPreview onClose={() => setIsPreviewOpen(false)} />
                </div>
              </div>

              {/* Close Button specific for modal context if needed, but ChatPreview already has one. 
                    However, clicking outside should maybe close it too? 
                    Let's add a wrapper close click.
                 */}
              <div className="absolute inset-0 -z-10" onClick={() => setIsPreviewOpen(false)}></div>
            </div>
          )}
        </div>
      </FlowBuilder>
    </FlowProvider>
  );
}

export default App;
