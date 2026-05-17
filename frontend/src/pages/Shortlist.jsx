import { useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export default function Shortlist() {
  const [form, setForm]     = useState({ requiredSkills:'', preferredSkills:'', minExperience:0 });
  const [basic, setBasic]   = useState([]);
  const [ai, setAi]         = useState([]);
  const [loading, setLoading] = useState(false);

  const buildPayload = () => ({
    requiredSkills:  form.requiredSkills.split(',').filter(Boolean).map(s => s.trim()),
    preferredSkills: form.preferredSkills.split(',').filter(Boolean).map(s => s.trim()),
    minExperience:   Number(form.minExperience)
  });

  const runBasic = async () => {
    const res = await axios.post(`${API}/api/match`, buildPayload());
    setBasic(res.data);
  };

  const runAI = async () => {
    setLoading(true);
    const res = await axios.post(`${API}/api/ai/shortlist`, buildPayload());
    setAi(res.data);
    setLoading(false);
  };

  const tierColor = t => 
    t === 'High' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    t === 'Partial' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
    'bg-rose-500/20 text-rose-300 border-rose-500/30';

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Shortlist Candidates</h1>
        <p className="text-slate-400 text-lg">Use basic matching or AI to find the best candidates for your job.</p>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Criteria
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Required Skills</label>
            <input placeholder="e.g. React, Node.js" value={form.requiredSkills}
              onChange={e => setForm({...form, requiredSkills: e.target.value})}
              className="w-full glass-input rounded-xl p-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Preferred Skills</label>
            <input placeholder="e.g. TypeScript, AWS" value={form.preferredSkills}
              onChange={e => setForm({...form, preferredSkills: e.target.value})}
              className="w-full glass-input rounded-xl p-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Minimum Experience (Years)</label>
            <input type="number" placeholder="0" value={form.minExperience}
              onChange={e => setForm({...form, minExperience: e.target.value})}
              className="w-full glass-input rounded-xl p-3 text-sm" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-8">
          <button onClick={runBasic} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-medium px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Run Basic Match
          </button>
          <button onClick={runAI} disabled={loading} className="btn-primary flex items-center px-6 py-2.5 rounded-xl disabled:opacity-70 disabled:pointer-events-none">
            {loading ? (
              <><span className="mr-3 w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>AI Thinking…</>
            ) : (
              <><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Run AI Shortlist</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Results Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-2xl font-bold text-white">Basic Results</h2>
            {basic.length > 0 && <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">{basic.length} found</span>}
          </div>
          
          <div className="flex-1">
            {basic.length > 0 ? (
              <div className="space-y-4">
                {basic.map((c, i) => (
                  <div key={c._id} className="glass-card p-5 rounded-2xl animate-[slideUp_0.4s_ease-out]" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-bold text-white text-lg">{c.name}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tierColor(c.tier)}`}>
                        {c.matchScore}% · {c.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">Matched Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.matchedSkills.length > 0 ? c.matchedSkills.map(s => (
                        <span key={s} className="bg-slate-800/80 text-slate-300 border border-slate-700 text-xs px-2 py-1 rounded-md">{s}</span>
                      )) : <span className="text-slate-500 text-xs italic bg-slate-800/30 px-2 py-1 rounded-md">None</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-slate-400">Run basic match to see results here.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Results Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI Ranking</span>
            </h2>
            {ai.length > 0 && <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">{ai.length} ranked</span>}
          </div>
          
          <div className="flex-1">
            {ai.length > 0 ? (
              <div className="space-y-4">
                {ai.map((c, i) => (
                  <div key={i} className="glass-card p-5 rounded-2xl relative overflow-hidden animate-[slideUp_0.4s_ease-out]" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                    <div className="flex justify-between items-start mb-3 pl-3">
                      <p className="font-bold text-white text-lg flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">#{c.rank}</span> 
                        {c.name}
                      </p>
                      <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold px-3 py-1 rounded-full">
                        {c.score}% Match
                      </span>
                    </div>
                    <div className="pl-3 mt-3">
                      <div className="bg-slate-800/40 rounded-lg p-3 border border-white/5">
                        <p className="text-sm text-slate-300 italic leading-relaxed">
                          "{c.reason}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="text-slate-400">Run AI shortlist for smart rankings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}