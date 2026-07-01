import React, {useMemo, useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Search, RotateCcw, Plus, Trash2, Save, X, Cloud, CloudOff } from 'lucide-react';
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

const money = n => `${Math.round(Number(n)||0)}$`;
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
function rawCost(craft, prices){ return (craft.ingredients||[]).reduce((sum,[m,q])=>sum+(Number(prices[m]||0)*Number(q||0)),0); }
function unitCost(craft, prices){ return rawCost(craft, prices) / Math.max(1, Number(craft.output||1)); }
function missing(craft, prices){ return (craft.ingredients||[]).filter(([m])=>prices[m] === undefined || Number(prices[m]) === 0).map(([m])=>m); }
const safeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function dbRowsToTables(crafts, ingredients){
 const byCraft = new Map();
 (ingredients||[]).forEach(i=>{
   const arr = byCraft.get(i.craft_id) || [];
   arr.push([i.material_name, Number(i.qty)||0]);
   byCraft.set(i.craft_id, arr);
 });
 const groups = new Map(initialTables.map(t=>[t.name,{...t, crafts:[]}]));
 (crafts||[]).forEach(c=>{
   const tableName = c.table_name || 'Mesa Normal';
   if(!groups.has(tableName)) groups.set(tableName,{name:tableName, tag:tableName.toUpperCase().replace('MESA DE ', '').replace('MESA DAS ', ''), color:'#00f0a8', crafts:[]});
   groups.get(tableName).crafts.push({id:c.id, name:c.name, output:Number(c.output_qty)||1, ingredients:byCraft.get(c.id)||[]});
 });
 return Array.from(groups.values()).filter(t=>t.crafts.length || initialTables.some(x=>x.name===t.name));
}

async function fetchRemote(){
 const [mRes,cRes,iRes,sRes] = await Promise.all([
   supabase.from('materials').select('*').order('name'),
   supabase.from('crafts').select('*').order('sort_order', {ascending:true}),
   supabase.from('craft_ingredients').select('*').order('sort_order', {ascending:true}),
   supabase.from('settings').select('*')
 ]);
 if(mRes.error) throw mRes.error; if(cRes.error) throw cRes.error; if(iRes.error) throw iRes.error; if(sRes.error) throw sRes.error;
 if((mRes.data||[]).length===0 && (cRes.data||[]).length===0){
   await seedRemote();
   return fetchRemote();
 }
 const prices = {};
 (mRes.data||[]).forEach(m=>prices[m.name]=Number(m.price)||0);
 const tables = dbRowsToTables(cRes.data||[], iRes.data||[]);
 const markupRow = (sRes.data||[]).find(s=>s.id==='sale_percentage');
 return {prices, tables, markup:Number(markupRow?.value ?? 25)};
}

async function seedRemote(){
 const mats = Object.entries(initialMaterials).map(([name,price])=>({name, price}));
 await supabase.from('materials').upsert(mats, {onConflict:'name'});
 await supabase.from('settings').upsert({id:'sale_percentage', value:25});
 let order=0;
 for(const table of initialTables){
   for(const craft of table.crafts){
     const {data,error}=await supabase.from('crafts').insert({name:craft.name, table_name:table.name, output_qty:craft.output, sort_order:order++}).select('id').single();
     if(error) throw error;
     if(craft.ingredients.length){
       await supabase.from('craft_ingredients').insert(craft.ingredients.map(([m,q],idx)=>({craft_id:data.id, material_name:m, qty:q, sort_order:idx})));
     }
   }
 }
}

