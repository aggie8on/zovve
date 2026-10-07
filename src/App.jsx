import { useState } from 'react'
import { CalendarDays, Camera, Heart, Home, Image, MapPin, MessageCircle, Mic, MoreHorizontal, Plus, Send, Settings, Sparkles, Users, Bell, ChevronRight } from 'lucide-react'
import { supabase } from './lib/supabaseClient'

const family = [
  {name:'Mum', initials:'M', tone:'rose', status:'At home'},
  {name:'Dad', initials:'D', tone:'blue', status:'Working'},
  {name:'Sarah', initials:'S', tone:'gold', status:'At university'},
  {name:'Daniel', initials:'D', tone:'green', status:'Travelling'},
  {name:'Grace', initials:'G', tone:'violet', status:'At home'},
  {name:'You', initials:'Y', tone:'slate', status:'Online'}
]

const posts = [
 {name:'Mum', time:'12 min ago', avatar:'M', tone:'rose', text:'Sunday lunch at ours this weekend ❤️ Everyone is welcome. I’ll share the menu later!', image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', likes:5, comments:3},
 {name:'Daniel', time:'Yesterday', avatar:'D', tone:'green', text:'Made it to the lake! The view is beautiful. Wish you were all here 🌿', image:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80', likes:8, comments:4}
]

function Avatar({letter,tone='blue',size=''}){ return <div className={`avatar ${tone} ${size}`}>{letter}</div> }

export default function App(){
 const [active,setActive]=useState('Home')
 const [liked,setLiked]=useState({})
 const nav=[['Home',Home],['Calendar',CalendarDays],['Trips',MapPin],['Family',Users],['Notifications',Bell]]
 const toggleLike=i=>setLiked(v=>({...v,[i]:!v[i]}))
 const testConnection=async()=>{ const {error}=await supabase.from('profiles').select('id').limit(1); if(error) alert('Zovve is not connected to the database yet. We’ll finish the database setup next.'); else alert('Supabase connection is working!') }
 return <div className="app">
   <aside className="sidebar">
    <div className="brand"><div className="brandMark">z</div><span>zovve</span></div>
    <div className="familyMini"><div><span className="onlineDot"/>The Family</div><span>6</span></div>
    <nav>{nav.map(([label,Icon])=><button key={label} className={active===label?'active':''} onClick={()=>setActive(label)}><Icon size={19}/><span>{label}</span>{label==='Notifications'&&<b>2</b>}</button>)}</nav>
    <div className="sidebarBottom"><button><Settings size={18}/>Settings</button><div className="profileSmall"><Avatar letter="Y" tone="slate"/><div><strong>Your profile</strong><small>Manage account</small></div></div></div>
   </aside>
   <main>
    <header className="topbar"><div><p className="eyebrow">Wednesday, October 7</p><h1>{active==='Home'?'Good morning, family 👋':active}</h1></div><div className="topActions"><button className="iconBtn"><Bell size={20}/><i/></button><button className="newPost" onClick={()=>alert('Post composer coming next')}> <Plus size={18}/> New post</button></div></header>
    {active==='Home'?<div className="content">
      <section className="welcomeCard"><div><span className="pill"><Sparkles size={14}/> Family space</span><h2>Life is better<br/>when we’re together.</h2><p>A private place for your family to share the little moments that matter.</p></div><div className="welcomeArt"><div className="sun"/><div className="hill h1"/><div className="hill h2"/><span>✦</span></div></section>
      <section className="quick"><button><Camera/><span><strong>Share a moment</strong><small>Photo, thought or update</small></span><ChevronRight/></button><button><Mic/><span><strong>Send a voice note</strong><small>Say hello to everyone</small></span><ChevronRight/></button></section>
      <div className="grid">
       <section><div className="sectionHead"><div><h3>Family feed</h3><p>What’s happening with everyone</p></div><button className="textBtn">View all <ChevronRight size={16}/></button></div>
       {posts.map((p,i)=><article className="post" key={p.name+i}><div className="postHead"><Avatar letter={p.avatar} tone={p.tone}/><div><strong>{p.name}</strong><small>{p.time}</small></div><button className="more"><MoreHorizontal/></button></div><p className="postText">{p.text}</p><img className="postImage" src={p.image}/><div className="postActions"><button onClick={()=>toggleLike(i)} className={liked[i]?'liked':''}><Heart size={19} fill={liked[i]?'currentColor':'none'}/>{p.likes+(liked[i]?1:0)}</button><button><MessageCircle size={19}/>{p.comments}</button><button><Send size={18}/>Share</button></div></article>)}</section>
       <aside className="rightCol"><div className="sectionHead"><div><h3>Coming up</h3><p>Next family moments</p></div></div>
        <div className="upcoming"><div className="dateBox"><b>12</b><small>OCT</small></div><div><strong>Sunday Lunch</strong><p><MapPin size={13}/> Mum’s house · 1:00 PM</p></div></div>
        <div className="upcoming"><div className="dateBox gold"><b>19</b><small>OCT</small></div><div><strong>Dad’s Birthday 🎂</strong><p><Bell size={13}/> Reminder in 1 week</p></div></div>
        <div className="upcoming"><div className="dateBox green"><b>02</b><small>NOV</small></div><div><strong>Family Trip</strong><p><MapPin size={13}/> Jinja · 2 nights</p></div></div>
        <div className="familyCard"><div className="sectionHead"><div><h3>Family</h3><p>Everyone is here</p></div><button className="textBtn">See all</button></div><div className="avatarRow">{family.map((f,i)=><div key={i} className="member"><Avatar letter={f.initials} tone={f.tone}/><span>{f.name}</span><i className="presence"/></div>)}</div></div>
       </aside>
      </div>
    </div>:<div className="placeholder"><div className="placeholderIcon"><Sparkles/></div><h2>{active}</h2><p>This part of Zovve is being built next. The family feed is ready as the starting point.</p><button className="newPost" onClick={()=>setActive('Home')}><Home size={18}/> Back home</button></div>}
   </main>
 </div>
}