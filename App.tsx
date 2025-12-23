import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AnalysisResultView from './components/AnalysisResultView';
import { UploadState } from './types';
import { analyzePhysique, generateFuturePhysique } from './services/geminiService';
import { Sparkles, ArrowRight, Wand2, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<UploadState>({
    file: null,
    previewUrl: null,
    analyzing: false,
    result: null,
    error: null,
    generatedImage: null,
    isGeneratingImage: false,
  });

  const handleFileSelect = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setState(prev => ({ 
      ...prev, 
      file, 
      previewUrl, 
      analyzing: true, 
      error: null,
      generatedImage: null,
      isGeneratingImage: false
    }));

    try {
      const result = await analyzePhysique(file);
      setState(prev => ({ ...prev, analyzing: false, result }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        analyzing: false, 
        error: err.message || "Something went wrong during analysis." 
      }));
    }
  };

  const handleGenerateFuture = async () => {
    if (!state.file || !state.result) return;
    
    setState(prev => ({ ...prev, isGeneratingImage: true, error: null }));
    
    try {
      const generatedImage = await generateFuturePhysique(state.file, state.result.targetAreas);
      setState(prev => ({ ...prev, isGeneratingImage: false, generatedImage }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGeneratingImage: false, 
        error: err.message || "Could not generate visualization." 
      }));
    }
  };

  const handleReset = () => {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    setState({
      file: null,
      previewUrl: null,
      analyzing: false,
      result: null,
      error: null,
      generatedImage: null,
      isGeneratingImage: false,
    });
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100 font-sans selection:bg-primary/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Error Notification */}
        {state.error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center animate-in slide-in-from-top-2">
            {state.error}
            <button onClick={() => setState(s => ({...s, error: null}))} className="ml-4 underline hover:text-red-300">Dismiss</button>
          </div>
        )}

        {/* Hero Section - Only show when no result */}
        {!state.result && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Gemini 3.0 Vision
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Transform Your Body <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
                With AI Precision
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Upload a photo to detect muscle imbalances, correct posture, and get a tailored workout plan instantly.
            </p>
          </div>
        )}

        {/* Interaction Area */}
        <div className="transition-all duration-500 ease-in-out">
          {!state.result ? (
            <div className="space-y-8">
               <ImageUpload onFileSelect={handleFileSelect} isLoading={state.analyzing} />
               
               {/* Feature Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center opacity-50 hover:opacity-100 transition-opacity duration-500">
                  <div className="p-4">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💪</span>
                     </div>
                     <h3 className="text-white font-semibold mb-2">Muscle Analysis</h3>
                     <p className="text-sm text-gray-500">Identify lagging groups instantly.</p>
                  </div>
                  <div className="p-4">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🦴</span>
                     </div>
                     <h3 className="text-white font-semibold mb-2">Posture Correction</h3>
                     <p className="text-sm text-gray-500">Spot alignment issues early.</p>
                  </div>
                  <div className="p-4">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚡</span>
                     </div>
                     <h3 className="text-white font-semibold mb-2">Smart Routines</h3>
                     <p className="text-sm text-gray-500">Personalized sets and reps.</p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar with Image */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Original Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 group">
                   {state.previewUrl && (
                     <img 
                       src={state.previewUrl} 
                       alt="Uploaded physique" 
                       className="w-full h-auto object-cover"
                     />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent opacity-60"></div>
                   <div className="absolute bottom-4 left-4">
                     <span className="text-xs font-mono text-primary bg-black/50 px-2 py-1 rounded">BEFORE</span>
                   </div>
                </div>

                {/* Generated Future Image */}
                {state.generatedImage && (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-purple-500/30 group animate-in zoom-in-95 duration-500">
                     <img 
                       src={state.generatedImage} 
                       alt="Future physique" 
                       className="w-full h-auto object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent opacity-60"></div>
                     <div className="absolute bottom-4 left-4">
                       <span className="text-xs font-mono text-purple-400 bg-black/50 px-2 py-1 rounded">AFTER (ESTIMATED)</span>
                     </div>
                  </div>
                )}

                {/* Generation Control */}
                {!state.generatedImage && (
                  <button 
                    onClick={handleGenerateFuture}
                    disabled={state.isGeneratingImage}
                    className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl border transition-all relative overflow-hidden
                      ${state.isGeneratingImage 
                        ? 'bg-purple-900/20 border-purple-500/20 text-purple-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 hover:border-purple-400 text-white hover:shadow-lg hover:shadow-purple-500/10'
                      }
                    `}
                  >
                    {state.isGeneratingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Visualizing Progress...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 text-purple-400" />
                        <span className="font-semibold">Visualize Progress</span>
                      </>
                    )}
                  </button>
                )}
                
                <button 
                   onClick={handleReset}
                   className="w-full flex items-center justify-center space-x-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-gray-300 hover:text-white transition-all"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Upload New Photo</span>
                </button>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-8">
                <AnalysisResultView result={state.result} onReset={handleReset} />
              </div>
            </div>
          )}
        </div>

      </main>

      <footer className="border-t border-white/5 py-8 mt-12 bg-dark-lighter/30">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PhysiqueAI. Not medical advice. Consult a professional before starting any diet or exercise program.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
