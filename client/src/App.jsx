import { useEffect, useMemo, useState } from 'react';
import api from './api';
import './index.css';

const initialState = { firstName: '', lastName: '', email: '', verified: false };

function App() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(initialState);
  const [message, setMessage] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', code: '', task: '', note: '', term: '', definition: '', amount: 0, description: '', type: 'income', controlText: '', uncontrolledText: '' });
  const [notes, setNotes] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [budget, setBudget] = useState([]);
  const [dictionary, setDictionary] = useState([]);
  const [dichotomyControl, setDichotomyControl] = useState([]);
  const [dichotomyUncontrolled, setDichotomyUncontrolled] = useState([]);
  const [activeTab, setActiveTab] = useState('notes');

  const initials = useMemo(() => profile.firstName?.[0]?.toUpperCase() || 'U', [profile]);

  useEffect(() => {
    const token = localStorage.getItem('mydaries_token');
    if (token && !user) {
      api.get('/data/profile').then((res) => { setProfile(res.data); setUser(res.data); }).catch(() => logout());
    }
  }, [user]);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const logout = () => {
    localStorage.removeItem('mydaries_token');
    setUser(null); setProfile(initialState); setNotes([]); setChecklist([]); setBudget([]); setDictionary([]); setMode('login');
  };

  const loadData = async () => {
    if (!user) return;
    const [dataNotes, dataChecklist, dataBudget, dataDictionary] = await Promise.all([
      api.get('/data/notes'), api.get('/data/checklist'), api.get('/data/budget'), api.get('/data/dictionary')
    ]);
    setNotes(dataNotes.data); setChecklist(dataChecklist.data); setBudget(dataBudget.data); setDictionary(dataDictionary.data);
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  useEffect(() => {
    const saved = localStorage.getItem('mydaries_dichotomy');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDichotomyControl(parsed.control || []);
        setDichotomyUncontrolled(parsed.uncontrolled || []);
      } catch (err) {
        console.warn('Invalid dichotomy cache', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mydaries_dichotomy', JSON.stringify({
      control: dichotomyControl,
      uncontrolled: dichotomyUncontrolled
    }));
  }, [dichotomyControl, dichotomyUncontrolled]);

  const performAuth = async (path, payload) => {
    try {
      const { data } = await api.post(`/auth/${path}`, payload);
      if (path === 'login') {
        localStorage.setItem('mydaries_token', data.token); setUser(data.user); setProfile(data.user); setMode('dashboard'); showMessage('Login success');
      } else if (path === 'register') {
        setVerifyCode(data.verifyCode); setMode('verify'); showMessage(`Account created. Code: ${data.verifyCode}`);
      } else if (path === 'verify') {
        showMessage('Email verified, now login'); setMode('login');
      } else if (path === 'forgot') {
        showMessage(`Reset code: ${data.resetCode}`);
      } else if (path === 'reset') {
        showMessage('Password reset success, login'); setMode('login');
      }
    } catch (e) {
      showMessage(e.response?.data?.message || 'Error', 'error');
    }
  };

  const addItem = async (type, payload) => {
    try {
      await api.post(`/data/${type}`, payload);
      loadData();
      showMessage(`${type} saved`);
    } catch (error) { showMessage('Save failed', 'error'); }
  };

  const removeItem = async (type, id) => {
    try {
      await api.delete(`/data/${type}/${id}`);
      if (type === 'notes') setNotes((prev) => prev.filter((item) => item._id !== id));
      if (type === 'checklist') setChecklist((prev) => prev.filter((item) => item._id !== id));
      if (type === 'budget') setBudget((prev) => prev.filter((item) => item._id !== id));
      if (type === 'dictionary') setDictionary((prev) => prev.filter((item) => item._id !== id));
      showMessage('Item deleted');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const toggleDone = async (id) => {
    await api.put(`/data/checklist/${id}/toggle`); loadData();
  };

  const addDichotomyItem = (type) => {
    const text = type === 'control' ? form.controlText.trim() : form.uncontrolledText.trim();
    if (!text) return;
    const item = { id: Date.now().toString(), text };
    if (type === 'control') {
      setDichotomyControl((prev) => [item, ...prev]);
      setForm((p) => ({ ...p, controlText: '' }));
    } else {
      setDichotomyUncontrolled((prev) => [item, ...prev]);
      setForm((p) => ({ ...p, uncontrolledText: '' }));
    }
  };

  const removeDichotomyItem = (type, id) => {
    if (type === 'control') {
      setDichotomyControl((prev) => prev.filter((item) => item.id !== id));
    } else {
      setDichotomyUncontrolled((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (!user || mode !== 'dashboard') {
    return (
      
      <div className="app-wrapper">
        <section className="hero">
          <div className="hero-text">
            <h1>My DarieS</h1>
            <p className="hero-subtitle">Capture your thoughts, plan your day, and build better habits with a joyful daily dashboard.</p>
          </div>
        </section>
        <div className="auth-card">
          
          

          {mode === 'login' && (
            <form onSubmit={(e) => { e.preventDefault(); performAuth('login', { email: form.email, password: form.password }); }}>
              <h2>Login</h2>
              <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
              <button type="submit">Login</button>
              <p><a onClick={() => setMode('forgot')} className="link">Forgot password?</a></p>
            </form>
          )}
          {mode === 'register' && (
            <form onSubmit={(e) => { e.preventDefault(); performAuth('register', { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password }); }}>
              <h2>Register</h2>
              <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} required />
              <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} required />
              <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required minLength={6} />
              <button type="submit">Sign up</button>
            </form>
          )}
          {mode === 'verify' && (
            <form onSubmit={(e) => { e.preventDefault(); performAuth('verify', { email: form.email, code: form.code }); }}>
              <h2>Email verification</h2>
              <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              <input placeholder="Code" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} required />
              <button type="submit">Verify</button>
            </form>
          )}
          {mode === 'forgot' && (
            <form onSubmit={(e) => { e.preventDefault(); performAuth('forgot', { email: form.email }); setMode('reset'); }}>
              <h2>Forgot password</h2>
              <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              <button type="submit">Send code</button>
            </form>
          )}
          {mode === 'reset' && (
            <form onSubmit={(e) => { e.preventDefault(); performAuth('reset', { email: form.email, code: form.code, password: form.password }); }}>
              <h2>Reset password</h2>
              <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              <input placeholder="Reset Code" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} required />
              <input placeholder="New Password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
              <button type="submit">Reset</button>
            </form>
          )}
 <div className="mode-switch">
            
            
            <button onClick={() => setMode('login')} className={mode === 'login' ? 'active' : ''}>Login</button>
            <button onClick={() => setMode('register')} className={mode === 'register' ? 'active' : ''}>Register</button>
          </div>
          {message && <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>{message}</div>}
          
        </div>
       <div className="hero-text">
        <h4>About MyDarieS:</h4>
       </div>
            <p className="hero-subtitle">MyDarieS helps you organize your daily tasks and stay productive,where you can manage your notes, checklists, budget, dictionary and dichotomy control .</p>
          
        <footer className="app-footer">Built by ezhilarasi98 · email: ezhilarasi0898@gmail.com</footer>
      </div>
      
    );
  }

  return (
    <div className="app-wrapper1">
      <header className="dashboard-header">
        <div className="profile-badge">{initials}</div>
        <div>
          <h1>Welcome, {profile.firstName} {profile.lastName}</h1>
          <p>{profile.email} • {profile.verified ? 'Verified' : 'Not Verified'}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      <nav className="tabs">
        {['notes', 'checklist', 'budget', 'dictionary', 'dichotomy'].map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </nav>

      <section className="content-panel">
        {activeTab === 'notes' && (
          <div>
            <h2>Daily Notes</h2>
            <textarea value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} placeholder="Write note" />
            <button onClick={() => { if (!form.note) return; addItem('notes', { text: form.note }); setForm((p) => ({ ...p, note: '' })); }}>Save</button>
            <ul>{notes.map((item) => (<li key={item._id}>{item.text}
              <button onClick={() => removeItem('notes', item._id)}>Delete</button></li>))}</ul>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div>
            <h2>Checklist</h2>
            <input value={form.task} onChange={(e) => setForm((p) => ({ ...p, task: e.target.value }))} placeholder="New task" />
            <button onClick={() => { if (!form.task) return; addItem('checklist', { task: form.task }); setForm((p) => ({ ...p, task: '' })); }}>Add</button>
            <ul>{checklist.map((item) => (
              <li key={item._id} className={item.done ? 'done' : ''}>
                <label>
                  <input type="checkbox" checked={item.done} onChange={() => toggleDone(item._id)} />{item.task}
                  </label>
            <button onClick={() => removeItem('checklist', item._id)}>Delete</button>
            </li>
          ))}
            </ul>
          </div>
        )}

        {activeTab === 'budget' && (
          <div>
            <h2>Budget</h2>
            <input placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} />
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}><option value="income">Income</option><option value="expense">Expense</option></select>
            <button onClick={() => { if (!form.description || !form.amount) return; addItem('budget', { description: form.description, amount: Number(form.amount), type: form.type }); setForm((p) => ({ ...p, description: '', amount: 0 })); }}>Add</button>
            <ul>{budget.map((entry)=> (<li key={entry._id}>{entry.description} - {entry.type} ₹{entry.amount}<button onClick={() => removeItem('budget', entry._id)}>Delete</button></li>))}</ul>
            <p>Balance: ₹{budget.reduce((acc,e)=> e.type==='income'? acc+e.amount : acc-e.amount, 0)}</p>
          </div>
        )}

        {activeTab === 'dictionary' && (
          <div>
            <h2>Dictionary</h2>
            <input placeholder="Term" value={form.term} onChange={(e)=>setForm((p)=>({...p, term:e.target.value}))} />
            <textarea placeholder="Definition" value={form.definition} onChange={(e)=>setForm((p)=>({...p, definition:e.target.value}))} />
            <button onClick={()=>{if(!form.term || !form.definition) return; addItem('dictionary',{term:form.term,definition:form.definition}); setForm((p)=>({...p, term:'', definition:''}));}}>Add Entry</button>
            <ul>{dictionary.map((item)=> (<li key={item._id}><strong>{item.term}</strong>: {item.definition}<button onClick={()=>removeItem('dictionary', item._id)}>Delete</button></li>))}</ul>
          </div>
        )}
        {activeTab === 'dichotomy' && (
          <div>
            <h2>Dichotomy Control</h2>
            <p className="dichotomy-description">Capture what you can control and what is outside your control. This helps you focus on positive action and notice the patterns that feel out of your control.</p>
            <div className="dichotomy-grid">
              <div className="dichotomy-column">
                <h3>Can Control</h3>
                <div className="dichotomy-form">
                  <input placeholder="Add something you can control" value={form.controlText} onChange={(e) => setForm((p) => ({ ...p, controlText: e.target.value }))} />
                  <button type="button" onClick={() => addDichotomyItem('control')}>Add</button>
                </div>
                <ul>{dichotomyControl.map((item) => (<li key={item.id}>{item.text}<button type="button" onClick={() => removeDichotomyItem('control', item.id)}>Delete</button></li>))}</ul>
              </div>
              <div className="dichotomy-column">
                <h3>Out of Control</h3>
                <div className="dichotomy-form">
                  <input placeholder="Add something you cannot control" value={form.uncontrolledText} onChange={(e) => setForm((p) => ({ ...p, uncontrolledText: e.target.value }))} />
                  <button type="button" onClick={() => addDichotomyItem('uncontrolled')}>Add</button>
                </div>
                <ul>{dichotomyUncontrolled.map((item) => (<li key={item.id}>{item.text}<button type="button" onClick={() => removeDichotomyItem('uncontrolled', item.id)}>Delete</button></li>))}</ul>
              </div>
            </div>
          </div>
        )}
      </section>
      {message && <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>{message}</div>}
     
    </div>
    
  );
  
}

export default App;
