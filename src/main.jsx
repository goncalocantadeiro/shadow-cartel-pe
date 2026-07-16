import React, {useMemo, useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Search, RotateCcw, Plus, Trash2, Save, X, Cloud, CloudOff, LockKeyhole, User, LogOut, ArrowLeft, Calculator, Network, ShoppingBag, BriefcaseBusiness, Coins, Sparkles, Eye } from 'lucide-react';
import './style.css';

const initialMaterials = {
  'Alumínio': 3, 'Aço': 2, 'BP Watering Can': 4, 'Bateria Pequena': 4, 'Borracha': 2,
  'Carbonato Sódio': 4, 'Carvão': 20, 'Cobre': 8, 'Cola': 2, 'Couro': 20, 'Enxofre': 6,
  'Ferro': 5, "Garrafa d'água": 4, 'Kit Eletrónico': 250, 'Tábuas de Madeira': 10,
  'Permanganato Potássio': 4, 'Plástico': 10, 'Pólvora': 4, 'Sucata de metal': 3, 'Vidro': 2,
  'Ácido de Bateria': 6, '2-Trapos': 10, 'Chumbo': 0, 'Nefrit': 0, 'Quartz': 0, 'Estanho': 0,
  'Prata': 0, 'Thermite': 0, 'Phone': 0, 'Aluminio em Pó': 0, 'Gazua 2 pinos': 0, 'Gazua Avançada': 0
};

const initialTables = [
 {name:'Mesa Normal', tag:'GERAL', color:'#00f0a8', crafts:[
  {name:'Skate', output:1, ingredients:[['Plástico',4],['Borracha',8],['Tábuas de Madeira',6]]},
  {name:'Lata de Tinta', output:1, ingredients:[['Alumínio',15],['Borracha',15],['Sucata de metal',10],['Plástico',1],['Ácido de Bateria',1],['Cola',1]]},
  {name:'Mesa de Xadrez', output:1, ingredients:[['Plástico',10],['Borracha',10],['Tábuas de Madeira',5]]},
  {name:'GAZUA', output:1, ingredients:[['Sucata de metal',10],['Plástico',4]]},
  {name:'Head Bag', output:1, ingredients:[['Couro',6]]},
  {name:'Mesa de Damas', output:1, ingredients:[['Borracha',10],['Tábuas de Madeira',8],['Plástico',6]]},
  {name:'Chave de Fendas', output:1, ingredients:[['Aço',8],['Plástico',5],['Borracha',3]]},
  {name:'Quadro Branco', output:1, ingredients:[['Borracha',50],['Sucata de metal',30],['Plástico',15]]},
  {name:'Algemas', output:1, ingredients:[['Alumínio',22],['Sucata de metal',12],['Ferro',10]]},
  {name:'Bola de Basket', output:1, ingredients:[['Borracha',100],['Couro',12]]},
  {name:'Maçarico', output:1, ingredients:[['Carvão',15],['Sucata de metal',5],['Aço',2]]},
  {name:'Tabela de Basket', output:1, ingredients:[['Vidro',100],['Sucata de metal',40],['Plástico',40],['Aço',25]]},
  {name:'Alicate', output:1, ingredients:[['Sucata de metal',15],['Borracha',2]]},
  {name:'Caixa de Ferramentas', output:1, ingredients:[['Borracha',20],['Sucata de metal',10],['Aço',8],['Plástico',6]]},
  {name:'Pá', output:1, ingredients:[['Sucata de metal',10],['Aço',3],['Tábuas de Madeira',3],['Plástico',2]]},
  {name:'Ligadura', output:1, ingredients:[['Borracha',20],['2-Trapos',15]]},
  {name:'Marreta', output:1, ingredients:[['Borracha',5],['Aço',5],['Sucata de metal',3],['Plástico',3]]},
  {name:'Mochila', output:1, ingredients:[['2-Trapos',25],['Couro',15],['Plástico',5]]},
  {name:'Cortador de Vidro', output:1, ingredients:[['Sucata de metal',30],['Aço',5],['Plástico',3]]},
  {name:'Pólvora', output:1, ingredients:[['Carvão',1],['Enxofre',1]]},
  {name:'Piano', output:1, ingredients:[['Ferro',3],['Plástico',2],['Borracha',2],['Bateria Pequena',1],['Kit Eletrónico',1]]},
  {name:'Mala de Roupa', output:1, ingredients:[['Couro',10],['Plástico',8]]},
  {name:'Trapos', output:2, ingredients:[['Couro',1]]},
  {name:'Máscara de Gás', output:1, ingredients:[['Vidro',30],['Borracha',30],['Plástico',30],['Aço',5],['Couro',4]]},
  {name:'Colete Leve', output:1, ingredients:[['2-Trapos',60],['Borracha',35],['Alumínio',25],['Plástico',5],['Couro',5]]},
  {name:'Placa para Colete', output:1, ingredients:[['Aço',50],['Borracha',20],['Sucata de metal',10]]},
  {name:'Jaula', output:1, ingredients:[['Aço',185],['Alumínio',95],['Borracha',70],['Ferro',40],['Tábuas de Madeira',25]]},
  {name:'Bateria Pequena', output:1, ingredients:[['Borracha',6],['Aço',2],['Ácido de Bateria',2]]},
  {name:'Colete Médio', output:1, ingredients:[['2-Trapos',115],['Borracha',65],['Alumínio',45],['Plástico',8],['Couro',8]]},
  {name:'Óxido de Ferro', output:1, ingredients:[['Vidro',50],['Ferro',50]]},
  {name:'Pó de Alumínio', output:1, ingredients:[['Alumínio',50],['Vidro',50]]}
 ]},
 {name:'Mesa de Armas', tag:'ARMAS', color:'#ff405f', crafts:[
  {name:'Pistol Ammo', output:1, ingredients:[]}, {name:'SMG Ammo', output:1, ingredients:[]},
  {name:'Rifle Ammo', output:1, ingredients:[['Alumínio',5],['Cobre',2],['Sucata de metal',6],['Aço',1],['Pólvora',1]]},
  {name:'Sniper Ammo', output:1, ingredients:[]}
 ]},
 {name:'Mesa de Eletrónica', tag:'ELETRÓNICA', color:'#ffd34d', crafts:[
  {name:'Dispositivo de Testes', output:1, ingredients:[['Alumínio',12],['Cobre',10],['Kit Eletrónico',3],['Sucata de metal',6],['Plástico',6]]},
  {name:'Decibelímetro', output:1, ingredients:[['Alumínio',30],['Vidro',5],['Plástico',10],['Borracha',10],['Sucata de metal',15],['Bateria Pequena',1],['Kit Eletrónico',2]]},
  {name:'Kit Eletrónico', output:1, ingredients:[['Alumínio',15],['Cobre',25],['Vidro',10],['Plástico',15]]},
  {name:'Circuito Jammer', output:1, ingredients:[['Kit Eletrónico',1],['Chumbo',1],['Nefrit',10],['Quartz',5],['Estanho',15]]},
  {name:'Voltage Glitcher', output:1, ingredients:[['Cobre',25],['Ferro',2],['Kit Eletrónico',2],['Quartz',5]]},
  {name:'Homemade Explosive Device', output:1, ingredients:[['Aluminio em Pó',1],['Phone',1],['Cobre',5],['Kit Eletrónico',1],['Borracha',5]]},
  {name:'Thermite Bomb', output:1, ingredients:[['Kit Eletrónico',3],['Vidro',40],['Pólvora',10],['Ferro',5],['Chumbo',5],['Plástico',10],['Prata',5],['Thermite',5]]}
 ]},
 {name:'Mesa das Gazuas', tag:'GAZUAS', color:'#bd7bff', crafts:[
  {name:'Gazua de 2 Pinos', output:1, ingredients:[['Gazua Avançada',2],['Cobre',10],['Ferro',8]]},
  {name:'Gazua de 3 Pinos', output:1, ingredients:[['Alumínio',20],['Sucata de metal',20],['Gazua 2 pinos',2]]}
 ]}
];


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;


