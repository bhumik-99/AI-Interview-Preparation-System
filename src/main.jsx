import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3, Bell, BrainCircuit, CheckCircle2, ChevronRight, Clock3,
  FileText, Home, LogOut, Menu, Mic, Play, Settings, Sparkles,
  Target, TrendingUp, Upload, X, Zap, UserRound, ArrowLeft
} from "lucide-react";
import "./styles.css";
import { api } from "./services/api";

const questions = [
  {
    category: "Technical",
    question: "Explain the difference between TCP and UDP. When would you choose one over the other?",
    hint: "Cover reliability, connection setup, ordering, speed and use cases."
  },
  {
    category: "Technical",
    question: "What is normalization in DBMS and why do we use 3NF?",
    hint: "Think about redundancy, dependencies and update anomalies."
  },
  {
    category: "Behavioral",
    question: "Tell me about a challenging project you worked on and how you handled it.",
    hint: "Use Situation → Task → Action → Result."
  },
  {
    category: "Problem Solving",
    question: "How would you debug a web application that suddenly became very slow?",
    hint: "Explain how you would isolate the bottleneck before changing code."
  }
];

const initialHistory = [
  { id: 1, role: "Software Engineer", type: "Mixed", score: 84, date: "Oct 07, 2026", duration: "18 min" },
  { id: 2, role: "Frontend Developer", type: "Technical", score: 76, date: "Oct 03, 2026", duration: "14 min" },
  { id: 3, role: "SDE Intern", type: "Behavioral", score: 81, date: "Sep 29, 2026", duration: "11 min" }
];

