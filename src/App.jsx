import { useEffect, useState } from 'react'
import {
  CalendarDays, Camera, Heart, Home, Image, MapPin, MessageCircle,
  Mic, MoreHorizontal, Plus, Send, Settings, Sparkles, Users, Bell, Pause, X, Trash2
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

function Avatar({letter,tone='blue',size='',src}) {
  return <div className={`avatar ${tone} ${size}`}>{src?<img src={src} alt=""/>:letter}</div>
}

function AuthScreen() {
  const [mode, setMode] = useState('join')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setMessage('')
    const cleanEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setError('Please enter a valid email address.'); setLoading(false); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return }
    const result = mode === 'join'
      ? await supabase.auth.signUp({ email: cleanEmail, password })
      : await supabase.auth.signInWithPassword({ email: cleanEmail, password })
    const { error, data } = result
    if (error) setError(error.message)
    else if (mode === 'join') setMessage(data.session ? 'Account created. Now complete your family profile.' : 'Account created. If you cannot continue, the family login settings need to be enabled in Supabase.')
    else setMessage('Welcome back.')
    setLoading(false)
  }

  return <div className="authShell">
    <div className="authPanel">
      <div className="authHeader" style={{fontSize:12,fontWeight:600,letterSpacing:".15px",color:"#687186",marginBottom:54}}>Zovve Chat by Elgon Team.</div>
      <div className="authHero">
        <span className="pill"><Sparkles size={14}/> Private family space</span>
        <h1>{mode === 'join' ? 'Your family,<br/>all in one place.' : 'Welcome<br/>back home.'}</h1>
        <p>{mode === 'join' ? 'A quiet, private place for the people who matter most.' : 'Sign in to see what everyone is sharing.'}</p>
      </div>
      <form className="authForm" onSubmit={submit}>
        <label>Email address</label>
        <div className="authInput"><UserRound size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></div>
        <label>Password</label>
        <div className="authInput"><LockKeyhole size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode==='join'?'new-password':'current-password'} required /></div>
        <button className="authSubmit" disabled={loading}>{loading ? <><Loader2 className="spin" size={18}/> {mode==='join'?'Creating account...':'Signing in...'}</> : <>{mode === 'join' ? 'Create family account' : 'Sign in'} <ArrowRight size={17}/></>}</button>
        {message && <div className="successBox">{message}</div>}
        {error && <div className="errorBox">{error}</div>}
      </form>
      <div className="authSwitch">{mode === 'join' ? <>Already joined? <button onClick={()=>{setMode('login');setMessage('');setError('')}}>Sign in</button></> : <>New family member? <button onClick={()=>{setMode('join');setMessage('');setError('')}}>Join Zovve</button></>}</div>
      <small className="authPrivacy"><LockKeyhole size={13}/> Invitation-only family access · Email required</small>
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
    <p className="onboardingIntro">Add the details the family calendar needs to get started.</p>
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
 const [active,setActive]=useState('Home'), [posts,setPosts]=useState([]), [profiles,setProfiles]=useState([]), [events,setEvents]=useState([]), [notifications,setNotifications]=useState([]), [loading,setLoading]=useState(true)
 const [composer,setComposer]=useState(''), [imageFile,setImageFile]=useState(null), [posting,setPosting]=useState(false), [quotePost,setQuotePost]=useState(null), [profileForm,setProfileForm]=useState({full_name:profile?.full_name||'',bio:profile?.bio||''}), [avatarFile,setAvatarFile]=useState(null), [profileSaving,setProfileSaving]=useState(false), [commentOpen,setCommentOpen]=useState({}), [commentText,setCommentText]=useState({}), [reactions,setReactions]=useState({})
 const [eventForm,setEventForm]=useState({title:'',event_type:'event',starts_at:'',ends_at:'',location:'',details:'',reminder:'1_day'}), [showEventForm,setShowEventForm]=useState(false), [calendarMonth,setCalendarMonth]=useState(new Date(new Date().getFullYear(),new Date().getMonth(),1))
 const [recording,setRecording]=useState(false), [mediaRecorder,setMediaRecorder]=useState(null), [recordingPaused,setRecordingPaused]=useState(false), [recordingCancelled,setRecordingCancelled]=useState(false)
 const nav=[['Home',Home],['Calendar',CalendarDays],['Trips',MapPin],['Family',Users],['Notifications',Bell],['Profile',UserRound]]
 const displayName=profile?.full_name?.split(' ')[0] || 'family', initial=profile?.full_name?.[0]?.toUpperCase() || 'Y'
 useEffect(()=>{loadAll()},[profile?.family_id])
 async function loadAll(){if(!profile?.family_id)return;setLoading(true);const [p,e,n,f]=await Promise.all([
   supabase.from('posts').select('id,body,created_at,author_id,profiles(full_name,avatar_url)').eq('family_id',profile.family_id).order('created_at',{ascending:false}).limit(50),
   supabase.from('events').select('*').eq('family_id',profile.family_id).order('starts_at',{ascending:true}),
   supabase.from('notifications').select('*').eq('user_id',profile.id).order('created_at',{ascending:false}).limit(30),
   supabase.from('profiles').select('*').eq('family_id',profile.family_id).order('full_name')])
   if(!p.error)setPosts(p.data||[]);if(!e.error)setEvents(e.data||[]);if(!n.error)setNotifications(n.data||[]);if(!f.error)setProfiles(f.data||[]);setLoading(false)}
 async function optimizeImage(file){if(!file)return file;if(!file.type.startsWith('image/'))return file;const bitmap=await createImageBitmap(file);const max=2200,scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);const type=file.type==='image/png'?'image/png':'image/webp';const blob=await new Promise(resolve=>canvas.toBlob(resolve,type,type==='image/png'?undefined:.9));return blob||file}
 async function createPost(){if(!composer.trim()&&!imageFile&&!quotePost)return;setPosting(true);const {data,error}=await supabase.from('posts').insert({family_id:profile.family_id,author_id:profile.id,body:composer.trim()||null,quoted_post_id:quotePost?.id||null}).select('id,body,created_at,author_id,profiles(full_name,avatar_url)').single();if(error){alert(error.message);setPosting(false);return}if(imageFile){const optimized=await optimizeImage(imageFile),ext=optimized.type==='image/png'?'png':'webp',path=profile.family_id+'/'+data.id+'/'+crypto.randomUUID()+'.'+ext;const u=await supabase.storage.from('post-media').upload(path,optimized,{contentType:optimized.type,upsert:false});if(!u.error)await supabase.from('post_media').insert({post_id:data.id,media_type:'image',storage_path:path});else alert(u.error.message)}setPosts(p=>[data,...p]);setComposer('');setImageFile(null);setQuotePost(null);setPosting(false)}
 async function toggleReaction(postId){const key=postId+':like';if(reactions[key]){await supabase.from('reactions').delete().eq('post_id',postId).eq('user_id',profile.id).eq('reaction','like');setReactions(r=>({...r,[key]:false}))}else{await supabase.from('reactions').insert({post_id:postId,user_id:profile.id,reaction:'like'});setReactions(r=>({...r,[key]:true}))}}
 async function addComment(postId){const body=(commentText[postId]||'').trim();if(!body)return;const {error}=await supabase.from('comments').insert({post_id:postId,author_id:profile.id,body});if(error)alert(error.message);else setCommentText(x=>({...x,[postId]:''}))}
 async function createEvent(e){e.preventDefault();if(!eventForm.title||!eventForm.starts_at)return;const {data,error}=await supabase.from('events').insert({family_id:profile.family_id,created_by:profile.id,title:eventForm.title.trim(),event_type:eventForm.event_type,starts_at:new Date(eventForm.starts_at).toISOString(),ends_at:eventForm.ends_at?new Date(eventForm.ends_at).toISOString():null,location:eventForm.location.trim()||null,details:eventForm.details.trim()||null,reminder:eventForm.reminder}).select('*').single();if(error)alert(error.message);else{setEvents(x=>[...x,data].sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at)));setShowEventForm(false);setEventForm({title:'',event_type:'event',starts_at:'',ends_at:'',location:'',details:'',reminder:'1_day'});setActive('Calendar')}}
 async function markAllRead(){await supabase.from('notifications').update({read_at:new Date().toISOString()}).eq('user_id',profile.id).is('read_at',null);setNotifications(n=>n.map(x=>({...x,read_at:x.read_at||new Date().toISOString()})))}
 async function startRecording(){if(!navigator.mediaDevices?.getUserMedia){alert('Voice recording is not supported in this browser.');return}setRecordingCancelled(false);setRecordingPaused(false);const stream=await navigator.mediaDevices.getUserMedia({audio:true}),recorder=new MediaRecorder(stream),chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());if(recordingCancelled)return;const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'}),path=profile.family_id+'/'+crypto.randomUUID()+'.webm';const u=await supabase.storage.from('voice-messages').upload(path,blob,{contentType:blob.type,upsert:false});if(u.error){alert(u.error.message);return}const {data:post,error}=await supabase.from('posts').insert({family_id:profile.family_id,author_id:profile.id,body:'🎙️ Voice note'}).select('id').single();if(error){await supabase.storage.from('voice-messages').remove([path]);alert(error.message);return}await supabase.from('post_media').insert({post_id:post.id,media_type:'audio',storage_path:path});await loadAll()};recorder.start();setMediaRecorder(recorder);setRecording(true);setRecordingPaused(false)}
 function toggleRecordingPause(){if(!mediaRecorder)return;if(recordingPaused){mediaRecorder.resume();setRecordingPaused(false)}else{mediaRecorder.pause();setRecordingPaused(true)}}
 function stopRecording(){if(mediaRecorder){setRecordingCancelled(false);mediaRecorder.stop();setMediaRecorder(null);setRecording(false);setRecordingPaused(false)}}
 function cancelRecording(){if(mediaRecorder){setRecordingCancelled(true);mediaRecorder.stop();setMediaRecorder(null)}setRecording(false);setRecordingPaused(false)}
 async function saveProfile(e){e.preventDefault();setProfileSaving(true);let avatar_url=profile.avatar_url;if(avatarFile){const ext=(avatarFile.name.split('.').pop()||'jpg').toLowerCase(),path=profile.family_id+'/'+profile.id+'/'+crypto.randomUUID()+'.'+ext;const u=await supabase.storage.from('avatars').upload(path,avatarFile,{contentType:avatarFile.type,upsert:false});if(u.error){alert(u.error.message);setProfileSaving(false);return}avatar_url=path}const {data,error}=await supabase.from('profiles').update({full_name:profileForm.full_name.trim(),bio:profileForm.bio.trim()||null,avatar_url}).eq('id',profile.id).select('*').single();if(error)alert(error.message);else setProfile(data);setProfileSaving(false)}
 async function deletePost(post){if(post.author_id!==profile.id)return;if(!window.confirm('Delete this post? This cannot be undone.'))return;const {error}=await supabase.from('posts').delete().eq('id',post.id).eq('author_id',profile.id);if(error){alert(error.message);return}setPosts(x=>x.filter(p=>p.id!==post.id))}
 const formatDate=v=>new Date(v).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}), avatarFor=n=>(n?.[0]||'F').toUpperCase()
 const birthdays=profiles.filter(p=>p.date_of_birth).map(p=>{const d=new Date(p.date_of_birth+'T00:00:00'),next=new Date(new Date().getFullYear(),d.getMonth(),d.getDate());if(next<new Date(new Date().setHours(0,0,0,0)))next.setFullYear(next.getFullYear()+1);return {...p,next}}).sort((a,b)=>a.next-b.next)
 const upcoming=events.filter(e=>new Date(e.starts_at)>=new Date()).slice(0,5), monthEvents=events.filter(e=>{const d=new Date(e.starts_at);return d.getFullYear()===calendarMonth.getFullYear()&&d.getMonth()===calendarMonth.getMonth()}), monthBirthdays=birthdays.filter(p=>p.next.getFullYear()===calendarMonth.getFullYear()&&p.next.getMonth()===calendarMonth.getMonth())
 const renderComposer=()=> <div className="composer"><div className="composerRow"><Avatar letter={initial} tone="slate"/><textarea id="composer" value={composer} onChange={e=>setComposer(e.target.value)} placeholder="Share something with the family..."/></div>{quotePost&&<div className="quoteComposer"><div><strong>Replying to {quotePost.profiles?.full_name||'family member'}</strong><p>{quotePost.body||'Media post'}</p></div><button onClick={()=>setQuotePost(null)}><X size={15}/></button></div>}{imageFile&&<div className="fileChip"><Image size={15}/>{imageFile.name}<button onClick={()=>setImageFile(null)}>×</button></div>}<div className="composerActions"><label className="composerAction"><Image size={18}/> Photo<input id="post-image-input" type="file" accept="image/*" hidden onChange={e=>setImageFile(e.target.files?.[0]||null)}/></label>{recording?<><button className="composerAction" onClick={toggleRecordingPause}>{recordingPaused?<Mic size={17}/>:<Pause size={17}/>} {recordingPaused?'Resume':'Pause'}</button><button className="composerAction recordingCancel" onClick={cancelRecording}><X size={17}/> Cancel</button><button className="composerAction recordingStop" onClick={stopRecording}><Send size={17}/> Post voice note</button></>:<button className="composerAction" onClick={startRecording}><Mic size={18}/> Voice note</button>}<button className="authSubmit composerSend" disabled={posting||recording||(!composer.trim()&&!imageFile)} onClick={createPost}>{posting?<Loader2 className="spin" size={16}/>:<><Send size={16}/> Post</>}</button></div></div>
 function PostCard({p}){const [media,setMedia]=useState([]),[comments,setComments]=useState([]),[quoted,setQuoted]=useState(null);useEffect(()=>{supabase.from('post_media').select('*').eq('post_id',p.id).then(async({data})=>{const items=[];for(const m of data||[]){const {data:u}=await supabase.storage.from(m.media_type==='audio'?'voice-messages':'post-media').createSignedUrl(m.storage_path,3600);items.push({...m,url:u?.signedUrl})}setMedia(items)});supabase.from('comments').select('id,body,created_at,profiles(full_name)').eq('post_id',p.id).order('created_at').then(({data})=>setComments(data||[]))if(p.quoted_post_id)supabase.from('posts').select('id,body,profiles(full_name)').eq('id',p.quoted_post_id).maybeSingle().then(({data})=>setQuoted(data));},[p.id]);return <article className="post"><div className="postHead"><Avatar letter={avatarFor(p.profiles?.full_name)} tone="blue"/><div><strong>{p.profiles?.full_name||'Family member'}</strong><small>{formatDate(p.created_at)}</small></div><div className="more">{p.author_id===profile.id?<button className="postDelete" title="Delete post" onClick={()=>deletePost(p)}><Trash2 size={16}/></button>:<MoreHorizontal/>}</div></div>{p.body&&<p className="postText">{p.body}</p>}{quoted&&<div className="quotedPost"><small>Quoted from {quoted.profiles?.full_name||'family member'}</small><p>{quoted.body||'Media post'}</p></div>}{media.map(m=>m.media_type==='image'?<img key={m.id} className="postImage" src={m.url} alt="Family moment"/>:<audio key={m.id} controls className="postAudio" src={m.url}/>)}<div className="postActions"><button onClick={()=>{setQuotePost(p);setActive('Home');setTimeout(()=>document.getElementById('composer')?.focus(),50)}}><MessageCircle size={19}/>Quote</button><button onClick={()=>toggleReaction(p.id)} className={reactions[p.id+':like']?'liked':''}><Heart size={19} fill={reactions[p.id+':like']?'currentColor':'none'}/>Like</button><button onClick={()=>setCommentOpen(x=>({...x,[p.id]:!x[p.id]}))}><MessageCircle size={19}/>{comments.length} Comments</button></div>{commentOpen[p.id]&&<div className="comments">{comments.map(c=><div className="comment" key={c.id}><Avatar letter={avatarFor(c.profiles?.full_name)} tone="slate"/><div><strong>{c.profiles?.full_name||'Family member'}</strong><p>{c.body}</p></div></div>)}<div className="commentInput"><input value={commentText[p.id]||''} onChange={e=>setCommentText(x=>({...x,[p.id]:e.target.value}))} placeholder="Write a reply..."/><button onClick={()=>addComment(p.id)}><Send size={16}/></button></div></div>}</article>}
 const renderHome=()=> <div className="content"><section className="welcomeCard"><div><span className="pill"><Sparkles size={14}/> Family space</span><h2>Life is better<br/>when we’re together.</h2><p>A private place for your family to share the little moments that matter.</p></div><div className="welcomeArt"><div className="sun"/><div className="hill h1"/><div className="hill h2"/><span>✦</span></div></section>{renderComposer()}<div className="grid"><section><div className="sectionHead"><div><h3>Family feed</h3><p>What’s happening with everyone</p></div></div>{loading?<div className="loadingCard"><Loader2 className="spin" size={20}/> Loading family moments...</div>:posts.length===0?<div className="emptyCard"><Sparkles/><h3>Your family feed starts here</h3><p>Share the first photo, thought or voice note.</p></div>:posts.map(p=><PostCard key={p.id} p={p}/>)}</section><aside className="rightCol"><div className="sectionHead"><div><h3>Coming up</h3><p>Next family moments</p></div><button className="textBtn" onClick={()=>setActive('Calendar')}>Calendar <ChevronRight size={16}/></button></div>{upcoming.map(e=><div className="upcoming" key={e.id}><div className="dateBox"><b>{new Date(e.starts_at).getDate()}</b><small>{new Date(e.starts_at).toLocaleString(undefined,{month:'short'}).toUpperCase()}</small></div><div><strong>{e.title}</strong><p><MapPin size={13}/>{e.location||formatDate(e.starts_at)}</p></div></div>)}{birthdays.slice(0,2).map(p=><div className="upcoming" key={'b'+p.id}><div className="dateBox gold"><b>{p.next.getDate()}</b><small>{p.next.toLocaleString(undefined,{month:'short'}).toUpperCase()}</small></div><div><strong>{p.full_name}'s Birthday 🎂</strong><p><Bell size={13}/> Every year</p></div></div>)}<div className="familyCard"><div className="sectionHead"><div><h3>Family</h3><p>{profiles.length} member{profiles.length===1?'':'s'} joined</p></div><button className="textBtn" onClick={()=>setActive('Family')}>See all</button></div><div className="avatarRow">{profiles.map(p=><div key={p.id} className="member"><Avatar letter={avatarFor(p.full_name)} tone="blue"/><span>{p.full_name?.split(' ')[0]}</span><i className="presence"/></div>)}</div></div></aside></div></div>
 const renderCalendar=()=> <div className="content"><div className="pageTitle"><div><span className="eyebrow">Family calendar</span><h2>All the moments that matter.</h2><p>Birthdays, events and trips in one place.</p></div><button className="newPost" onClick={()=>setShowEventForm(true)}><Plus size={18}/> Add event</button></div>{showEventForm&&<form className="eventForm" onSubmit={createEvent}><div className="eventFormHead"><h3>Create family event</h3><button type="button" onClick={()=>setShowEventForm(false)}>×</button></div><div className="formGrid"><label>Title<input required value={eventForm.title} onChange={e=>setEventForm(x=>({...x,title:e.target.value}))}/></label><label>Type<select value={eventForm.event_type} onChange={e=>setEventForm(x=>({...x,event_type:e.target.value}))}><option value="event">Family event</option><option value="trip">Family trip</option></select></label><label>Starts<input required type="datetime-local" value={eventForm.starts_at} onChange={e=>setEventForm(x=>({...x,starts_at:e.target.value}))}/></label><label>Ends<input type="datetime-local" value={eventForm.ends_at} onChange={e=>setEventForm(x=>({...x,ends_at:e.target.value}))}/></label><label>Location<input value={eventForm.location} onChange={e=>setEventForm(x=>({...x,location:e.target.value}))}/></label><label>Reminder<select value={eventForm.reminder} onChange={e=>setEventForm(x=>({...x,reminder:e.target.value}))}><option value="none">No reminder</option><option value="1_day">1 day before</option><option value="3_days">3 days before</option><option value="1_week">1 week before</option></select></label></div><label>Details<textarea value={eventForm.details} onChange={e=>setEventForm(x=>({...x,details:e.target.value}))}/></label><button className="authSubmit" type="submit">Create event</button></form>}<div className="calendarPanel"><div className="calendarNav"><button onClick={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1))}>‹</button><h3>{calendarMonth.toLocaleString(undefined,{month:'long',year:'numeric'})}</h3><button onClick={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1))}>›</button></div><div className="calendarGrid">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><b key={d}>{d}</b>)}{Array.from({length:new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1).getDay()}).map((_,i)=><div key={'e'+i}/>)}{Array.from({length:new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,0).getDate()}).map((_,i)=>{const day=i+1,ev=monthEvents.filter(e=>new Date(e.starts_at).getDate()===day),bd=monthBirthdays.filter(p=>p.next.getDate()===day);return <div className="calendarDay" key={day}><span>{day}</span>{bd.map(p=><small className="birthdayDot" key={p.id}>🎂 {p.full_name?.split(' ')[0]}</small>)}{ev.map(e=><small className={e.event_type==='trip'?'tripDot':'eventDot'} key={e.id}>{e.title}</small>)}</div>})}</div></div><div className="eventList"><h3>Upcoming</h3>{[...upcoming,...birthdays.slice(0,3)].map(x=>x.starts_at?<div className="listEvent" key={x.id}><strong>{x.title}</strong><span>{formatDate(x.starts_at)} {x.location?'· '+x.location:''}</span></div>:<div className="listEvent" key={'b'+x.id}><strong>🎂 {x.full_name}'s Birthday</strong><span>{x.next.toLocaleDateString()}</span></div>)}</div></div>
 const renderTrips=()=> <div className="content"><div className="pageTitle"><div><span className="eyebrow">Family travel</span><h2>Trips we’ll remember.</h2><p>Plan family getaways and keep the memories together.</p></div><button className="newPost" onClick={()=>{setEventForm(x=>({...x,event_type:'trip'}));setShowEventForm(true);setActive('Calendar')}}><Plus size={18}/> Plan a trip</button></div><div className="tripGrid">{events.filter(e=>e.event_type==='trip').map(t=><article className="tripCard" key={t.id}><div className="tripIcon"><MapPin/></div><span className="eyebrow">Family trip</span><h3>{t.title}</h3><p>{formatDate(t.starts_at)}{t.ends_at?' – '+new Date(t.ends_at).toLocaleDateString():''}</p><p>{t.location||'Destination to be added'}</p><small>{t.details||'No trip details yet.'}</small></article>)}{events.filter(e=>e.event_type==='trip').length===0&&<div className="emptyCard"><MapPin/><h3>No trips planned yet</h3><p>Create a trip and the family can start planning it here.</p><button className="newPost" onClick={()=>{setEventForm(x=>({...x,event_type:'trip'}));setShowEventForm(true);setActive('Calendar')}}>Plan first trip</button></div>}</div></div>
 const renderProfile=()=> <div className="content"><div className="pageTitle"><div><span className="eyebrow">Your profile</span><h2>About you.</h2><p>Change how the family sees you.</p></div></div><form className="profileEditor" onSubmit={saveProfile}><div className="profileAvatarEdit"><Avatar letter={avatarFor(profileForm.full_name)} tone="blue" size="large"/><label className="composerAction"><Image size={16}/> Change photo<input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e=>setAvatarFile(e.target.files?.[0]||null)}/></label></div><label>Display name<input value={profileForm.full_name} onChange={e=>setProfileForm(x=>({...x,full_name:e.target.value}))} required/></label><label>Username<input value={profile.username||''} disabled/></label><label>Bio<textarea value={profileForm.bio} onChange={e=>setProfileForm(x=>({...x,bio:e.target.value}))} maxLength={160} placeholder="A little about you..."/></label><button className="authSubmit" disabled={profileSaving}>{profileSaving?<><Loader2 className="spin" size={16}/> Saving...</>:<>Save profile</>}</button></form></div>
 const renderFamily=()=> <div className="content"><div className="pageTitle"><div><span className="eyebrow">Our people</span><h2>The family.</h2><p>Everyone who has joined your private family space.</p></div></div><div className="familyGrid">{profiles.map(p=><article className="familyMemberCard" key={p.id}><Avatar letter={avatarFor(p.full_name)} tone="blue" size="large"/><h3>{p.full_name}</h3><p>@{p.username||'family-member'}</p>{p.date_of_birth&&<small>Birthday · {new Date(p.date_of_birth+'T00:00:00').toLocaleDateString(undefined,{month:'long',day:'numeric'})}</small>}</article>)}</div></div>
 const renderNotifications=()=> <div className="content"><div className="pageTitle"><div><span className="eyebrow">Stay in the loop</span><h2>Notifications.</h2><p>Comments, reactions, birthdays and family reminders.</p></div><button className="textBtn" onClick={markAllRead}>Mark all read</button></div><div className="notificationList">{notifications.length?notifications.map(n=><div className={'notification '+(!n.read_at?'unread':'')} key={n.id}><div className="notificationIcon"><Bell size={17}/></div><div><strong>{n.title}</strong><p>{n.body}</p><small>{formatDate(n.created_at)}</small></div></div>):<div className="emptyCard"><Bell/><h3>You're all caught up</h3><p>New family activity will appear here.</p></div>}</div></div>
 return <div className="app"><aside className="sidebar"><div className="brand"><div className="brandMark">E</div><span>Elgon Team</span></div><div className="familyMini"><div><span className="onlineDot"/>Elgon Team</div><span>{profiles.length||6}</span></div><nav>{nav.map(([label,Icon])=><button key={label} className={active===label?'active':''} onClick={()=>setActive(label)}><Icon size={19}/><span>{label}</span>{label==='Notifications'&&notifications.filter(n=>!n.read_at).length>0&&<b>{notifications.filter(n=>!n.read_at).length}</b>}</button>)}</nav><div className="sidebarBottom"><button onClick={()=>setActive("Profile")}><UserRound size={18}/>Profile</button><div className="profileSmall"><Avatar letter={initial} tone="slate"/><div><strong>{profile.full_name}</strong><small>Manage account</small></div><button className="logoutIcon" title="Sign out" onClick={()=>supabase.auth.signOut()}><LogOut size={15}/></button></div></div></aside><main><header className="topbar"><div><p className="eyebrow">{new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}</p><h1>{active==='Home'?'Good morning, '+displayName+' 👋':active}</h1></div><div className="topActions"><button className="iconBtn" onClick={()=>setActive('Notifications')}><Bell size={20}/>{notifications.some(n=>!n.read_at)&&<i/>}</button><button className="newPost" onClick={()=>setActive('Home')}><Plus size={18}/> New post</button></div></header>{active==='Home'?renderHome():active==='Calendar'?renderCalendar():active==='Trips'?renderTrips():active==='Family'?renderFamily():active==='Profile'?renderProfile():renderNotifications()}</main></div>
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