const USERS = {
  admin: { password: 'shadowAdmin123', role: 'admin', label: 'Administrador' },
  associate: { password: 'shadow123', role: 'associate', label: 'Associado' }
};

const MENU_ITEMS = [
  {id:'slot-1', title:'', description:'', icon:null, color:'#00f0a8', enabled:false},
  {id:'slot-2', title:'', description:'', icon:null, color:'#ff405f', enabled:false},
  {id:'pricing', title:'Sistema de Preçário', description:'Custos, receitas, materiais e preços de venda.', icon:Calculator, color:'#00d9ff', enabled:true},
  {id:'slot-4', title:'', description:'', icon:null, color:'#ffb338', enabled:false},
  {id:'slot-5', title:'', description:'', icon:null, color:'#bd7bff', enabled:false},
  {id:'slot-6', title:'', description:'', icon:null, color:'#00e7d7', enabled:false}
];

function LoginScreen({onLogin}){
 const [username,setUsername]=useState('');
 const [password,setPassword]=useState('');
 const [error,setError]=useState('');
 const submit=e=>{
   e.preventDefault();
   const key=username.trim().toLowerCase();
   const match=USERS[key];
   if(!match || match.password!==password){ setError('Utilizador ou palavra-passe incorretos.'); return; }
   onLogin({username:key, role:match.role, label:match.label});
 };
 return <div className="gatePage"><div className="loginShell">
   <div className="brandOrb"><LockKeyhole size={30}/></div>
   <p className="kicker">Acesso reservado</p><h1>Shadow Cartel</h1><p className="loginSub">Identifica-te para entrar no sistema.</p>
   <form className="loginForm" onSubmit={submit}>
    <label><span>Utilizador</span><div><User size={17}/><input autoFocus autoComplete="username" value={username} onChange={e=>{setUsername(e.target.value);setError('')}} placeholder="Utilizador"/></div></label>
    <label><span>Palavra-passe</span><div><LockKeyhole size={17}/><input type="password" autoComplete="current-password" value={password} onChange={e=>{setPassword(e.target.value);setError('')}} placeholder="Palavra-passe"/></div></label>
    {error&&<p className="loginError">{error}</p>}
    <button type="submit">Entrar no sistema <span>›</span></button>
   </form>
   <small>PUERTO ESPERANZA // SECURE ACCESS</small>
 </div></div>
}

