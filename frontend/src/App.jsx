import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AddCandidate from './pages/AddCandidate';
import Candidates   from './pages/Candidates';
import Shortlist     from './pages/Shortlist';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-white' : 'text-slate-300 hover:text-white'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
      )}
    </Link>
  );
};

const Navigation = () => {
  return (
    <nav className="glass-nav sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-8 max-w-6xl mx-auto w-full">
        <span className="font-bold text-2xl tracking-tight text-gradient cursor-default select-none">RecruitApp</span>
        <div className="flex gap-4">
          <NavLink to="/">Add Candidate</NavLink>
          <NavLink to="/candidates">All Candidates</NavLink>
          <NavLink to="/shortlist">Shortlist</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative z-10 selection:bg-indigo-500/30">
        <Navigation />
        <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10 my-8 glass-panel rounded-2xl relative overflow-hidden">
          {/* Decorative glow elements behind main content */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <Routes>
              <Route path="/"           element={<AddCandidate />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/shortlist"  element={<Shortlist />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}