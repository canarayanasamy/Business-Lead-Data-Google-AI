import React from 'react';

export default function Navbar() {
  return (
    <header className="bg-primary text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-accent w-8 h-8 rounded-md flex items-center justify-center font-extrabold text-sm">
          BLM
        </div>
        <div>
          <div className="font-bold text-base leading-tight">Business Lead Manager</div>
          <div className="text-[10px] opacity-70 uppercase tracking-wider">Enterprise Web Intelligence</div>
        </div>
      </div>
      <div className="text-[11px] opacity-80 font-medium tracking-wider uppercase text-right">
        Developed by CA Narayanasamy
      </div>
    </header>
  );
}