function MainMenu({session,onOpen,onLogout}){
 return <div className="menuPage"><header className="menuTop"><div><p className="kicker">Bem-vindo</p><h1>ShadowCartel</h1><span>Escolhe o sistema que pretendes abrir</span></div><div className="userBadge"><div><b>{session.username}</b><small>{session.label}</small></div><button onClick={onLogout} title="Terminar sessão"><LogOut size={17}/></button></div></header>
 <div className="menuCards">{MENU_ITEMS.map(item=>{const Icon=item.icon; return <button key={item.id} className={`menuCard ${item.enabled?'':'disabled'} ${item.enabled?'':'emptySlot'}`} style={{'--accent':item.color}} onClick={()=>item.enabled&&onOpen(item.id)}>
   {item.enabled&&<><i><Icon size={27}/></i><h2>{item.title}</h2><p>{item.description}</p></>}<span>{item.enabled?'Abrir':'Em breve'} {item.enabled&&<b>›</b>}</span>
 </button>})}</div>
 <footer>Shadow Cartel // {session.role==='admin'?'Acesso total':'Modo de consulta'}</footer></div>
}

const money = n => `${Math.round(Number(n)||0)}$`;
const load = (key, fallback) => { try { const storage=key==='shadow-session'?sessionStorage:localStorage; return JSON.parse(storage.getItem(key)) || fallback; } catch { return fallback; } };
const safeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const normalize = s => String(s||'').trim().toLowerCase();

function dbRowsToTables(crafts, ingredients, tableRows=[]){
 const byCraft = new Map();
 (ingredients||[]).forEach(i=>{
   const arr = byCraft.get(i.craft_id) || [];
   arr.push([i.material_name, Number(i.qty)||0]);
   byCraft.set(i.craft_id, arr);
 });
 const groups = new Map();
 const sourceTables = tableRows.length ? tableRows.map(t=>({name:t.name, tag:t.tag, color:t.color, crafts:[]})) : initialTables.map(t=>({...t, crafts:[]}));
 sourceTables.forEach(t=>groups.set(t.name,t));
 (crafts||[]).forEach(c=>{
   const tableName = c.table_name || 'Mesa Normal';
   if(!groups.has(tableName)) groups.set(tableName,{name:tableName, tag:tableName.toUpperCase().replace('MESA DE ', '').replace('MESA DAS ', ''), color:'#00f0a8', crafts:[]});
   groups.get(tableName).crafts.push({
     id:c.id,
     name:c.name,
     output:Number(c.output_qty)||1,
     imageUrl:c.image_url || '',
     salePercentage:Number(c.sale_percentage ?? 25),
     ingredients:byCraft.get(c.id)||[]
   });
 });
 return Array.from(groups.values());
}

async function fetchRemote(){
 const [mRes,cRes,iRes,tRes] = await Promise.all([
   supabase.from('materials').select('*').order('name'),
   supabase.from('crafts').select('*').order('sort_order', {ascending:true}),
   supabase.from('craft_ingredients').select('*').order('sort_order', {ascending:true}),
   supabase.from('craft_tables').select('*').order('sort_order', {ascending:true})
 ]);
 if(mRes.error) throw mRes.error; if(cRes.error) throw cRes.error; if(iRes.error) throw iRes.error; if(tRes.error) throw tRes.error;
 if((mRes.data||[]).length===0 && (cRes.data||[]).length===0){
   await seedRemote();
   return fetchRemote();
 }
 const prices = {};
 (mRes.data||[]).forEach(m=>prices[m.name]=Number(m.price)||0);
 const tables = dbRowsToTables(cRes.data||[], iRes.data||[], tRes.data||[]);
 return {prices, tables};
}

