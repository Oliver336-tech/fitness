import React from 'react';
import { Activity, Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-dark/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-primary to-emerald-300 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-dark" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              PhysiqueAI
            </span>
          </div>
          <div className="flex items-center space-x-4">
             {/* Placeholder for future auth/menu */}
             <button className="text-gray-400 hover:text-white transition-colors">
               <Camera className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
