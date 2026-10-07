import { useEffect, useState } from 'react'
import {
  CalendarDays, Camera, Heart, Home, Image, MapPin, MessageCircle,
  Mic, MoreHorizontal, Plus, Send, Settings, Sparkles, Users, Bell,
  ChevronRight, LogOut, Loader2, ArrowRight, LockKeyhole, UserRound
} from 'lucide-react'
import { supabase } from './lib/supabaseClient'

const familySeed = [
  {name:'Mum', initials:'M', tone:'rose'},
  {name:'Dad', initials:'D', tone:'blue'},
  {name:'Sarah', initials:'S', tone:'gold'},
  {name:'Daniel', initials:'D', tone:'green'},
  {name:'Grace', initials:'G', tone:'violet'},
]

const demoPosts = [
 {name:'Mum', time:'12 min ago', avatar:'M', tone:'rose', text:'Sunday lunch at ours this weekend ❤️ Everyone is welcome. I’ll share the menu later!', image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', likes:5, comments:3},
 {name:'Daniel', time:'Yesterday', avatar:'D', tone:'green', text:'Made it to the lake! The view is beautiful. Wish you were all here 🌿', image:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80', likes:8, comments:4}
]

function Avatar({letter,tone='blue',size=''}) {
  return <div className={`avatar ${tone} ${size}`}>{letter}</div>
}

function usernameEmail(username) {
  return username.toLowerCase().trim() + '@zovve.local'
}

function AuthScreen() {
  const [mode, setMode] = useState('join')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setMessage('')
    const cleanUsername = username.trim().toLowerCase()
    if (!/^[a-z0-9_]{3,24}$/.test(cleanUsername)) { setError('Username must be 3–24 characters using letters, numbers, or underscores.'); setLoading(false); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return }
    const email = usernameEmail(cleanUsername)
    const result = mode === 'join'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    const { error, data } = result
    if (error) setError(error.message)
    else if (mode === 'join') setMessage(data.session ? 'Account created. Now complete your family profile.' : 'Account created. If you cannot continue, the family login settings need to be enabled in Supabase.')
    else setMessage('Welcome back.')
    setLoading(false)
  }

  return <div className="authShell">
    <div className="authPanel">
      <div className="brand authBrand"><div className="brandMark">z</div><span>zovve</span></div>
      <div className="authHero">
        <span className="pill"><Sparkles size={14}/> Private family space</span>
        <h1>{mode === 'join' ? 'Your family,<br/>all in one place.' : 'Welcome<br/>back home.'}</h1>
        <p>{mode === 'join' ? 'A quiet, private place for the people who matter most.' : 'Sign in to see what everyone is sharing.'}</p>
      </div>
      <form className="authForm" onSubmit={submit}>
        <label>Username</label>
        <div className="authInput"><UserRound size={18}/><input type="text" value={username} onChange={e=>setUsername(e.target.value.toLowerCase())} placeholder="e.g. sarah" autoComplete="username" required /></div>
        <label>Password</label>
        <div className="authInput"><LockKeyhole size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode==='join'?'new-password':'current-password'} required /></div>
        <button className="authSubmit" disabled={loading}>{loading ? <><Loader2 className="spin" size={18}/> {mode==='join'?'Creating account...':'Signing in...'}</> : <>{mode === 'join' ? 'Create family account' : 'Sign in'} <ArrowRight size={17}/></>}</button>
        {message && <div className="successBox">{message}</div>}
        {error && <div className="errorBox">{error}</div>}
      </form>
      <div className="authSwitch">{mode === 'join' ? <>Already joined? <button onClick={()=>{setMode('login');setMessage('');setError('')}}>Sign in</button></> : <>New family member? <button onClick={()=>{setMode('join');setMessage('');setError('')}}>Join Zovve</button></>}</div>
      <small className="authPrivacy"><LockKeyhole size={13}/> Invitation-only family access · No email required</small>
    </div>
    <div className="authArt"><div className="authSun"/><div className="authHill one"/><div className="authHill two"/><div className="authQuote">“The little moments<br/>become the big memories.”</div></div>
  </div>
}