async function seedRemote(){
 const mats = Object.entries(initialMaterials).map(([name,price])=>({name, price}));
 await supabase.from('materials').upsert(mats, {onConflict:'name'});
 await supabase.from('craft_tables').upsert(initialTables.map((t,idx)=>({name:t.name, tag:t.tag, color:t.color, sort_order:idx})), {onConflict:'name'});
 let order=0;
 for(const table of initialTables){
   for(const craft of table.crafts){
     const row = {name:craft.name, table_name:table.name, output_qty:craft.output, sale_percentage:Number(craft.salePercentage ?? 25), sort_order:order++, image_url: craft.imageUrl || ''};
     let res = await supabase.from('crafts').insert(row).select('id').single();
     if(res.error && String(res.error.message||'').includes('image_url')){
       delete row.image_url;
       res = await supabase.from('crafts').insert(row).select('id').single();
     }
     if(res.error) throw res.error;
     if(craft.ingredients.length){
       await supabase.from('craft_ingredients').insert(craft.ingredients.map(([m,q],idx)=>({craft_id:res.data.id, material_name:m, qty:q, sort_order:idx})));
     }
   }
 }
}

function buildCalculatedData(tables, prices){
 const craftMap = new Map();
 tables.forEach(t => (t.crafts||[]).forEach(c => craftMap.set(normalize(c.name), c)));
 const unitCache = new Map();
 const rawCache = new Map();
 const missingCache = new Map();
 function priceOf(name, stack=[]){
   const key = normalize(name);
   if(craftMap.has(key) && !stack.includes(key)) return unitCost(craftMap.get(key), [...stack, key]);
   return Number(prices[name] ?? prices[Object.keys(prices).find(p=>normalize(p)===key)] ?? 0) || 0;
 }
 function rawCost(craft, stack=[]){
   const cacheKey = (craft.id || craft.name) + '|' + stack.join('>');
   if(rawCache.has(cacheKey)) return rawCache.get(cacheKey);
   const value = (craft.ingredients||[]).reduce((sum,[m,q])=>sum + priceOf(m, stack) * Number(q||0), 0);
   rawCache.set(cacheKey, value);
   return value;
 }
 function unitCost(craft, stack=[]){
   const cacheKey = (craft.id || craft.name) + '|' + stack.join('>');
   if(unitCache.has(cacheKey)) return unitCache.get(cacheKey);
   const value = rawCost(craft, stack) / Math.max(1, Number(craft.output||1));
   unitCache.set(cacheKey, value);
   return value;
 }
 function missingFor(craft, stack=[]){
   const cacheKey = (craft.id || craft.name) + '|' + stack.join('>');
   if(missingCache.has(cacheKey)) return missingCache.get(cacheKey);
   const list = [];
   (craft.ingredients||[]).forEach(([m])=>{
     const key = normalize(m);
     if(craftMap.has(key) && !stack.includes(key)) list.push(...missingFor(craftMap.get(key), [...stack, key]));
     else if(prices[m] === undefined || Number(prices[m]) === 0) list.push(m);
   });
   const unique = [...new Set(list)];
   missingCache.set(cacheKey, unique);
   return unique;
 }
 const craftPrices = {};
 tables.forEach(t => (t.crafts||[]).forEach(c => { craftPrices[c.name] = unitCost(c); }));
 return {priceOf, rawCost, unitCost, missingFor, craftPrices, craftMap};
}