function App(){
 const [prices,setPrices]=useState(()=>load('shadow-prices-v2', initialMaterials));
 const [tables,setTables]=useState(()=>load('shadow-tables-v2', initialTables));
 const [markup,setMarkup]=useState(()=>Number(localStorage.getItem('shadow-markup') ?? 25));
 const [q,setQ]=useState('');
 const [active,setActive]=useState('Todas');
 const [selected,setSelected]=useState(null);
 const [newMat,setNewMat]=useState({name:'', price:0});
 const [newCraft,setNewCraft]=useState({table:'Mesa Normal', name:''});
 const [sync,setSync]=useState(supabase ? 'A ligar...' : 'Modo local');
 const [ready,setReady]=useState(!supabase);

 useEffect(()=>{
   if(!supabase) return;
   (async()=>{
     try{
       const data=await fetchRemote();
       setPrices(data.prices); setTables(data.tables); setMarkup(data.markup); setSync('Online'); setReady(true);
       localStorage.setItem('shadow-prices-v2',JSON.stringify(data.prices));
       localStorage.setItem('shadow-tables-v2',JSON.stringify(data.tables));
       localStorage.setItem('shadow-markup',String(data.markup));
     }catch(e){ console.error(e); setSync('Erro BD'); setReady(true); }
   })();
 },[]);

 useEffect(()=>{ if(!supabase) localStorage.setItem('shadow-prices-v2',JSON.stringify(prices)); },[prices]);
 useEffect(()=>{ if(!supabase) localStorage.setItem('shadow-tables-v2',JSON.stringify(tables)); },[tables]);
 useEffect(()=>{ if(!supabase) localStorage.setItem('shadow-markup',String(markup)); },[markup]);

 async function refresh(){ if(!supabase) return; const data=await fetchRemote(); setPrices(data.prices); setTables(data.tables); setMarkup(data.markup); setSync('Online'); }
 async function saveMarkup(v){ setMarkup(v); if(supabase){ setSync('A guardar...'); await supabase.from('settings').upsert({id:'sale_percentage', value:Number(v)||0}); setSync('Guardado'); } }

 const allCrafts=useMemo(()=>tables.flatMap(t=>t.crafts.map((c,i)=>({table:t.name, tag:t.tag, color:t.color, craft:c, craftIndex:i, cost:unitCost(c,prices), raw:rawCost(c,prices), missing:missing(c,prices)}))),[prices,tables]);
 const filtered=allCrafts.filter(x=>(active==='Todas'||x.table===active)&&x.craft.name.toLowerCase().includes(q.toLowerCase()));
 const visibleTables=tables.map(t=>({...t, crafts:filtered.filter(x=>x.table===t.name)})).filter(t=>active==='Todas'||t.name===active);
 const materialNames=Object.keys(prices).sort((a,b)=>a.localeCompare(b));
 const sell = cost => cost * (1 + Number(markup||0)/100);

 async function addMaterial(){
  const name = newMat.name.trim(); if(!name) return;
  const value=Number(newMat.price)||0;
  setPrices({...prices,[name]:value}); setNewMat({name:'', price:0});
  if(supabase){ setSync('A guardar...'); await supabase.from('materials').upsert({name,price:value},{onConflict:'name'}); setSync('Guardado'); }
 }
 async function changeMaterial(name,value){
  const price=Number(value)||0; setPrices({...prices,[name]:price});
  if(supabase){ setSync('A guardar...'); await supabase.from('materials').upsert({name,price},{onConflict:'name'}); setSync('Guardado'); }
 }
 async function removeMaterial(name){
  if(!confirm(`Apagar material "${name}"?`)) return;
  const next={...prices}; delete next[name]; setPrices(next);
  if(supabase){ setSync('A guardar...'); await supabase.from('materials').delete().eq('name',name); setSync('Guardado'); }
 }
 async function addCraft(){
  const name = newCraft.name.trim(); if(!name) return;
  let craft={id:safeId(), name, output:1, ingredients:[]};
  if(supabase){ setSync('A guardar...'); const {data,error}=await supabase.from('crafts').insert({name, table_name:newCraft.table, output_qty:1, sort_order:Date.now()}).select('id').single(); if(error){alert(error.message);setSync('Erro BD');return;} craft.id=data.id; setSync('Guardado'); }
  setTables(tables.map(t=>t.name===newCraft.table?{...t, crafts:[...t.crafts,craft]}:t)); setNewCraft({...newCraft, name:''});
 }
 async function updateCraft(tableName, craftIndex, nextCraft){
  const nextTables = tables.map(t=>t.name===tableName?{...t, crafts:t.crafts.map((c,i)=>i===craftIndex?nextCraft:c)}:t);
  setTables(nextTables);
  if(supabase && nextCraft.id){
    setSync('A guardar...');
    await supabase.from('crafts').update({name:nextCraft.name, output_qty:Number(nextCraft.output)||1, table_name:tableName}).eq('id', nextCraft.id);
    await supabase.from('craft_ingredients').delete().eq('craft_id', nextCraft.id);
    if(nextCraft.ingredients.length){ await supabase.from('craft_ingredients').insert(nextCraft.ingredients.map(([m,q],idx)=>({craft_id:nextCraft.id, material_name:m, qty:Number(q)||0, sort_order:idx}))); }
    setSync('Guardado');
  }
  const updated = nextTables.find(t=>t.name===tableName)?.crafts[craftIndex];
  if(updated) setSelected({...selected, craft:updated, cost:unitCost(updated,prices), raw:rawCost(updated,prices), missing:missing(updated,prices)});
 }
 async function deleteCraft(item){
  if(!confirm(`Apagar craft "${item.craft.name}"?`)) return;
  setTables(tables.map(t=>t.name===item.table?{...t, crafts:t.crafts.filter((_,i)=>i!==item.craftIndex)}:t)); setSelected(null);
  if(supabase && item.craft.id){ setSync('A guardar...'); await supabase.from('crafts').delete().eq('id',item.craft.id); setSync('Guardado'); }
 }
 async function resetAll(){
  if(!confirm('Repor dados iniciais?')) return;
  if(supabase){
    setSync('A repor...'); await supabase.from('craft_ingredients').delete().neq('id','00000000-0000-0000-0000-000000000000'); await supabase.from('crafts').delete().neq('id','00000000-0000-0000-0000-000000000000'); await supabase.from('materials').delete().neq('name',''); await seedRemote(); await refresh(); return;
  }
  setPrices(initialMaterials); setTables(initialTables); setMarkup(25); setSelected(null);
 }

 return <div className="app">
   <header className="hero compact">
    <div><p className="kicker">Sistema de Preçário</p><h1>Shadow Cartel Craft</h1><span>Custos, venda e receitas por mesa</span></div>
    <div className="status"><span></span>{sync}</div>
   </header>

   <main className="grid">
    <aside className="panel materials">
      <div className="panelTitle"><span></span>Materiais - Preços</div>
      <p className="hint">Altera preços, adiciona materiais novos ou apaga os que já não usas.</p>
      <div className="addLine"><input placeholder="Novo material" value={newMat.name} onChange={e=>setNewMat({...newMat,name:e.target.value})}/><input type="number" value={newMat.price} onChange={e=>setNewMat({...newMat,price:e.target.value})}/><button onClick={addMaterial}><Plus size={15}/></button></div>
      <div className="matList">
      {materialNames.map(m=><label key={m} className="matRow"><span>{m}</span><input type="number" value={prices[m]} onChange={e=>changeMaterial(m,e.target.value)}/><em>$</em><button type="button" className="mini danger" onClick={()=>removeMaterial(m)}><Trash2 size={13}/></button></label>)}
      </div>
      <button className="ghost" onClick={resetAll}><RotateCcw size={15}/> Repor dados iniciais</button>
    </aside>

    <section className="content">
      <div className="toolbar panel">
        <div className="search"><Search size={16}/><input placeholder="Procurar craft..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <div className="markupBox"><span>Venda geral</span><input type="number" value={markup} onChange={e=>saveMarkup(e.target.value)}/><b>%</b></div>
        <div className="tabs"><button className={active==='Todas'?'on':''} onClick={()=>setActive('Todas')}>Todas</button>{tables.map(t=><button className={active===t.name?'on':''} onClick={()=>setActive(t.name)} key={t.name}>{t.tag}</button>)}</div>
      </div>

      <div className="addCraft panel">
        <select value={newCraft.table} onChange={e=>setNewCraft({...newCraft,table:e.target.value})}>{tables.map(t=><option key={t.name}>{t.name}</option>)}</select>
        <input placeholder="Nome do novo craft" value={newCraft.name} onChange={e=>setNewCraft({...newCraft,name:e.target.value})}/>
        <button onClick={addCraft}><Plus size={15}/> Adicionar craft</button>
      </div>

      {!ready&&<div className="panel loading">A carregar base de dados...</div>}
      {visibleTables.map(t=><section className="craftSection" key={t.name} style={{'--accent':t.color}}>
        <div className="sectionHead"><span>{t.tag}</span><h2>{t.name}</h2><small>{t.crafts.length} items</small></div>
        <div className="cards">{t.crafts.map(x=><button className="card" key={x.craft.id||x.craft.name} onClick={()=>setSelected(x)}>
          <div className="corner"></div><h3>{x.craft.name}</h3>
          {x.craft.ingredients.length===0?<p className="warn">Falta receita</p>:<p>{x.craft.ingredients.slice(0,3).map(([m,q])=>`${q}x ${m}`).join(' · ')}{x.craft.ingredients.length>3?'...':''}</p>}
          {x.craft.output>1&&<small className="output">Craft dá {x.craft.output} unidades</small>}
          <div className="cardPrices"><span>Custo {money(x.cost)}</span><strong>Venda {money(sell(x.cost))}</strong></div>
        </button>)}</div>
      </section>)}
    </section>
   </main>

   {selected&&<CraftModal selected={selected} prices={prices} materialNames={materialNames} markup={markup} sell={sell} onClose={()=>setSelected(null)} onSave={updateCraft} onDelete={deleteCraft}/>}   
   <footer>{supabase ? <Cloud size={14}/> : <CloudOff size={14}/>} Shadow Cartel // Craft Price Calculator</footer>
 </div>
}