function Onboarding({user,onComplete}) {
  const [name,setName]=useState('')
  const [dob,setDob]=useState('')
  const [code,setCode]=useState('')
  const [username,setUsername]=useState(user?.email?.split('@')[0] || '')
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError('')
    const {data,error} = await supabase.rpc('complete_onboarding',{p_full_name:name.trim(), p_date_of_birth:dob, p_invite_code:code.trim(), p_username:username.trim().toLowerCase()})
    if(error) setError(error.message.replace(/^.*exception /i,'').replace(/^"|"$/g,'')); else onComplete(data)
    setLoading(false)
  }
  return <div className="onboardingShell"><div className="onboardingCard">
    <div className="brand"><div className="brandMark">z</div><span>zovve</span></div>
    <div className="onboardingIcon"><Sparkles size={22}/></div><span className="eyebrow">One last step</span>
    <h1>Tell the family<br/>who you are.</h1>
    <p className="onboardingIntro">Choose your family username and add the details the family calendar needs.</p>
    <form className="onboardingForm" onSubmit={submit}>
      <label>Username<input value={username} onChange={e=>setUsername(e.target.value.toLowerCase())} placeholder="e.g. sarah" required /></label>
      <label>Your name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sarah" required /></label>
      <label>Date of birth<input type="date" value={dob} onChange={e=>setDob(e.target.value)} required /></label>
      <label>Family invitation code<input value={code} onChange={e=>setCode(e.target.value)} placeholder="ZOVVE-FAMILY-2026" required /></label>
      {error && <div className="errorBox">{error}</div>}
      <button className="authSubmit" disabled={loading}>{loading ? <><Loader2 className="spin" size={17}/> Setting up...</> : <>Enter the family <ArrowRight size={17}/></>}</button>
    </form>
    <button className="signOutLink" onClick={()=>supabase.auth.signOut()}>Use a different account</button>
  </div></div>
}
function Dashboard({profile}) {
 const [active,setActive]=useState('Home')
 const [liked,setLiked]=useState({})
 const [posts,setPosts]=useState([])
 const [loadingPosts,setLoadingPosts]=useState(true)
 const nav=[['Home',Home],['Calendar',CalendarDays],['Trips',MapPin],['Family',Users],['Notifications',Bell]]

 useEffect(()=>{
   loadPosts()
 },[profile?.family_id])

 async function loadPosts() {
   if(!profile?.family_id) return
   setLoadingPosts(true)
   const {data,error}=await supabase.from('posts')
     .select('id,body,created_at,author_id,profiles(full_name,avatar_url)')
     .eq('family_id',profile.family_id)
     .order('created_at',{ascending:false})
     .limit(20)
   if(!error && data) setPosts(data)
   setLoadingPosts(false)
 }

 const displayPosts = posts.length ? posts : demoPosts
 const displayName = profile?.full_name?.split(' ')[0] || 'family'
 const initial = profile?.full_name?.[0]?.toUpperCase() || 'Y'

 return <div className="app">
   <aside className="sidebar">
    <div className="brand"><div className="brandMark">z</div><span>zovve</span></div>
    <div className="familyMini"><div><span className="onlineDot"/>The Family</div><span>6</span></div>
    <nav>{nav.map(([label,Icon])=><button key={label} className={active===label?'active':''} onClick={()=>setActive(label)}><Icon size={19}/><span>{label}</span>{label==='Notifications'&&<b>2</b>}</button>)}</nav>
    <div className="sidebarBottom"><button><Settings size={18}/>Settings</button><div className="profileSmall"><Avatar letter={initial} tone="slate"/><div><strong>{profile.full_name}</strong><small>Manage account</small></div><button className="logoutIcon" title="Sign out" onClick={()=>supabase.auth.signOut()}><LogOut size={15}/></button></div></div>
   </aside>
   <main>
    <header className="topbar"><div><p className="eyebrow">{new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}</p><h1>{active==='Home'?`Good morning, ${displayName} 👋`:active}</h1></div><div className="topActions"><button className="iconBtn"><Bell size={20}/><i/></button><button className="newPost" onClick={()=>alert('Post composer is the next feed feature to wire up.')}><Plus size={18}/> New post</button></div></header>
    {active==='Home'?<div className="content">
      <section className="welcomeCard"><div><span className="pill"><Sparkles size={14}/> Family space</span><h2>Life is better<br/>when we’re together.</h2><p>A private place for your family to share the little moments that matter.</p></div><div className="welcomeArt"><div className="sun"/><div className="hill h1"/><div className="hill h2"/><span>✦</span></div></section>
      <section className="quick"><button><Camera/><span><strong>Share a moment</strong><small>Photo, thought or update</small></span><ChevronRight/></button><button><Mic/><span><strong>Send a voice note</strong><small>Say hello to everyone</small></span><ChevronRight/></button></section>
      <div className="grid">
       <section><div className="sectionHead"><div><h3>Family feed</h3><p>What’s happening with everyone</p></div><button className="textBtn">View all <ChevronRight size={16}/></button></div>
       {loadingPosts ? <div className="loadingCard"><Loader2 className="spin" size={20}/> Loading family moments...</div> : displayPosts.map((p,i)=>{
         const isReal=!!p.id
         const name=isReal?(p.profiles?.full_name||'Family member'):p.name
         const letter=(name[0]||'F').toUpperCase()
         return <article className="post" key={p.id||p.name+i}><div className="postHead"><Avatar letter={letter} tone={isReal?'blue':p.tone}/><div><strong>{name}</strong><small>{isReal?new Date(p.created_at).toLocaleString():p.time}</small></div><button className="more"><MoreHorizontal/></button></div><p className="postText">{isReal?p.body:p.text}</p>{p.image&&<img className="postImage" src={p.image} alt="Family moment"/>}<div className="postActions"><button onClick={()=>toggleLike(i)} className={liked[i]?'liked':''}><Heart size={19} fill={liked[i]?'currentColor':'none'}/>{(p.likes||0)+(liked[i]?1:0)}</button><button><MessageCircle size={19}/>{p.comments||0}</button><button><Send size={18}/>Share</button></div></article>
       })}</section>
       <aside className="rightCol"><div className="sectionHead"><div><h3>Coming up</h3><p>Next family moments</p></div></div>
        <div className="upcoming"><div className="dateBox"><b>12</b><small>OCT</small></div><div><strong>Sunday Lunch</strong><p><MapPin size={13}/> Mum’s house · 1:00 PM</p></div></div>
        <div className="upcoming"><div className="dateBox gold"><b>19</b><small>OCT</small></div><div><strong>Dad’s Birthday 🎂</strong><p><Bell size={13}/> Reminder in 1 week</p></div></div>
        <div className="upcoming"><div className="dateBox green"><b>02</b><small>NOV</small></div><div><strong>Family Trip</strong><p><MapPin size={13}/> Jinja · 2 nights</p></div></div>
        <div className="familyCard"><div className="sectionHead"><div><h3>Family</h3><p>Everyone is here</p></div><button className="textBtn">See all</button></div><div className="avatarRow">{familySeed.map((f,i)=><div key={i} className="member"><Avatar letter={f.initials} tone={f.tone}/><span>{f.name}</span><i className="presence"/></div>)}<div className="member"><Avatar letter={initial} tone="slate"/><span>You</span><i className="presence"/></div></div></div>
       </aside>
      </div>
    </div>:<div className="placeholder"><div className="placeholderIcon"><Sparkles/></div><h2>{active}</h2><p>This part of Zovve is being built next. The family feed is the starting point for the real family data.</p><button className="newPost" onClick={()=>setActive('Home')}><Home size={18}/> Back home</button></div>}
   </main>
 </div>
}

export default function App() {
 const [authReady,setAuthReady]=useState(false)
 const [user,setUser]=useState(null)
 const [profile,setProfile]=useState(undefined)

 useEffect(()=>{
   let mounted=true
   supabase.auth.getUser().then(({data})=>{ if(mounted) setUser(data.user||null); setAuthReady(true) })
   const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
     if(mounted) setUser(session?.user||null)
   })
   return ()=>{mounted=false;subscription.unsubscribe()}
 },[])

 useEffect(()=>{
   if(!user){setProfile(undefined);return}
   supabase.from('profiles').select('*').eq('id',user.id).maybeSingle()
     .then(({data})=>setProfile(data||null))
 },[user])

 if(!authReady || (user && profile===undefined)) return <div className="fullLoader"><div className="brand"><div className="brandMark">z</div><span>zovve</span></div><Loader2 className="spin" size={22}/></div>
 if(!user) return <AuthScreen/>
 if(!profile) return <Onboarding user={user} onComplete={setProfile}/>
 return <Dashboard profile={profile}/>
}