function App(){
 const [session,setSession]=useState(()=>load('shadow-session', null));
 const [screen,setScreen]=useState('menu');
 const isAdmin=session?.role==='admin';
 const login=user=>{sessionStorage.setItem('shadow-session',JSON.stringify(user));setSession(user);setScreen('menu');};
 const logout=()=>{sessionStorage.removeItem('shadow-session');setSession(null);setScreen('menu');};
 const [prices,setPrices]=useState(()=>load('shadow-prices-v2', initialMaterials));
 const [tables,setTables]=useState(()=>load('shadow-tables-v2', initialTables).map(t=>({...t,crafts:(t.crafts||[]).map(c=>({...c,salePercentage:Number(c.salePercentage ?? 25)}))})));
 const [q,setQ]=useState('');
 const [active,setActive]=useState('Todas');
 const [selected,setSelected]=useState(null);
 const [newMat,setNewMat]=useState({name:'', price:0});
 const [newCraft,setNewCraft]=useState({table:'Mesa Normal', name:''});
 const [newTable,setNewTable]=useState({name:''});
 const [sync,setSync]=useState(supabase ? 'A ligar...' : 'Modo local');
 const [ready,setReady]=useState(!supabase);
 const [sideTab,setSideTab]=useState('base');
 const calc = useMemo(()=>buildCalculatedData(tables, prices), [tables, prices]);
 const sell = (cost, percentage=25) => cost * (1 + Number(percentage||0)/100);

 useEffect(()=>{
   if(!supabase) return;
   (async()=>{
     try{
       const data=await fetchRemote();
       setPrices(data.prices); setTables(data.tables); setSync('Online'); setReady(true);
       localStorage.setItem('shadow-prices-v2',JSON.stringify(data.prices));
       localStorage.setItem('shadow-tables-v2',JSON.stringify(data.tables));
     }catch(e){ console.error(e); setSync('Erro BD'); setReady(true); }
   })();
 },[]);

 useEffect(()=>{
   if(!supabase) return;
   let timer=null;
   const queueRefresh=()=>{ clearTimeout(timer); timer=setTimeout(()=>refresh('Sincronizado'), 500); };
   const channel=supabase.channel('shadow-cartel-live-sync')
     .on('postgres_changes',{event:'*', schema:'public', table:'materials'}, queueRefresh)
     .on('postgres_changes',{event:'*', schema:'public', table:'crafts'}, queueRefresh)
     .on('postgres_changes',{event:'*', schema:'public', table:'craft_ingredients'}, queueRefresh)
     .on('postgres_changes',{event:'*', schema:'public', table:'craft_tables'}, queueRefresh)
     .subscribe();
   return ()=>{ clearTimeout(timer); supabase.removeChannel(channel); };
 },[]);

 useEffect(()=>{ if(!supabase) localStorage.setItem('shadow-prices-v2',JSON.stringify(prices)); },[prices]);
 useEffect(()=>{ if(!supabase) localStorage.setItem('shadow-tables-v2',JSON.stringify(tables)); },[tables]);

 const allCrafts=useMemo(()=>tables.flatMap(t=>(t.crafts||[]).map((c,i)=>({table:t.name, tag:t.tag, color:t.color, craft:c, craftIndex:i, cost:calc.unitCost(c), raw:calc.rawCost(c), missing:calc.missingFor(c)}))),[calc,tables]);
 const filtered=allCrafts.filter(x=>(active==='Todas'||x.table===active)&&x.craft.name.toLowerCase().includes(q.toLowerCase()));
 const visibleTables=tables.map(t=>({...t, crafts:filtered.filter(x=>x.table===t.name)})).filter(t=>active==='Todas'||t.name===active);
 const baseMaterialNames=Object.keys(prices).sort((a,b)=>a.localeCompare(b));
 const craftMaterialNames=Object.keys(calc.craftPrices).sort((a,b)=>a.localeCompare(b));
 const ingredientNames=[...new Set([...baseMaterialNames, ...craftMaterialNames])].sort((a,b)=>a.localeCompare(b));

 async function refresh(label='Online'){
  if(!supabase) return;
  try{ const data=await fetchRemote(); setPrices(data.prices); setTables(data.tables); setSync(label); }
  catch(e){ console.error(e); setSync('Erro BD'); }
 }
 async function addMaterial(){
  if(!isAdmin) return;
  const name = newMat.name.trim(); if(!name) return;
  const value=Number(newMat.price)||0;
  setPrices({...prices,[name]:value}); setNewMat({name:'', price:0});
  if(supabase){ setSync('A guardar...'); await supabase.from('materials').upsert({name,price:value},{onConflict:'name'}); setSync('Guardado'); }
 }
 async function changeMaterial(name,value){
  if(!isAdmin) return;
  const price=Number(value)||0; setPrices({...prices,[name]:price});
  if(supabase){ setSync('A guardar...'); await supabase.from('materials').upsert({name,price},{onConflict:'name'}); setSync('Guardado'); }
 }
 async function removeMaterial(name){
  if(!isAdmin) return;
  if(!confirm(`Apagar material "${name}"?`)) return;
  const next={...prices}; delete next[name]; setPrices(next);
  if(supabase){ setSync('A guardar...'); await supabase.from('materials').delete().eq('name',name); setSync('Guardado'); }
 }
 async function addTable(){
  if(!isAdmin) return;
  const name=newTable.name.trim(); if(!name || tables.some(t=>normalize(t.name)===normalize(name))) return;
  const index=tables.length;
  const hue=(index*67+158)%360;
  const table={name, tag:name.toUpperCase().replace('MESA DE ','').replace('MESA DAS ',''), color:`hsl(${hue} 88% 58%)`, crafts:[]};
  setTables([...tables,table]); setNewTable({name:''}); setActive(name); setNewCraft({...newCraft,table:name});
  if(supabase){ setSync('A guardar...'); const {error}=await supabase.from('craft_tables').insert({name:table.name,tag:table.tag,color:table.color,sort_order:index}); if(error){alert(error.message);setSync('Erro BD');return;} setSync('Guardado'); }
 }
 async function deleteTable(tableName){
  if(!isAdmin) return;
  const table=tables.find(t=>t.name===tableName);
  if(!table) return;
  const count=(table.crafts||[]).length;
  const warning=count ? `A mesa "${tableName}" tem ${count} craft${count===1?'':'s'}. Ao apagar a mesa, esses crafts também serão apagados. Continuar?` : `Apagar a mesa "${tableName}"?`;
  if(!confirm(warning)) return;
  if(supabase){
    setSync('A apagar...');
    if(count){
      const {error:craftError}=await supabase.from('crafts').delete().eq('table_name',tableName);
      if(craftError){alert(craftError.message);setSync('Erro BD');return;}
    }
    const {error}=await supabase.from('craft_tables').delete().eq('name',tableName);
    if(error){alert(error.message);setSync('Erro BD');return;}
    setSync('Guardado');
  }
  const next=tables.filter(t=>t.name!==tableName);
  setTables(next);
  if(active===tableName) setActive('Todas');
  if(newCraft.table===tableName) setNewCraft({...newCraft,table:next[0]?.name||''});
 }
 async function addCraft(){
  if(!isAdmin) return;
  const name = newCraft.name.trim(); if(!name) return;
  let craft={id:safeId(), name, output:1, salePercentage:25, imageUrl:'', ingredients:[]};
  if(supabase){
    setSync('A guardar...');
    const row = {name, table_name:newCraft.table, output_qty:1, sale_percentage:25, sort_order:Date.now(), image_url:''};
    let res = await supabase.from('crafts').insert(row).select('id').single();
    if(res.error && String(res.error.message||'').includes('image_url')){ delete row.image_url; res = await supabase.from('crafts').insert(row).select('id').single(); }
    if(res.error){alert(res.error.message);setSync('Erro BD');return;} craft.id=res.data.id; setSync('Guardado');
  }
  setTables(tables.map(t=>t.name===newCraft.table?{...t, crafts:[...t.crafts,craft]}:t)); setNewCraft({...newCraft, name:''});
 }
 async function updateCraft(tableName, craftIndex, nextCraft){
  if(!isAdmin) return;
  const nextTables = tables.map(t=>t.name===tableName?{...t, crafts:t.crafts.map((c,i)=>i===craftIndex?nextCraft:c)}:t);
  setTables(nextTables);
  if(supabase && nextCraft.id){
    setSync('A guardar...');
    const row = {name:nextCraft.name, output_qty:Number(nextCraft.output)||1, sale_percentage:Number(nextCraft.salePercentage)||0, table_name:tableName, image_url: nextCraft.imageUrl || ''};
    let res = await supabase.from('crafts').update(row).eq('id', nextCraft.id);
    if(res.error && String(res.error.message||'').includes('image_url')){ delete row.image_url; res = await supabase.from('crafts').update(row).eq('id', nextCraft.id); }
    await supabase.from('craft_ingredients').delete().eq('craft_id', nextCraft.id);
    if(nextCraft.ingredients.length){ await supabase.from('craft_ingredients').insert(nextCraft.ingredients.map(([m,q],idx)=>({craft_id:nextCraft.id, material_name:m, qty:Number(q)||0, sort_order:idx}))); }
    setSync('Guardado');
  }
  const updated = nextTables.find(t=>t.name===tableName)?.crafts[craftIndex];
  if(updated) setSelected({...selected, craft:updated, cost:calc.unitCost(updated), raw:calc.rawCost(updated), missing:calc.missingFor(updated)});
 }
 async function deleteCraft(item){
  if(!isAdmin) return;
  if(!confirm(`Apagar craft "${item.craft.name}"?`)) return;
  setTables(tables.map(t=>t.name===item.table?{...t, crafts:t.crafts.filter((_,i)=>i!==item.craftIndex)}:t)); setSelected(null);
  if(supabase && item.craft.id){ setSync('A guardar...'); await supabase.from('crafts').delete().eq('id',item.craft.id); setSync('Guardado'); }
 }
 async function resetAll(){
  if(!isAdmin) return;
  if(!confirm('Repor dados iniciais? Isto apaga a base atual e volta aos crafts de origem.')) return;
  if(supabase){
    setSync('A repor...');
    await supabase.from('craft_ingredients').delete().gt('id',0);
    await supabase.from('crafts').delete().gt('id',0);
    await supabase.from('materials').delete().neq('name','');
    await supabase.from('craft_tables').delete().neq('name','');
    await seedRemote();
    await refresh('Dados repostos');
    return;
  }
  setPrices(initialMaterials); setTables(initialTables); setSelected(null);
 }

 if(!session) return <LoginScreen onLogin={login}/>;
 if(screen==='menu') return <MainMenu session={session} onOpen={()=>setScreen('pricing')} onLogout={logout}/>;

 return <div className="app">
   <header className="hero compact">
    <div><p className="kicker">Sistema de Preçário</p><h1>Shadow Cartel</h1><span>Custos, venda e receitas por mesa</span></div>
    <div className="headActions"><button className="navBtn" onClick={()=>setScreen('menu')}><ArrowLeft size={15}/> Menu</button><div className="status"><span></span>{sync}{supabase&&<button className="syncBtn" onClick={()=>refresh('Atualizado')}>Atualizar</button>}</div><button className="navBtn" onClick={logout}><LogOut size={15}/> Sair</button></div>
   </header>

   <main className="grid">
    <aside className="panel materials">
      <div className="panelTitle"><span></span>Preços</div>
      <p className="hint">Base = editável. Craftados = custo calculado automaticamente pelas mesas.</p>
      <div className="sideTabs"><button className={sideTab==='base'?'on':''} onClick={()=>setSideTab('base')}>Materiais base</button><button className={sideTab==='crafts'?'on':''} onClick={()=>setSideTab('crafts')}>Craftados</button></div>
      {sideTab==='base' ? <>
        {isAdmin&&<div className="addLine"><input placeholder="Novo material" value={newMat.name} onChange={e=>setNewMat({...newMat,name:e.target.value})}/><input type="number" value={newMat.price} onChange={e=>setNewMat({...newMat,price:e.target.value})}/><button onClick={addMaterial}><Plus size={15}/></button></div>}
        <div className="matList compactList">
        {baseMaterialNames.map(m=><label key={m} className={`matRow ${!isAdmin?'readonly':''}`}><span>{m}</span><input type="number" value={prices[m]} disabled={!isAdmin} onChange={e=>changeMaterial(m,e.target.value)}/><em>$</em>{isAdmin&&<button type="button" className="mini danger" onClick={()=>removeMaterial(m)}><Trash2 size={13}/></button>}</label>)}
        </div>
      </> : <div className="matList compactList">
        {craftMaterialNames.map(m=><div key={m} className="craftPriceRow"><span>{m}</span><strong>{money(calc.craftPrices[m])}</strong></div>)}
      </div>}
      {isAdmin&&<button className="ghost" onClick={resetAll}><RotateCcw size={15}/> Repor dados iniciais</button>}
    </aside>

    <section className="content">
      <div className="toolbar panel">
        <div className="search"><Search size={16}/><input placeholder="Procurar craft..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <div className="tabs"><button className={active==='Todas'?'on':''} onClick={()=>setActive('Todas')}>Todas</button>{tables.map(t=><button className={active===t.name?'on':''} onClick={()=>setActive(t.name)} key={t.name}>{t.tag}</button>)}</div>
      </div>

      {isAdmin&&<div className="tableManager panel">
        <div className="tableCreate"><input placeholder="Nova mesa..." value={newTable.name} onChange={e=>setNewTable({name:e.target.value})} onKeyDown={e=>e.key==='Enter'&&addTable()}/><button onClick={addTable}><Plus size={15}/> Criar</button></div>
        <div className="tableChips">{tables.map(t=><div className="tableChip" key={t.name} style={{'--chip':t.color}}><span></span><b>{t.name}</b><small>{t.crafts.length}</small><button type="button" title={`Apagar ${t.name}`} onClick={()=>deleteTable(t.name)}><Trash2 size={13}/></button></div>)}</div>
      </div>}

      {isAdmin&&<div className="addCraft panel">
        <select value={newCraft.table} onChange={e=>setNewCraft({...newCraft,table:e.target.value})}>{tables.map(t=><option key={t.name}>{t.name}</option>)}</select>
        <input placeholder="Nome do novo craft" value={newCraft.name} onChange={e=>setNewCraft({...newCraft,name:e.target.value})}/>
        <button onClick={addCraft}><Plus size={15}/> Adicionar craft</button>
      </div>}

      {!ready&&<div className="panel loading">A carregar base de dados...</div>}
      {visibleTables.map(t=><section className="craftSection" key={t.name} style={{'--accent':t.color}}>
        <div className="sectionHead"><span>{t.tag}</span><h2>{t.name}</h2><small>{t.crafts.length} itens</small></div>
        <div className="cards">{t.crafts.map(x=><button className="card" key={x.craft.id||x.craft.name} onClick={()=>setSelected(x)}>
          <div className="corner"></div>
          <div className="thumb">{x.craft.imageUrl ? <img src={x.craft.imageUrl} alt="" loading="lazy"/> : <span>{x.craft.name.slice(0,2).toUpperCase()}</span>}</div>
          <div className="cardBody"><h3>{x.craft.name}</h3>
          {x.craft.ingredients.length===0?<p className="warn">Falta receita</p>:<p>{x.craft.ingredients.slice(0,4).map(([m,q])=>`${q}x ${m}`).join(' · ')}{x.craft.ingredients.length>4?'...':''}</p>}
          {x.craft.output>1&&<small className="output">Craft dá {x.craft.output} unidades</small>}
          <div className="cardPrices"><span>Custo {money(x.cost)}</span><strong>Venda {money(sell(x.cost,x.craft.salePercentage))}</strong></div></div>
        </button>)}</div>
      </section>)}
    </section>
   </main>

   {selected&&<CraftModal readOnly={!isAdmin} selected={selected} prices={prices} materialNames={ingredientNames} priceOf={calc.priceOf} calc={calc} sell={sell} onClose={()=>setSelected(null)} onSave={updateCraft} onDelete={deleteCraft}/>}   
   <footer>{supabase ? <Cloud size={14}/> : <CloudOff size={14}/>} Shadow Cartel // Craft Price Calculator</footer>
 </div>
}

