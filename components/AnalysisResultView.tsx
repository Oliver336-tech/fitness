import React from 'react';
import { AnalysisResult } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CheckCircle2, AlertCircle, Dumbbell, Target, Info } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisResultView: React.FC<Props> = ({ result, onReset }) => {
  if (!result.detected) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-400 mb-2">No Person Detected</h2>
        <p className="text-gray-300 mb-6">{result.message || "We couldn't clearly see a person in this image. Please upload a clear photo of your physique."}</p>
        <button 
          onClick={onReset}
          className="px-6 py-2 bg-white text-dark font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Mock data for the chart based on the analysis count (just for visual flair)
  const chartData = [
    { name: 'Strength', value: 65 },
    { name: 'Endurance', value: 45 },
    { name: 'Mobility', value: 55 },
    { name: 'Symmetry', value: 70 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-lighter p-6 rounded-2xl border border-white/5">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-white">AI Analysis Summary</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg">{result.summary}</p>
          
          {result.estimatedBodyFat && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-primary font-medium mr-2">Est. Body Fat:</span>
              <span className="text-white font-bold">{result.estimatedBodyFat}</span>
            </div>
          )}
        </div>

        {/* Stats Chart */}
        <div className="bg-dark-lighter p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
           <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Projected Stats</h3>
           <div className="h-40 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Focus Areas & Posture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-lighter p-6 rounded-2xl border border-white/5">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-white">Target Focus Areas</h3>
          </div>
          <ul className="space-y-3">
            {result.targetAreas.map((area, idx) => (
              <li key={idx} className="flex items-center p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-secondary mr-3" />
                <span className="text-gray-200 capitalize">{area}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-dark-lighter p-6 rounded-2xl border border-white/5">
           <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Posture Notes</h3>
          </div>
          <ul className="space-y-3">
            {result.postureNotes.map((note, idx) => (
              <li key={idx} className="flex items-start p-3 bg-white/5 rounded-lg">
                 <span className="text-orange-400 mr-3 mt-1">•</span>
                 <span className="text-gray-200">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Workout Plan */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Dumbbell className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-white">Recommended Routine</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.routine.map((exercise, idx) => (
            <div key={idx} className="group bg-dark-lighter hover:bg-dark-lighter/80 border border-white/5 hover:border-primary/30 transition-all duration-300 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Dumbbell className="w-24 h-24 text-white transform rotate-12" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1 relative z-10">{exercise.name}</h3>
              <p className="text-sm text-primary font-medium mb-4 uppercase tracking-wider relative z-10">{exercise.sets} Sets × {exercise.reps}</p>
              
              <div className="pt-4 border-t border-white/10 relative z-10">
                <p className="text-sm text-gray-400 italic">"{exercise.focus}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-20">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all backdrop-blur-sm"
        >
          Analyze Another Photo
        </button>
      </div>

    </div>
  );
};

export default AnalysisResultView;