function App() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState({ name: "Resume_Bhumik.pdf", skills: ["React", "C++", "DBMS", "Java", "Python"] });
  const [history, setHistory] = useState(initialHistory);
  const [toast, setToast] = useState("");
  const [interview, setInterview] = useState(null);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const navigate = (next) => {
    setPage(next);
    setMobileOpen(false);
  };

  const startInterview = (config = { role: "Software Engineer", type: "Mixed", difficulty: "Medium" }) => {
    setInterview({ ...config, current: 0, answers: [], startedAt: Date.now() });
    setPage("interview");
  };

  const finishInterview = (score) => {
    const item = {
      id: Date.now(),
      role: interview?.role || "Software Engineer",
      type: interview?.type || "Mixed",
      score,
      date: "Just now",
      duration: `${Math.max(1, Math.round((Date.now() - (interview?.startedAt || Date.now())) / 60000))} min`
    };
    setHistory((items) => [item, ...items]);
    setInterview(null);
    setPage("results");
  };

  if (!user) {
    return <Login onLogin={(account) => { setUser(account); notify("Welcome to PrepAI."); }} />;
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={21} /></div>
          <div><strong>PrepAI</strong><span>Interview Studio</span></div>
          <button className="icon-btn mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>

        <div className="side-label">Workspace</div>
        <NavButton icon={<Home size={18}/>} label="Dashboard" active={page === "dashboard"} onClick={() => navigate("dashboard")} />
        <NavButton icon={<FileText size={18}/>} label="Resume" active={page === "resume"} onClick={() => navigate("resume")} />
        <NavButton icon={<Mic size={18}/>} label="Mock Interview" active={["setup","interview"].includes(page)} onClick={() => navigate("setup")} />
        <NavButton icon={<BarChart3 size={18}/>} label="Analytics" active={page === "analytics"} onClick={() => navigate("analytics")} />
        <NavButton icon={<Clock3 size={18}/>} label="History" active={page === "history"} onClick={() => navigate("history")} />

        <div className="side-label">Account</div>
        <NavButton icon={<Settings size={18}/>} label="Settings" active={page === "settings"} onClick={() => navigate("settings")} />

        <div className="side-bottom">
          <div className="upgrade-card">
            <Sparkles size={18}/>
            <div><strong>AI Coach</strong><span>Personalized practice is ready.</span></div>
          </div>
          <button className="profile-mini" onClick={() => navigate("settings")}>
            <div className="avatar">BS</div>
            <div><strong>{user.name}</strong><span>Candidate</span></div>
            <UserRound size={16} className="muted"/>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21}/></button>
          <div className="crumb"><span>Workspace</span><ChevronRight size={15}/><strong>{titleFor(page)}</strong></div>
          <div className="top-actions">
            <button className="icon-btn" aria-label="Notifications"><Bell size={18}/><i className="notification-dot"/></button>
            <div className="top-avatar">BS</div>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" && <Dashboard navigate={navigate} startInterview={startInterview} resume={resume} history={history} />}
          {page === "resume" && <ResumePage resume={resume} setResume={setResume} notify={notify} />}
          {page === "setup" && <InterviewSetup startInterview={startInterview} />}
          {page === "interview" && interview && <MockInterview interview={interview} setInterview={setInterview} finishInterview={finishInterview} />}
          {page === "results" && <Results navigate={navigate} />}
          {page === "analytics" && <Analytics history={history} />}
          {page === "history" && <History history={history} navigate={navigate} />}
          {page === "settings" && <SettingsPage notify={notify} user={user} setUser={setUser} onLogout={() => setUser(null)} />}
        </div>
      </main>

      {toast && <div className="toast" role="status"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("Bhumik Sharma");
  const [email, setEmail] = useState("bhumik@example.com");
  const [password, setPassword] = useState("password123");

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) return;
    onLogin({ name: name.trim() || email.split("@")[0], email });
  };

  return (
    <div className="auth-page">
      <div className="auth-brand"><div className="brand-mark"><BrainCircuit size={23}/></div><strong>PrepAI</strong></div>
      <div className="auth-card">
        <div className="auth-icon"><Sparkles size={22}/></div>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p>{mode === "login" ? "Continue your interview preparation journey." : "Start practicing with your AI interview coach."}</p>
        <form onSubmit={submit}>
          {mode === "signup" && <Field label="Full name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></Field>}
          <Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></Field>
          <Field label="Password"><input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required/></Field>
          <button className="primary-btn auth-submit" type="submit">{mode === "login" ? "Sign in" : "Create account"} <ChevronRight size={17}/></button>
        </form>
        <button className="switch-auth" onClick={()=>setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
        <div className="demo-note"><Zap size={14}/> Demo login is local. Backend authentication can replace it later.</div>
      </div>
    </div>
  );
}

function titleFor(page) {
  return ({dashboard:"Dashboard", resume:"Resume", setup:"Interview Setup", interview:"Mock Interview", results:"Interview Results", analytics:"Analytics", history:"Interview History", settings:"Settings"})[page] || "Dashboard";
}

function NavButton({icon,label,active,onClick}) {
  return <button className={`nav-btn ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span>{active && <span className="nav-active-dot"/>}</button>;
}

function Dashboard({navigate,startInterview,resume,history}) {
  const avg = Math.round(history.reduce((a,b)=>a+b.score,0)/history.length);
  return <>
    <section className="hero">
      <div>
        <div className="eyebrow"><Sparkles size={15}/> AI-powered interview practice</div>
        <h1>Ready to sharpen your<br/><span>interview edge?</span></h1>
        <p>Practice role-specific questions, get instant feedback, and turn every attempt into progress.</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => startInterview()}><Play size={17} fill="currentColor"/> Start Mock Interview</button>
          <button className="secondary-btn" onClick={() => navigate("resume")}><Upload size={17}/> Update Resume</button>
        </div>
      </div>
      <div className="hero-orb">
        <div className="orb-ring ring-a"/><div className="orb-ring ring-b"/>
        <div className="orb-core"><BrainCircuit size={46}/></div>
        <div className="floating-stat stat-one"><Zap size={14}/> Adaptive AI</div>
        <div className="floating-stat stat-two"><Target size={14}/> 84% ready</div>
      </div>
    </section>

    <div className="stats-grid">
      <StatCard icon={<Target/>} label="Average Score" value={`${avg}%`} trend="+6% this week"/>
      <StatCard icon={<Mic/>} label="Interviews" value={history.length} trend="+2 this week"/>
      <StatCard icon={<TrendingUp/>} label="Readiness" value="84%" trend="Strong progress"/>
      <StatCard icon={<Clock3/>} label="Practice Time" value="43m" trend="+18m this week"/>
    </div>

    <div className="section-head"><div><h2>Continue preparation</h2><p>Pick up where you left off.</p></div><button className="text-btn" onClick={() => navigate("history")}>View history <ChevronRight size={16}/></button></div>
    <div className="dashboard-grid">
      <div className="panel">
        <div className="panel-title"><span><FileText size={18}/> Resume profile</span><button className="small-link" onClick={() => navigate("resume")}>Edit</button></div>
        <div className="resume-file"><div className="pdf-icon">PDF</div><div><strong>{resume.name}</strong><span>Analyzed • {resume.skills.length} skills detected</span></div><CheckCircle2 className="success" size={20}/></div>
        <div className="skills">{resume.skills.map(s=><span key={s}>{s}</span>)}</div>
      </div>
      <div className="panel interview-card">
        <div className="interview-card-top"><span className="pill purple">Recommended</span><span>15–20 min</span></div>
        <h3>Software Engineer Mock</h3>
        <p>Technical + behavioral questions tailored to your resume.</p>
        <div className="progress-line"><span style={{width:"62%"}}/></div>
        <div className="progress-meta"><span>62% readiness</span><span>Continue →</span></div>
        <button className="wide-btn" onClick={() => startInterview({role:"Software Engineer",type:"Mixed",difficulty:"Medium"})}>Continue practice</button>
      </div>
    </div>
  </>;
}

function StatCard({icon,label,value,trend}) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{trend}</small></div>;
}

function PageIntro({icon,title,text}) {
  return <div className="page-intro"><div className="page-icon">{icon}</div><div><h1>{title}</h1><p>{text}</p></div></div>;
}

function ResumePage({resume,setResume,notify}) {
  const [drag,setDrag] = useState(false);
  const handleFile = (file) => {
    if (!file) return;
    const valid = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!valid) return notify("Please upload a PDF resume.");
    setResume({name:file.name,skills:["React","JavaScript","DBMS","C++","Python"]});
    notify("Resume uploaded. AI analysis is mocked for now.");
  };
  return <>
    <PageIntro icon={<FileText/>} title="Resume profile" text="Upload your resume so the AI can tailor interview questions to your experience."/>
    <div className="resume-layout">
      <div className={`upload-box ${drag ? "drag" : ""}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}>
        <div className="upload-circle"><Upload size={25}/></div>
        <h3>Drop your resume here</h3><p>PDF only • Maximum 10 MB</p>
        <label className="primary-btn upload-label"><Upload size={17}/> Choose PDF<input type="file" accept=".pdf,application/pdf" onChange={e=>handleFile(e.target.files[0])}/></label>
      </div>
      <div className="panel">
        <div className="panel-title"><span>Current resume</span><span className="pill green">Analyzed</span></div>
        <div className="current-file"><div className="pdf-icon">PDF</div><div><strong>{resume.name}</strong><span>Ready for personalized interviews</span></div></div>
        <h4>Detected skills</h4><div className="skills">{resume.skills.map(s=><span key={s}>{s}</span>)}</div>
        <div className="info-note"><Sparkles size={16}/><span>Backend integration point: POST /api/resume/upload</span></div>
      </div>
    </div>
  </>;
}

function InterviewSetup({startInterview}) {
  const [role,setRole] = useState("Software Engineer");
  const [type,setType] = useState("Mixed");
  const [difficulty,setDifficulty] = useState("Medium");
  return <>
    <PageIntro icon={<Mic/>} title="Set up your mock interview" text="Choose the interview style and let the AI build a personalized session."/>
    <div className="setup-card">
      <div className="form-grid">
        <Field label="Target role"><select value={role} onChange={e=>setRole(e.target.value)}><option>Software Engineer</option><option>Frontend Developer</option><option>Backend Developer</option><option>Data Analyst</option><option>SDE Intern</option></select></Field>
        <Field label="Interview type"><select value={type} onChange={e=>setType(e.target.value)}><option>Mixed</option><option>Technical</option><option>Behavioral</option></select></Field>
        <Field label="Difficulty"><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select></Field>
        <Field label="Question count"><select defaultValue="10"><option>5</option><option>10</option><option>15</option></select></Field>
      </div>
      <div className="setup-preview"><div><div className="setup-icon"><Sparkles size={20}/></div><div><strong>AI-generated session</strong><p>Questions will be adapted to your resume, role and selected difficulty.</p></div></div><div className="preview-tags"><span>Resume-aware</span><span>Adaptive questions</span><span>Instant feedback</span></div></div>
      <button className="primary-btn large" onClick={()=>startInterview({role,type,difficulty})}><Play size={18} fill="currentColor"/> Start interview</button>
    </div>
  </>;
}

function Field({label,children}) { return <label className="field"><span>{label}</span>{children}</label>; }

function MockInterview({interview,setInterview,finishInterview}) {
  const [answer,setAnswer] = useState("");
  const [seconds,setSeconds] = useState(0);
  const q = questions[interview.current % questions.length];
  useEffect(()=>{ const id=setInterval(()=>setSeconds(s=>s+1),1000); return()=>clearInterval(id); },[]);
  const next = () => {
    const answers=[...interview.answers,answer.trim()];
    if(interview.current>=questions.length-1){ finishInterview(Math.min(96,72+answers.filter(Boolean).length*6)); return; }
    setInterview({...interview,current:interview.current+1,answers}); setAnswer(""); setSeconds(0);
  };
  const time=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  return <div className="interview-page">
    <div className="interview-top"><div><span className="pill purple">{q.category}</span><span className="interview-role">{interview.role}</span></div><div className="timer"><Clock3 size={16}/>{time}</div></div>
    <div className="question-progress"><span style={{width:`${((interview.current+1)/questions.length)*100}%`}}/></div>
    <div className="question-panel">
      <div className="question-number">QUESTION {interview.current+1} OF {questions.length}</div>
      <h1>{q.question}</h1>
      <div className="hint"><Sparkles size={16}/><span><strong>AI hint:</strong> {q.hint}</span></div>
      <label className="answer-label">Your answer</label>
      <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Type your answer here..." rows={8}/>
      <div className="answer-actions"><button className="secondary-btn" type="button"><Mic size={17}/> Voice input <small>API-ready</small></button><button className="primary-btn" onClick={next}>{interview.current===questions.length-1?"Finish interview":"Next question"} <ChevronRight size={17}/></button></div>
    </div>
  </div>;
}

function Results({navigate}) {
  return <>
    <PageIntro icon={<Target/>} title="Interview complete" text="Here's a preview of the feedback your AI coach will provide."/>
    <div className="result-hero"><div className="score-ring"><strong>84</strong><span>/ 100</span></div><div><span className="pill green">Good performance</span><h2>You're building strong interview readiness.</h2><p>Keep practicing communication structure and technical depth to move toward the 90+ range.</p></div></div>
    <div className="score-grid"><Score label="Technical correctness" value={88}/><Score label="Communication clarity" value={79}/><Score label="Confidence" value={84}/></div>
    <div className="feedback-grid"><div className="panel"><h3>Strengths</h3><ul className="feedback-list good"><li>Good understanding of core concepts</li><li>Answers stay relevant to the question</li><li>Clear technical vocabulary</li></ul></div><div className="panel"><h3>Improve next</h3><ul className="feedback-list warn"><li>Add more concrete examples</li><li>Reduce hesitation between points</li><li>Use a clearer answer structure</li></ul></div></div>
    <div className="result-actions"><button className="secondary-btn" onClick={()=>navigate("history")}><Clock3 size={17}/> View history</button><button className="primary-btn" onClick={()=>navigate("setup")}><RotateCcw size={17}/> Practice again</button></div>
  </>;
}

function Score({label,value}) { return <div className="score-card"><div className="score-top"><span>{label}</span><strong>{value}%</strong></div><div className="score-bar"><span style={{width:`${value}%`}}/></div></div>; }

function Analytics({history}) {
  const avg=Math.round(history.reduce((a,b)=>a+b.score,0)/history.length);
  const bars=[64,72,68,78,74,84,81,88];
  return <>
    <PageIntro icon={<BarChart3/>} title="Performance analytics" text="Track how your interview readiness changes over time."/>
    <div className="analytics-grid"><StatCard icon={<Target/>} label="Average score" value={`${avg}%`} trend="+6% vs last week"/><StatCard icon={<TrendingUp/>} label="Best score" value={`${Math.max(...history.map(x=>x.score))}%`} trend="Personal best"/><StatCard icon={<Zap/>} label="Consistency" value="91%" trend="Strong"/></div>
    <div className="panel chart-panel"><div className="panel-title"><span>Score trend</span><span className="muted">Last 8 attempts</span></div><div className="bars">{bars.map((v,i)=><div className="bar-wrap" key={i}><div className="bar" style={{height:`${v}%`}}><span>{v}</span></div><small>#{i+1}</small></div>)}</div></div>
    <div className="panel"><div className="panel-title"><span>Skill breakdown</span></div><div className="skill-rows"><SkillRow name="Technical knowledge" value={88}/><SkillRow name="Communication" value={79}/><SkillRow name="Confidence" value={84}/><SkillRow name="Problem solving" value={82}/></div></div>
  </>;
}

function SkillRow({name,value}) { return <div className="skill-row"><span>{name}</span><div className="score-bar"><span style={{width:`${value}%`}}/></div><strong>{value}%</strong></div>; }

function History({history,navigate}) {
  return <>
    <PageIntro icon={<Clock3/>} title="Interview history" text="Review your previous attempts and keep improving."/>
    <div className="panel table-panel"><div className="history-head"><div><h3>Previous interviews</h3><p>{history.length} recorded attempts</p></div><button className="primary-btn" onClick={()=>navigate("setup")}><Play size={16} fill="currentColor"/> New interview</button></div>
      <div className="table-scroll"><table><thead><tr><th>Role</th><th>Type</th><th>Score</th><th>Date</th><th>Duration</th></tr></thead><tbody>{history.map(item=><tr key={item.id}><td><strong>{item.role}</strong></td><td><span className="pill">{item.type}</span></td><td><span className={`table-score ${item.score>=80?"good-score":"mid-score"}`}>{item.score}%</span></td><td>{item.date}</td><td>{item.duration}</td></tr>)}</tbody></table></div>
    </div>
  </>;
}

function SettingsPage({notify,user,setUser,onLogout}) {
  const [name,setName]=useState(user.name);
  return <>
    <PageIntro icon={<Settings/>} title="Settings" text="Manage your profile and preparation preferences."/>
    <div className="settings-card panel"><div className="settings-avatar">BS</div><Field label="Display name"><input value={name} onChange={e=>setName(e.target.value)}/></Field><Field label="Email"><input value={user.email} disabled/></Field><div className="setting-actions"><button className="primary-btn" onClick={()=>{setUser({...user,name:name.trim()||user.name});notify("Profile updated.")}}>Save changes</button><button className="danger-btn" onClick={onLogout}><LogOut size={16}/> Sign out</button></div></div>
  </>;
}

createRoot(document.getElementById("root")).render(<App />);