function CraftModal({selected, materialNames, priceOf, calc, sell, onClose, onSave, onDelete, readOnly}){
 const [draft,setDraft]=useState(()=>JSON.parse(JSON.stringify(selected.craft)));
 useEffect(()=>setDraft(JSON.parse(JSON.stringify(selected.craft))),[selected.craft.id, selected.craft.name]);
 const cost = calc.unitCost(draft);
 const totalRaw = calc.rawCost(draft);
 const missingList = calc.missingFor(draft);
 const setIng=(idx, value)=>setDraft({...draft, ingredients:draft.ingredients.map((ing,i)=>i===idx?value:ing)});
 const addIng=()=>setDraft({...draft, ingredients:[...draft.ingredients,[materialNames[0]||'',1]]});
 const removeIng=idx=>setDraft({...draft, ingredients:draft.ingredients.filter((_,i)=>i!==idx)});
 return <div className="modal" onClick={onClose}><div className="detail" onClick={e=>e.stopPropagation()} style={{'--accent':selected.color}}>
    <button className="close" onClick={onClose}><X/></button>
    <p className="kicker">{selected.table}</p>
    <div className="editTop">{readOnly?<h2 className="craftReadTitle">{draft.name}</h2>:<input className="craftName" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/>} {!readOnly&&<button className="dangerBtn" onClick={()=>onDelete(selected)}><Trash2 size={15}/> Apagar</button>}</div>
    {!readOnly&&<div className="imageUrl"><span>URL da imagem do item</span><input placeholder="https://..." value={draft.imageUrl||''} onChange={e=>setDraft({...draft,imageUrl:e.target.value})}/></div>}
    <div className="priceGrid"><div><small>Custo unitário</small><b>{money(cost)}</b></div><div><small>Venda +{Number(draft.salePercentage||0)}%</small><b>{money(sell(cost,draft.salePercentage))}</b></div><div><small>Custo total do craft</small><b>{money(totalRaw)}</b></div><label><small>Unidades que saem</small>{readOnly?<b>{draft.output}</b>:<input type="number" min="1" value={draft.output} onChange={e=>setDraft({...draft,output:Number(e.target.value)||1})}/>}</label><label><small>Percentagem de venda</small>{readOnly?<b>{Number(draft.salePercentage||0)}%</b>:<div className="percentInput"><input type="number" min="0" value={draft.salePercentage??25} onChange={e=>setDraft({...draft,salePercentage:Number(e.target.value)||0})}/><span>%</span></div>}</label></div>
    <div className="modalHead"><h3>Ingredientes</h3>{!readOnly&&<button onClick={addIng}><Plus size={15}/> Adicionar ingrediente</button>}</div>
    {draft.ingredients.length===0?<div className="empty">Ainda não tens a receita deste item.</div>:<table><thead><tr><th>Material/Craft</th><th>Qtd</th><th>Preço usado</th><th>Total</th><th></th></tr></thead><tbody>{draft.ingredients.map(([m,q],idx)=><tr key={idx}><td>{readOnly?m:<select value={m} onChange={e=>setIng(idx,[e.target.value,q])}>{materialNames.map(n=><option key={n}>{n}</option>)}</select>}</td><td>{readOnly?q:<input type="number" value={q} onChange={e=>setIng(idx,[m,Number(e.target.value)||0])}/>}</td><td>{money(priceOf(m))}</td><td>{money(priceOf(m)*q)}</td><td>{!readOnly&&<button className="mini danger" onClick={()=>removeIng(idx)}><Trash2 size={13}/></button>}</td></tr>)}</tbody></table>}
    {missingList.length>0&&<p className="warn">Falta preço: {missingList.join(', ')}</p>}
    <div className="modalActions">{readOnly?<span className="readOnlyBadge"><Eye size={15}/> Apenas consulta</span>:<button className="save" onClick={()=>onSave(selected.table, selected.craftIndex, draft)}><Save size={16}/> Guardar alterações</button>}</div>
   </div></div>
}

createRoot(document.getElementById('root')).render(<App/>);