function CraftModal({selected, prices, materialNames, markup, sell, onClose, onSave, onDelete}){
 const [draft,setDraft]=useState(()=>JSON.parse(JSON.stringify(selected.craft)));
 useEffect(()=>setDraft(JSON.parse(JSON.stringify(selected.craft))),[selected.craft.name]);
 const cost = unitCost(draft, prices);
 const totalRaw = rawCost(draft, prices);
 const missingList = missing(draft, prices);
 const setIng=(idx, value)=>setDraft({...draft, ingredients:draft.ingredients.map((ing,i)=>i===idx?value:ing)});
 const addIng=()=>setDraft({...draft, ingredients:[...draft.ingredients,[materialNames[0]||'',1]]});
 const removeIng=idx=>setDraft({...draft, ingredients:draft.ingredients.filter((_,i)=>i!==idx)});
 return <div className="modal" onClick={onClose}><div className="detail" onClick={e=>e.stopPropagation()} style={{'--accent':selected.color}}>
    <button className="close" onClick={onClose}><X/></button>
    <p className="kicker">{selected.table}</p>
    <div className="editTop"><input className="craftName" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/><button className="dangerBtn" onClick={()=>onDelete(selected)}><Trash2 size={15}/> Apagar</button></div>
    <div className="priceGrid"><div><small>Custo unitário</small><b>{money(cost)}</b></div><div><small>Venda +{markup}%</small><b>{money(sell(cost))}</b></div><div><small>Custo total do craft</small><b>{money(totalRaw)}</b></div><label><small>Unidades que saem</small><input type="number" min="1" value={draft.output} onChange={e=>setDraft({...draft,output:Number(e.target.value)||1})}/></label></div>
    <div className="modalHead"><h3>Ingredientes</h3><button onClick={addIng}><Plus size={15}/> Adicionar ingrediente</button></div>
    {draft.ingredients.length===0?<div className="empty">Ainda não tens a receita deste item.</div>:<table><thead><tr><th>Material</th><th>Qtd</th><th>Preço</th><th>Total</th><th></th></tr></thead><tbody>{draft.ingredients.map(([m,q],idx)=><tr key={idx}><td><select value={m} onChange={e=>setIng(idx,[e.target.value,q])}>{materialNames.map(n=><option key={n}>{n}</option>)}</select></td><td><input type="number" value={q} onChange={e=>setIng(idx,[m,Number(e.target.value)||0])}/></td><td>{money(prices[m]||0)}</td><td>{money((prices[m]||0)*q)}</td><td><button className="mini danger" onClick={()=>removeIng(idx)}><Trash2 size={13}/></button></td></tr>)}</tbody></table>}
    {missingList.length>0&&<p className="warn">Falta preço: {missingList.join(', ')}</p>}
    <div className="modalActions"><button className="save" onClick={()=>onSave(selected.table, selected.craftIndex, draft)}><Save size={16}/> Guardar alterações</button></div>
   </div></div>
}

createRoot(document.getElementById('root')).render(<App/>);
