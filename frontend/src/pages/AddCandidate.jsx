import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function AddCandidate() {
  const [form, setForm] = useState({ name:'', email:'', skills:'', experience:'', bio:'' });
  const [msg, setMsg] = useState('');

  const submit = async () => {
    try {
      await axios.post(`${API}/api/candidates`, {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()),
        experience: Number(form.experience)
      });
      setMsg('Candidate added successfully!');
      setForm({ name:'', email:'', skills:'', experience:'', bio:'' });
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Error adding candidate.'); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Add New Candidate</h1>
        <p className="text-slate-400 text-lg">Enter the candidate's details below to add them to the system.</p>
      </div>
      
      <div className="space-y-5 glass-card p-8 rounded-2xl relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input placeholder="John Doe" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full glass-input rounded-xl p-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input placeholder="john@example.com" type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full glass-input rounded-xl p-3 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Years of Experience</label>
          <input placeholder="e.g. 5" type="number" value={form.experience}
            onChange={e => setForm({...form, experience: e.target.value})}
            className="w-full glass-input rounded-xl p-3 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Skills (comma separated)</label>
          <input placeholder="React, Node.js, Python" value={form.skills}
            onChange={e => setForm({...form, skills: e.target.value})}
            className="w-full glass-input rounded-xl p-3 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Bio</label>
          <textarea placeholder="Short background about the candidate..." value={form.bio} rows="3"
            onChange={e => setForm({...form, bio: e.target.value})}
            className="w-full glass-input rounded-xl p-3 text-sm resize-none" />
        </div>

        <div className="pt-4">
          <button onClick={submit} className="w-full btn-primary text-lg py-3 rounded-xl">
            Save Candidate
          </button>
        </div>
        
        {msg && (
          <div className={`absolute -bottom-16 left-0 right-0 p-4 rounded-xl text-center text-sm font-medium border backdrop-blur-md animate-[slideUp_0.3s_ease-out] shadow-lg ${
            msg.includes('Error') 
              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}