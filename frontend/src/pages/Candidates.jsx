import { useEffect, useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/candidates`).then(r => setCandidates(r.data));
  }, []);

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">All Candidates</h1>
        <p className="text-slate-400 text-lg">Review the list of all available candidates in the system.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((c, i) => (
          <div 
            key={c._id} 
            className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{c.name}</h3>
                  <p className="text-sm text-indigo-400 font-medium truncate max-w-[200px]" title={c.email}>{c.email}</p>
                </div>
                <span className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                  {c.experience} {c.experience === 1 ? 'yr' : 'yrs'} exp
                </span>
              </div>
              
              {c.bio && (
                <p className="text-slate-300 text-sm mb-5 line-clamp-3 leading-relaxed">
                  {c.bio}
                </p>
              )}
            </div>
            
            <div className="pt-5 border-t border-white/10 mt-auto">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {c.skills.map(s => (
                  <span key={s} className="bg-slate-800/50 border border-slate-600/50 text-slate-300 text-xs px-2.5 py-1 rounded-md shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {candidates.length === 0 && (
        <div className="text-center py-20 glass-card rounded-2xl mt-8">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No candidates found</h3>
          <p className="text-slate-400">Add some candidates to get started with your recruitment process!</p>
        </div>
      )}
    </div>
  );
}