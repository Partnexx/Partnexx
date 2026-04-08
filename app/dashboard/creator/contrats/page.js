'use client'
import { useState } from 'react'
import { useTheme } from '../../ThemeContext'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fakeDownload(filename, content = 'Contenu du document Partnexx\n\nCe document est généré automatiquement.') {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function StatusBadge({ status }) {
  const map = {
    'En cours':   { bg: '#dbeafe', color: '#2563eb' },
    'Complété':   { bg: '#dcfce7', color: '#15803d' },
    'Signé':      { bg: '#ede9fe', color: '#7c3aed' },
    'Urgent':     { bg: '#fee2e2', color: '#dc2626' },
    'Bientôt':    { bg: '#fef9c3', color: '#a16207' },
    'Normal':     { bg: '#f1f5f9', color: '#475569' },
    'Payé':       { bg: '#dcfce7', color: '#15803d' },
    'En attente': { bg: '#fef9c3', color: '#a16207' },
    'Validation': { bg: '#ede9fe', color: '#7c3aed' },
    'Médiation':  { bg: '#fee2e2', color: '#dc2626' },
    'Complété ✓': { bg: '#dcfce7', color: '#15803d' },
  }
  const s = map[status] || { bg: '#f1f5f9', color: '#475569' }
  return (
    <span style={{ fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20 }}>
      {status}
    </span>
  )
}

function PriorityBadge({ priority }) {
  const map = { 'Haute': '#ef4444', 'Moyenne': '#f59e0b', 'Basse': '#22c55e' }
  const c = map[priority] || '#9ca3af'
  return (
    <span style={{ fontSize: 11, fontWeight: 700, background: c + '22', color: c, padding: '3px 10px', borderRadius: 6 }}>
      {priority}
    </span>
  )
}

function ProgressBar({ value, color = '#7c3aed', isDark }) {
  return (
    <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', width: value + '%', background: `linear-gradient(90deg,${color},${color}99)`, borderRadius: 99, transition: 'width .6s ease' }} />
    </div>
  )
}

function Btn({ children, onClick, variant = 'secondary', color, style: extraStyle }) {
  const purple = '#7c3aed'
  const green = '#22c55e'
  const blue = '#3b82f6'
  const base = {
    padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
    transition: 'opacity .2s', ...extraStyle,
  }
  if (variant === 'primary') return <button onClick={onClick} style={{ ...base, background: `linear-gradient(135deg,${color || purple},${color ? color + 'cc' : '#a855f7'})`, color: '#fff', boxShadow: `0 4px 14px ${color || purple}44` }}>{children}</button>
  if (variant === 'green')   return <button onClick={onClick} style={{ ...base, background: `linear-gradient(135deg,${green},#16a34a)`, color: '#fff', boxShadow: '0 4px 14px #22c55e44' }}>{children}</button>
  if (variant === 'danger')  return <button onClick={onClick} style={{ ...base, background: '#ef4444', color: '#fff', boxShadow: '0 4px 14px #ef444444' }}>{children}</button>
  return <button onClick={onClick} style={{ ...base, background: 'transparent', border: '1px solid #d1d5db', color: '#6b7280' }}>{children}</button>
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CONTRATS_ACTIFS = [
  { id: 1, title: 'Review produit Tech', brand: 'TechFlow', status: 'En cours', priority: 'Haute', type: 'UGC', deadline: '15 Feb 2024', amount: 500, progression: 75 },
  { id: 2, title: 'Collaboration Fitness', brand: 'SportLife', status: 'En cours', priority: 'Moyenne', type: 'Ambassadeur', deadline: 'Mai 2024', amount: 3600, progression: 33 },
  { id: 3, title: 'Placement de produits', brand: 'FashionNova', status: 'Signé', priority: 'Moyenne', type: 'Placement de produits', deadline: '25 Feb 2024', amount: 1200, progression: 0 },
]

const CONTRATS_HISTORIQUE = [
  { id: 4, title: 'Campagne Skincare Naturelle', brand: 'GreenBeauty', status: 'Complété', priority: 'Basse', type: 'One Shot', deadline: '22 Jan 2024', amount: 800, progression: 100 },
  { id: 5, title: 'Campagne Mode Hiver', brand: 'StyleBox', status: 'Complété', priority: 'Basse', type: 'One Shot', deadline: '28 Dec 2023', amount: 950, progression: 100 },
]

const LITIGES = [
  {
    id: 1, title: 'Non-respect des guidelines de marque', status: 'En cours', brand: 'Médiation',
    brand2: 'TechFlow', type: 'Non-conformité du contenu',
    desc: 'Le contenu livré ne respecte pas les guidelines de la marque : couleur non-conforme, logo mal positionné, et baseline manquante.',
    fichiers: ['guideline.pdf', 'contenu_livré.jpg', 'exemple_attendu.jpg'],
    recommandations: ['Proposer une session de briefing supplémentaire et refaire le contenu avant la production'],
    mediation: true,
    conversation: [
      { author: 'Vous', time: 'il y a 2 jours', text: 'Le document de guidelines a été envoyé dès le début du contrat. Nous avons pu scripter et valider le contenu.', isMe: true },
      { author: 'Équipe Partnexx', time: 'il y a 1h', text: 'Bonjour. Je vais traiter le litige. Proposons une solution. L\'influenceur affirme avoir suivi les guidelines Assurez-vous que vous avez bien dé l\'axe du briefing. Que pensez-vous ?', isMe: false },
      { author: 'Vous', time: 'il y a 30 min', text: 'Nous sommes d\'accord pour un call de briefing. Quand pouvez-vous nous organiser cela ?', isMe: true },
      { author: 'Équipe Partnexx', time: 'il y a 5 min', text: 'Parfait. Je reviens vers vous.', isMe: false },
    ],
  },
  {
    id: 2, title: 'Conditions de paiement - Live shopping', status: 'En cours', brand: 'Nouveau',
    brand2: 'SocialMedia', type: 'Litige paiement',
    desc: 'Désaccord sur les conditions de paiement du live shopping.',
    fichiers: [], recommandations: [], mediation: false, conversation: [],
  },
]

const SUIVIS = [
  { id: 1, title: 'Op Noël 2025', brand: 'Nova Media', deadline: '20 Dec 2025', joursRestants: 25, montant: 9000, solde: 0, debut: '05/10/2025', livrables: ['3 reels', 'Campagne TikTok', '5 reels', 'Live shopping'], alertes: ['Validation contrat', 'Retard livraison', 'Live shopping'], progression: 30 },
  { id: 2, title: 'Ambassadeur 12 mois', brand: 'MixGo', deadline: '15 Jan 2026', joursRestants: 90, montant: 18000, solde: 12600, debut: '10/01/2025', livrables: ['Livrables', 'Posts mensuels', 'Stories hebdo', 'Live content'], alertes: ['Event live d\'année', 'Suivi mensuel'], progression: 70 },
]

const TRANSACTIONS = [
  { id: 1, title: 'Campagne Beauté Printemps', brand: 'GreenBeauty', date: '2024-02-15', trx: 'TRX-001', inv: 'INV-2024-001', amount: 800, status: 'Payé' },
  { id: 2, title: 'Tech Review Q1', brand: 'TechFlow', date: '2024-02-20', trx: 'TRX-002', inv: 'INV-2024-002', amount: 500, status: 'En cours' },
  { id: 3, title: 'Fashion Week Coverage', brand: 'FashionNova', date: '2024-02-18', trx: 'TRX-003', inv: 'INV-2024-003', amount: 1200, status: 'Validation' },
]

const HISTORIQUE_RETRAITS = [
  { amount: '2400€', account: 'IBAN **** 1234', date: '15/01/2024', status: 'Complété ✓' },
  { amount: '800€', account: 'PayPal', date: '28/12/2023', status: 'Complété ✓' },
]

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ContratsPage() {
  const { isDark, colors } = useTheme()
  const [mainTab, setMainTab] = useState('contrats')
  const [contratSub, setContratSub] = useState('dashboard')
  const [paieSub, setPaieSub] = useState('dashboard')
  const [litigeOpen, setLitigeOpen] = useState(null)
  const [msgInput, setMsgInput] = useState('')
  const [histOpen, setHistOpen] = useState(false)
  const [period, setPeriod] = useState('30j')
  const [litigeMsg, setLitigeMsg] = useState(LITIGES.map(l => l.conversation))

  const purple = '#7c3aed'
  const green = '#22c55e'
  const purpleLight = isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.07)'

  const card = (children, extra = {}) => (
    <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px 24px', boxShadow: colors.shadow, ...extra }}>
      {children}
    </div>
  )

  const lineChart = () => {
    const data = [2800,3000,3100,3200,3300,3500]
    const months = ['Jan','Fév','Mar','Avr','Mai','Jun']
    const W=600,H=180,pL=40,pB=30,pT=20,pR=20
    const cW=W-pL-pR, cH=H-pT-pB
    const min=2600,max=3700,range=max-min
    const pts = data.map((v,i)=>`${pL+(i/(data.length-1))*cW},${pT+cH-((v-min)/range)*cH}`).join(' ')
    const area = `${pL},${pT+cH} ${pts} ${pL+(data.length-1)/(data.length-1)*cW},${pT+cH}`
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:H }}>
        <defs>
          <linearGradient id="lineG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={purple} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={purple} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {[0,0.25,0.5,0.75,1].map((f,i)=>{
          const y=pT+cH-f*cH
          const v=Math.round(min+f*range)
          return <g key={i}>
            <line x1={pL} x2={W-pR} y1={y} y2={y} stroke={isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)'} strokeDasharray="4,4"/>
            <text x={pL-6} y={y+4} textAnchor="end" fontSize={10} fill={isDark?'#6060a0':'#9ca3af'}>{(v/1000).toFixed(1)}K</text>
          </g>
        })}
        {months.map((m,i)=><text key={m} x={pL+(i/(months.length-1))*cW} y={H-6} textAnchor="middle" fontSize={10} fill={isDark?'#6060a0':'#9ca3af'}>{m}</text>)}
        <polygon points={area} fill="url(#lineG)"/>
        <polyline points={pts} fill="none" stroke={purple} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((v,i)=>{
          const x=pL+(i/(data.length-1))*cW
          const y=pT+cH-((v-min)/range)*cH
          return <circle key={i} cx={x} cy={y} r={4} fill={purple} stroke={isDark?'#1e1e32':'#fff'} strokeWidth={2}/>
        })}
      </svg>
    )
  }

  // ── CONTRATS DASHBOARD ─────────────────────────────────────────────────────
  const renderContratsDashboard = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {[
          { label:'Contrats actifs', value:'12', sub:'+3 ce mois', icon:'📄', color:'#06b6d4' },
          { label:'Revenus totaux', value:'28 450€', sub:'+15% vs mois dernier', icon:'💶', color:green },
          { label:'En attente', value:'5', sub:'-2 cette semaine', icon:'⏳', color:'#f59e0b' },
          { label:'Taux de complétion', value:'94%', sub:'+5% ce trimestre', icon:'✅', color:purple },
        ].map(k=>(
          <div key={k.label} style={{ background:colors.cardBg, border:`1px solid ${colors.border}`, borderRadius:14, padding:'18px 20px', boxShadow:colors.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ width:36,height:36,borderRadius:10,background:k.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>{k.icon}</div>
              <span style={{ fontSize:11,fontWeight:700,color:green,background:green+'15',padding:'3px 8px',borderRadius:20 }}>↑</span>
            </div>
            <div style={{ fontSize:11,color:colors.textSecondary,marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:24,fontWeight:900,color:k.color }}>{k.value}</div>
            <div style={{ fontSize:11,color:green,marginTop:4 }}>↑ {k.sub}</div>
          </div>
        ))}
      </div>

      {card(<>
        <div style={{ fontSize:15,fontWeight:800,color:colors.text,marginBottom:16,display:'flex',alignItems:'center',gap:8 }}>🎯 Indicateurs de performance</div>
        {[
          { label:'Taux de signature', pct:87, obj:'90%', color:'#f97316' },
          { label:'Taux de complétion', pct:94, obj:'95%', color:'#f97316' },
          { label:'Délais respectés', pct:91, obj:'95%', color:'#f97316' },
          { label:'Satisfaction client', pct:96, obj:'90%', color:green },
        ].map(m=>(
          <div key={m.label} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
              <span style={{ color:colors.textSecondary }}>{m.label}</span>
              <span style={{ color:colors.text, fontWeight:700 }}>Objectif: {m.obj} <span style={{ color:m.color, marginLeft:8 }}>{m.pct}%</span></span>
            </div>
            <ProgressBar value={m.pct} color={m.color} isDark={isDark}/>
          </div>
        ))}
      </>)}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {card(<>
          <div style={{ fontSize:15,fontWeight:800,color:colors.text,marginBottom:16 }}>⚡ Activité récente</div>
          {[
            { title:'GreenBeauty - Skincare', date:'15 Jan 2024', status:'Complété', amount:'800€', growth:'+5%' },
            { title:'TechFlow - Review', date:'1 Fev 2024', status:'En cours', amount:'500€', growth:'+12%' },
            { title:'SportLife - Ambassadeur', date:'5 Fev 2024', status:'En cours', amount:'3600€', growth:'+8%' },
          ].map(a=>(
            <div key={a.title} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${colors.border}` }}>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:colors.text }}>{a.title}</div>
                <div style={{ fontSize:11,color:colors.textSecondary,display:'flex',gap:8,marginTop:2 }}>
                  <span>{a.date}</span>
                  <StatusBadge status={a.status}/>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:14,fontWeight:800,color:colors.text }}>{a.amount}</div>
                <div style={{ fontSize:11,color:green }}>↑ {a.growth}</div>
              </div>
            </div>
          ))}
        </>)}

        {card(<>
          <div style={{ fontSize:15,fontWeight:800,color:colors.text,marginBottom:16 }}>📅 Échéances à venir</div>
          {[
            { title:'Review Tech - TechFlow', date:'15 Fév', restants:'3 jours restants', urgency:'Urgent' },
            { title:'Posts Beauty - GlowCosmet', date:'18 Fév', restants:'6 jours restants', urgency:'Bientôt' },
            { title:'Campagne Mode - StyleBox', date:'25 Fév', restants:'13 jours restants', urgency:'Normal' },
          ].map(e=>(
            <div key={e.title} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',borderRadius:10,marginBottom:8,background:e.urgency==='Urgent'?(isDark?'rgba(239,68,68,0.08)':'#fee2e2'):e.urgency==='Bientôt'?(isDark?'rgba(245,158,11,0.08)':'#fef9c3'):(isDark?'rgba(255,255,255,0.02)':'#fafafa') }}>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:colors.text }}>{e.title}</div>
                <div style={{ fontSize:11,color:e.urgency==='Urgent'?'#dc2626':e.urgency==='Bientôt'?'#a16207':colors.textSecondary,marginTop:2 }}>{e.restants}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:13,fontWeight:700,color:colors.text }}>{e.date}</div>
                <StatusBadge status={e.urgency}/>
              </div>
            </div>
          ))}
        </>)}
      </div>
    </div>
  )

  // ── CONTRATS ACTUELS ───────────────────────────────────────────────────────
  const renderContratsActuels = () => (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Total actifs', value:'12', icon:'📄', color:'#06b6d4' },
          { label:'Valeur totale', value:'28 450€', icon:'💶', color:green },
          { label:'À risque', value:'1', icon:'⚠️', color:'#f59e0b' },
          { label:'Taux succès', value:'94%', icon:'📈', color:purple },
        ].map(k=>(
          <div key={k.label} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:12,padding:'14px 16px',boxShadow:colors.shadow,display:'flex',alignItems:'center',gap:12 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:k.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>{k.icon}</div>
            <div><div style={{ fontSize:11,color:colors.textSecondary }}>{k.label}</div><div style={{ fontSize:20,fontWeight:900,color:k.color }}>{k.value}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex',gap:12,marginBottom:16,flexWrap:'wrap' }}>
        <div style={{ flex:1,position:'relative' }}>
          <input placeholder="Rechercher un contrat..." style={{ width:'100%',padding:'10px 14px 10px 36px',borderRadius:10,border:`1px solid ${colors.border}`,background:colors.inputBg,color:colors.text,fontSize:13,outline:'none',boxSizing:'border-box' }}/>
          <span style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:colors.textSecondary }}>🔍</span>
        </div>
        {['Tous les types','Tous les statuts','Date'].map(f=>(
          <select key={f} style={{ padding:'10px 12px',borderRadius:10,border:`1px solid ${colors.border}`,background:colors.inputBg,color:colors.text,fontSize:13,outline:'none',cursor:'pointer' }}>
            <option>{f}</option>
          </select>
        ))}
      </div>

      <div style={{ display:'flex',gap:12,marginBottom:16 }}>
        <button onClick={()=>setHistOpen(false)} style={{ flex:1,padding:'11px',borderRadius:12,border:`1px solid ${colors.border}`,background:!histOpen?purple:'transparent',color:!histOpen?'#fff':colors.textSecondary,fontWeight:700,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
          📄 Contrats actifs ({CONTRATS_ACTIFS.length})
        </button>
        <button onClick={()=>setHistOpen(true)} style={{ flex:1,padding:'11px',borderRadius:12,border:`1px solid ${colors.border}`,background:histOpen?purple:'transparent',color:histOpen?'#fff':colors.textSecondary,fontWeight:700,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
          🕐 Historique ({CONTRATS_HISTORIQUE.length})
        </button>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16 }}>
        {(histOpen ? CONTRATS_HISTORIQUE : CONTRATS_ACTIFS).map(c=>(
          <div key={c.id} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:16,padding:'20px',boxShadow:colors.shadow }}>
            <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10 }}>
              <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:c.status==='Complété'?green:c.status==='Signé'?purple:'#3b82f6' }}/>
                <span style={{ fontSize:15,fontWeight:800,color:colors.text }}>{c.title}</span>
              </div>
              <StatusBadge status={c.status}/>
            </div>
            <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:10 }}>{c.brand}</div>
            <div style={{ display:'flex',gap:8,marginBottom:12,flexWrap:'wrap' }}>
              <PriorityBadge priority={c.priority}/>
              <span style={{ fontSize:11,color:colors.textSecondary,background:purpleLight,padding:'3px 10px',borderRadius:6 }}>Type: {c.type}</span>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:6 }}>
              <span style={{ color:colors.textSecondary }}>📅 Échéance: {c.deadline}</span>
              <span style={{ fontWeight:900,color:colors.text }}>{c.amount.toLocaleString()}€</span>
            </div>
            {c.progression > 0 && <>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:colors.textSecondary,marginTop:8,marginBottom:2 }}>
                <span>Progression</span><span style={{ fontWeight:700,color:colors.text }}>{c.progression}%</span>
              </div>
              <ProgressBar value={c.progression} color={purple} isDark={isDark}/>
            </>}
            <div style={{ display:'flex',gap:8,marginTop:14 }}>
              <Btn onClick={()=>alert(`Détails du contrat : ${c.title}\nMarque: ${c.brand}\nMontant: ${c.amount}€`)} style={{ flex:1,justifyContent:'center' }}>👁️ Voir</Btn>
              <Btn onClick={()=>fakeDownload(`contrat_${c.id}_${c.brand}.txt`,`CONTRAT PARTNEXX\n\nTitre: ${c.title}\nMarque: ${c.brand}\nMontant: ${c.amount}€\nÉchéance: ${c.deadline}\nStatut: ${c.status}`)} style={{ flex:1,justifyContent:'center' }}>📤 Export</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── LITIGES ────────────────────────────────────────────────────────────────
  const renderLitiges = () => (
    <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'start' }}>
      <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:4 }}>
          {[{label:'Actifs',val:'2',c:'#ef4444'},{label:'Résolus',val:'8',c:green}].map(k=>(
            <div key={k.label} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:12,padding:'12px 16px',boxShadow:colors.shadow }}>
              <div style={{ fontSize:11,color:colors.textSecondary }}>{k.label}</div>
              <div style={{ fontSize:24,fontWeight:900,color:k.c }}>{k.val}</div>
            </div>
          ))}
        </div>
        {LITIGES.map((l,li)=>(
          <div key={l.id} onClick={()=>setLitigeOpen(litigeOpen===l.id?null:l.id)} style={{ background:colors.cardBg,border:`2px solid ${litigeOpen===l.id?purple:colors.border}`,borderRadius:16,padding:'16px 20px',boxShadow:colors.shadow,cursor:'pointer',transition:'border-color .2s' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6 }}>
              <div style={{ fontSize:14,fontWeight:800,color:colors.text }}>{l.title}</div>
              <div style={{ display:'flex',gap:6 }}>
                <StatusBadge status={l.status}/>
                {l.brand==='Nouveau'&&<span style={{ fontSize:10,background:'#7c3aed',color:'#fff',padding:'2px 8px',borderRadius:20,fontWeight:700 }}>Nouveau</span>}
              </div>
            </div>
            <div style={{ fontSize:12,color:colors.textSecondary }}>Contrat UGC · Terminé: {l.brand2} · Type: {l.type}</div>
            <div style={{ fontSize:12,color:purple,marginTop:6 }}>{litigeOpen===l.id?'▲ Fermer':'▼ Voir le litige'}</div>
          </div>
        ))}
      </div>

      <div>
        {litigeOpen && (() => {
          const l = LITIGES.find(x=>x.id===litigeOpen)
          const li = LITIGES.findIndex(x=>x.id===litigeOpen)
          return (
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              {card(<>
                <div style={{ fontSize:13,fontWeight:700,color:colors.text,marginBottom:6 }}>📝 Description du problème</div>
                <div style={{ fontSize:13,color:colors.textSecondary,lineHeight:1.6,marginBottom:12 }}>{l.desc}</div>
                {l.fichiers.length>0&&(
                  <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                    {l.fichiers.map(f=>(
                      <button key={f} onClick={()=>fakeDownload(f)} style={{ padding:'5px 12px',borderRadius:8,border:`1px solid ${colors.border}`,background:purpleLight,color:purple,fontSize:12,fontWeight:700,cursor:'pointer' }}>📎 {f}</button>
                    ))}
                  </div>
                )}
              </>)}

              {l.recommandations.length>0&&card(<>
                <div style={{ fontSize:13,fontWeight:700,color:colors.text,marginBottom:8 }}>💡 Recommandations IA</div>
                {l.recommandations.map((r,i)=>(
                  <div key={i} style={{ display:'flex',gap:8,fontSize:13,color:colors.textSecondary }}>
                    <span style={{ color:green }}>✓</span>{r}
                  </div>
                ))}
              </>)}

              {l.mediation&&card(<>
                <div style={{ fontSize:13,fontWeight:700,color:green }}>🤝 Médiation Partnexx active</div>
                <div style={{ fontSize:12,color:colors.textSecondary,marginTop:4 }}>Notre équipe intervient sur ce trouble à trouver une solution équitable pour toutes les parties. Nos analystes les échanges et proposerons une décision équitable.</div>
              </>)}

              <div style={{ fontSize:13,fontWeight:700,color:colors.text }}>💬 Conversation dédiée · Tom Perreira</div>
              <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,overflow:'hidden' }}>
                <div style={{ maxHeight:240,overflowY:'auto',padding:'12px 14px',display:'flex',flexDirection:'column',gap:10 }}>
                  {(litigeMsg[li]||[]).map((m,i)=>(
                    <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:m.isMe?'flex-end':'flex-start' }}>
                      <div style={{ fontSize:11,color:colors.textSecondary,marginBottom:3 }}>{m.author} · {m.time}</div>
                      <div style={{ maxWidth:'80%',padding:'10px 14px',borderRadius:12,fontSize:13,lineHeight:1.5,background:m.isMe?(isDark?'rgba(124,58,237,0.2)':'#ede9fe'):( isDark?'rgba(255,255,255,0.05)':'#f1f5f9'),color:colors.text }}>{m.text}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex',gap:8,padding:'10px 14px',borderTop:`1px solid ${colors.border}` }}>
                  <input value={msgInput} onChange={e=>setMsgInput(e.target.value)} placeholder="Entrer un message..." style={{ flex:1,padding:'8px 12px',borderRadius:8,border:`1px solid ${colors.border}`,background:colors.inputBg,color:colors.text,fontSize:13,outline:'none' }}
                    onKeyDown={e=>{if(e.key==='Enter'&&msgInput.trim()){const msgs=[...litigeMsg];msgs[li]=[...(msgs[li]||[]),{author:'Vous',time:'à l\'instant',text:msgInput.trim(),isMe:true}];setLitigeMsg(msgs);setMsgInput('')}}}/>
                  <button onClick={()=>{if(msgInput.trim()){const msgs=[...litigeMsg];msgs[li]=[...(msgs[li]||[]),{author:'Vous',time:'à l\'instant',text:msgInput.trim(),isMe:true}];setLitigeMsg(msgs);setMsgInput('')}}} style={{ padding:'8px 14px',borderRadius:8,border:'none',background:purple,color:'#fff',fontWeight:700,cursor:'pointer',fontSize:13 }}>→</button>
                </div>
              </div>
              <div style={{ display:'flex',gap:8 }}>
                <Btn onClick={()=>alert('Ouverture du contrat...')} style={{ flex:1,justifyContent:'center' }}>👁️ Voir le contrat</Btn>
                <Btn onClick={()=>alert('Litige marqué comme résolu.')} variant="green" style={{ flex:1,justifyContent:'center' }}>✅ Marquer comme résolu</Btn>
              </div>
            </div>
          )
        })()}
        {!litigeOpen&&<div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:16,padding:'40px',textAlign:'center',color:colors.textSecondary,boxShadow:colors.shadow }}>
          <div style={{ fontSize:32,marginBottom:8 }}>⚖️</div>
          <div style={{ fontSize:14,fontWeight:600 }}>Sélectionnez un litige pour voir les détails</div>
        </div>}
      </div>
    </div>
  )

  // ── SUIVIS ─────────────────────────────────────────────────────────────────
  const renderSuivis = () => (
    <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
      <div style={{ fontSize:16,fontWeight:800,color:colors.text,marginBottom:4 }}>📋 Contrats arrivant à échéance</div>
      <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:8 }}>Contrats arrivant à échéance dans les 90 prochains jours</div>
      {SUIVIS.map(s=>(
        <div key={s.id} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:16,padding:'20px 24px',boxShadow:colors.shadow }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
            <div style={{ fontSize:17,fontWeight:800,color:colors.text }}>{s.title}</div>
            <button onClick={()=>alert('Quel détail souhaitez-vous voir ?')} style={{ padding:'6px 14px',borderRadius:8,border:`1px solid ${colors.border}`,background:'transparent',color:colors.textSecondary,fontSize:12,fontWeight:700,cursor:'pointer' }}>Que détail</button>
          </div>
          <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:12 }}>Partenaire: {s.brand}</div>
          <div style={{ background:isDark?'rgba(245,158,11,0.08)':'#fef9c3',border:`1px solid ${isDark?'rgba(245,158,11,0.2)':'#fde68a'}`,borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:12,color:'#a16207',fontWeight:600 }}>
            ⚠️ Rappel : Ce contrat arrive à échéance le {s.deadline} ({s.joursRestants} jours)
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:16 }}>
            {[{label:'Montant total',val:`${s.montant.toLocaleString()}.00 €`},{label:'Solde restant',val:`${s.solde.toFixed(2)} €`,sub:'Tout soldé'},{label:'Date de début',val:s.debut}].map(m=>(
              <div key={m.label}><div style={{ fontSize:11,color:colors.textSecondary,marginBottom:4 }}>{m.label}</div><div style={{ fontSize:16,fontWeight:800,color:colors.text }}>{m.val}</div>{m.sub&&<div style={{ fontSize:11,color:colors.textSecondary }}>{m.sub}</div>}</div>
            ))}
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16 }}>
            <div style={{ background:isDark?'rgba(255,255,255,0.03)':'#fafafa',border:`1px solid ${colors.border}`,borderRadius:12,padding:'14px' }}>
              <div style={{ fontSize:13,fontWeight:700,color:colors.text,marginBottom:8 }}>📦 Livrables ({s.livrables.length})</div>
              {s.livrables.map((l,i)=><div key={i} style={{ fontSize:12,color:colors.textSecondary,display:'flex',alignItems:'center',gap:6,marginBottom:4 }}><span style={{ color:green }}>○</span>{l}</div>)}
            </div>
            <div style={{ background:isDark?'rgba(239,68,68,0.05)':'#fff5f5',border:`1px solid ${isDark?'rgba(239,68,68,0.15)':'#fecaca'}`,borderRadius:12,padding:'14px' }}>
              <div style={{ fontSize:13,fontWeight:700,color:'#dc2626',marginBottom:8 }}>🚨 Alertes ({s.alertes.length})</div>
              {s.alertes.map((a,i)=><div key={i} style={{ fontSize:12,color:'#dc2626',display:'flex',alignItems:'center',gap:6,marginBottom:4 }}><span>•</span>{a}</div>)}
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:4 }}>Statut paiement</div>
            <ProgressBar value={s.progression} color={purple} isDark={isDark}/>
            <div style={{ fontSize:11,color:colors.textSecondary,textAlign:'right',marginTop:4 }}>En détails</div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 2fr 1fr',gap:8 }}>
            <Btn onClick={()=>alert(`Détails du contrat: ${s.title}`)} style={{ justifyContent:'center' }}>👁️ Voir tous les détails</Btn>
            <Btn onClick={()=>alert('Email de renouvellement envoyé !')} variant="primary" style={{ justifyContent:'center' }}>🔄 Relancer pour renouvellement</Btn>
            <Btn onClick={()=>fakeDownload(`contrat_${s.title.replace(/ /g,'_')}.txt`,`CONTRAT: ${s.title}\nPartenaire: ${s.brand}\nMontant: ${s.montant}€`)} style={{ justifyContent:'center' }}>📥 Télécharger le contrat</Btn>
          </div>
        </div>
      ))}
    </div>
  )

  // ── PAIEMENTS DASHBOARD ────────────────────────────────────────────────────
  const renderPaieDashboard = () => (
    <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
      <div style={{ background:'linear-gradient(135deg,#22c55e,#16a34a)',borderRadius:18,padding:'28px 32px',color:'#fff',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ fontSize:12,opacity:.85,marginBottom:4 }}>Solde disponible</div>
        <div style={{ fontSize:42,fontWeight:900 }}>3 200€</div>
        <div style={{ fontSize:12,marginTop:6,opacity:.85 }}>↑ +52% vs mois dernier</div>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16 }}>
        {[
          { label:'En attente', val:'1 200€', sub:'1 paiement', color:'#f59e0b', icon:'⏳', pct:60 },
          { label:'Bloqués (litiges)', val:'350€', sub:'1 litige actif', color:'#ef4444', icon:'⚠️', pct:15 },
          { label:'Prochain paiement', val:'800€', sub:'Dans moins 5 jours', color:'#06b6d4', icon:'📅', pct:0 },
        ].map(k=>(
          <div key={k.label} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'18px 20px',boxShadow:colors.shadow }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
              <div style={{ fontSize:13,color:colors.textSecondary }}>{k.label}</div>
              <div style={{ width:28,height:28,borderRadius:8,background:k.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>{k.icon}</div>
            </div>
            <div style={{ fontSize:24,fontWeight:900,color:k.color,marginBottom:4 }}>{k.val}</div>
            <div style={{ fontSize:11,color:colors.textSecondary }}>{k.sub}</div>
            {k.pct>0&&<ProgressBar value={k.pct} color={k.color} isDark={isDark}/>}
          </div>
        ))}
      </div>

      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:16,padding:'20px 24px',boxShadow:colors.shadow }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
          <div style={{ fontSize:15,fontWeight:800,color:colors.text }}>📈 Évolution des revenus</div>
          <div style={{ display:'flex',gap:6 }}>
            {['30j','90j','12 mois'].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'5px 12px',borderRadius:8,border:'none',background:period===p?purple:'transparent',color:period===p?'#fff':colors.textSecondary,fontSize:12,fontWeight:700,cursor:'pointer' }}>{p}</button>
            ))}
          </div>
        </div>
        {lineChart()}
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
        {[
          { label:'Total reçu depuis l\'inscription', val:'24 500€', sub:'Depuis janvier 2023', sub2:'↑ +34% cette année', color:purple },
          { label:'Revenu mensuel moyen', val:'2 042€', sub:'Sur les 12 derniers mois', extra:[{k:'Meilleur mois',v:'4 800€'},{k:'Plus bas',v:'2 400€'}], color:purple },
        ].map(k=>(
          <div key={k.label} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'20px',boxShadow:colors.shadow }}>
            <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:6 }}>{k.label}</div>
            <div style={{ fontSize:30,fontWeight:900,color:k.color,marginBottom:4 }}>{k.val}</div>
            <div style={{ fontSize:12,color:colors.textSecondary }}>{k.sub}</div>
            {k.sub2&&<div style={{ fontSize:12,color:green,marginTop:4 }}>{k.sub2}</div>}
            {k.extra&&<div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12 }}>
              {k.extra.map(e=><div key={e.k} style={{ background:isDark?'rgba(255,255,255,0.03)':'#fafafa',borderRadius:8,padding:'8px 10px' }}><div style={{ fontSize:10,color:colors.textSecondary }}>{e.k}</div><div style={{ fontSize:14,fontWeight:700,color:colors.text }}>{e.v}</div></div>)}
            </div>}
          </div>
        ))}
      </div>

      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'18px 20px',boxShadow:colors.shadow }}>
        <div style={{ fontSize:14,fontWeight:800,color:colors.text,marginBottom:14 }}>👁️ Aperçu rapide</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12 }}>
          {[{label:'Taux de paiement',val:'98%',sub:'Excellent'},{label:'Délai moyen',val:'3.2j',sub:'Très rapide'},{label:'Collaborations',val:'42',sub:'Ce mois-ci'},{label:'Marques uniques',val:'18',sub:'Partenaires actifs'}].map(s=>(
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:20,fontWeight:900,color:purple }}>{s.val}</div>
              <div style={{ fontSize:11,color:colors.textSecondary,marginTop:2 }}>{s.label}</div>
              <div style={{ fontSize:11,color:green,marginTop:2 }}>↑ {s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── TRANSACTIONS ───────────────────────────────────────────────────────────
  const renderTransactions = () => (
    <div>
      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'16px 20px',marginBottom:16,boxShadow:colors.shadow }}>
        <div style={{ fontSize:16,fontWeight:800,color:colors.text,marginBottom:4 }}>📋 Historique des transactions</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:14 }}>Vue chronologique complète de tous vos paiements</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
          {[{label:'Total transactions',val:'3'},{label:'Montant total',val:'2 500€'},{label:'Ce mois',val:'2 500€'}].map(k=>(
            <div key={k.label} style={{ background:isDark?'rgba(255,255,255,0.03)':'#fafafa',borderRadius:10,padding:'12px' }}>
              <div style={{ fontSize:11,color:colors.textSecondary }}>{k.label}</div>
              <div style={{ fontSize:18,fontWeight:900,color:colors.text }}>{k.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex',gap:10,marginBottom:16 }}>
        <div style={{ flex:1,position:'relative' }}>
          <input placeholder="Rechercher par campagne, marque ou ID..." style={{ width:'100%',padding:'10px 14px 10px 36px',borderRadius:10,border:`1px solid ${colors.border}`,background:colors.inputBg,color:colors.text,fontSize:13,outline:'none',boxSizing:'border-box' }}/>
          <span style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:colors.textSecondary }}>🔍</span>
        </div>
        <Btn onClick={()=>fakeDownload('transactions_export.csv','id,titre,marque,date,montant,statut\n1,Campagne Beauté,GreenBeauty,2024-02-15,800,Payé\n2,Tech Review,TechFlow,2024-02-20,500,En cours\n3,Fashion Week,FashionNova,2024-02-18,1200,Validation')} variant="primary">📤 Exporter</Btn>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
        {TRANSACTIONS.map(t=>(
          <div key={t.id} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'16px 20px',boxShadow:colors.shadow }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <div style={{ width:36,height:36,borderRadius:10,background:purpleLight,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>📄</div>
                <div>
                  <div style={{ fontSize:14,fontWeight:800,color:colors.text }}>{t.title}</div>
                  <div style={{ fontSize:12,color:colors.textSecondary,marginTop:2 }}>@ {t.brand} · 📅 {t.date}</div>
                  <div style={{ display:'flex',gap:6,marginTop:6 }}>
                    {[t.trx,t.inv].map(tag=><span key={tag} style={{ fontSize:10,background:isDark?'rgba(255,255,255,0.06)':'#f1f5f9',color:colors.textSecondary,padding:'2px 8px',borderRadius:6,fontWeight:600 }}>{tag}</span>)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:20,fontWeight:900,color:colors.text }}>{t.amount.toLocaleString()}€</div>
                <StatusBadge status={t.status}/>
              </div>
            </div>
            <div style={{ display:'flex',gap:8,marginTop:10 }}>
              <Btn onClick={()=>fakeDownload(`facture_${t.inv}.txt`,`FACTURE PARTNEXX\n\nNuméro: ${t.inv}\nTransaction: ${t.trx}\nCampagne: ${t.title}\nMarque: ${t.brand}\nDate: ${t.date}\nMontant: ${t.amount}€\nStatut: ${t.status}\n\nMerci de votre confiance.`)} style={{ gap:6 }}>📥 Télécharger la facture</Btn>
              <Btn onClick={()=>alert(`Détails\n\nCampagne: ${t.title}\nMarque: ${t.brand}\nDate: ${t.date}\nMontant: ${t.amount}€\nStatut: ${t.status}`)} style={{ gap:6 }}>📋 Détails</Btn>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:isDark?'rgba(34,197,94,0.08)':'#f0fdf4',border:`1px solid ${isDark?'rgba(34,197,94,0.2)':'#bbf7d0'}`,borderRadius:12,padding:'14px 20px',marginTop:16,display:'flex',alignItems:'center',gap:10 }}>
        <span style={{ fontSize:20 }}>🔒</span>
        <div style={{ fontSize:13,color:colors.textSecondary }}>Paiement escrow sécurisé — Tous vos paiements sont protégés par notre système d'escrow. Les fonds sont conservés en sécurité jusqu'à la validation complète de vos livrables. Vous êtes protégé contre les impayés.</div>
      </div>
    </div>
  )

  // ── FONDS EN ATTENTE ───────────────────────────────────────────────────────
  const renderFonds = () => (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div style={{ background:isDark?'rgba(245,158,11,0.08)':'#fffbeb',border:`1px solid ${isDark?'rgba(245,158,11,0.2)':'#fde68a'}`,borderRadius:14,padding:'20px 24px' }}>
        <div style={{ fontSize:15,fontWeight:800,color:'#a16207',marginBottom:4 }}>⏳ Fonds en attente</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:12 }}>Montants temporairement bloqués</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16 }}>
          {[{label:'Total en attente',val:'1 550€',color:'#f59e0b'},{label:'Validation',val:'1 200€',color:'#f59e0b'},{label:'Litige',val:'350€',color:'#ef4444'}].map(k=>(
            <div key={k.label}><div style={{ fontSize:11,color:colors.textSecondary,marginBottom:4 }}>{k.label}</div><div style={{ fontSize:22,fontWeight:900,color:k.color }}>{k.val}</div></div>
          ))}
        </div>
      </div>

      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'20px',boxShadow:colors.shadow }}>
        <div style={{ fontSize:14,fontWeight:800,color:colors.text,marginBottom:12 }}>⏳ En attente de validation</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:14 }}>Livrables en cours d'examen par les marques</div>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:8,background:'rgba(245,158,11,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>💶</div>
            <div><div style={{ fontSize:16,fontWeight:900,color:colors.text }}>1 200€</div><div style={{ fontSize:12,color:colors.textSecondary }}>@ FashionNova</div></div>
          </div>
          <Btn onClick={()=>alert('En attente de validation par FashionNova. Délai estimé: 48h.')} style={{ gap:6 }}>En détails</Btn>
        </div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:6 }}>📋 Campagne: Fashion Week Coverage &nbsp;&nbsp; 📅 Validation estimée: 2024-03-01</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:6 }}>Progression de validation</div>
        <ProgressBar value={78} color='#f59e0b' isDark={isDark}/>
        <div style={{ textAlign:'right',fontSize:11,color:'#f59e0b',marginTop:4 }}>78%</div>
      </div>

      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'20px',boxShadow:colors.shadow }}>
        <div style={{ fontSize:14,fontWeight:800,color:'#dc2626',marginBottom:12 }}>⚖️ Litiges actifs</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:14 }}>Paiements nécessitant une résolution</div>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:8,background:'rgba(239,68,68,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>⚖️</div>
            <div><div style={{ fontSize:16,fontWeight:900,color:'#ef4444' }}>350€</div><div style={{ fontSize:12,color:colors.textSecondary }}>@ BeautyLux</div></div>
          </div>
          <span style={{ fontSize:11,background:'#fee2e2',color:'#dc2626',padding:'3px 10px',borderRadius:20,fontWeight:700 }}>Litige actif</span>
        </div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:4 }}>📋 Motif: Metrics non atteints</div>
        <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:14 }}>
          <span style={{ fontSize:12,color:colors.textSecondary }}>État actuel:</span>
          <StatusBadge status="Médiation"/>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
          <Btn onClick={()=>alert('Détails du litige:\n\nMontant: 350€\nMarque: BeautyLux\nMotif: Metrics non atteints\nStatut: Médiation en cours')} style={{ justifyContent:'center' }}>Voir les détails</Btn>
          <Btn onClick={()=>alert('Mise en relation avec le support Partnexx...')} variant="primary" style={{ justifyContent:'center' }}>📞 Contacter le support</Btn>
        </div>
      </div>

      <div style={{ background:isDark?'rgba(59,130,246,0.08)':'#eff6ff',border:`1px solid ${isDark?'rgba(59,130,246,0.2)':'#bfdbfe'}`,borderRadius:12,padding:'16px 20px' }}>
        <div style={{ fontSize:13,fontWeight:800,color:'#2563eb',marginBottom:8 }}>🛡️ Protection escrow activée</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:8 }}>Les fonds en attente sont sécurisés dans notre système d'escrow. Ils seront automatiquement libérés dès la validation de vos livrables ou la résolution des litiges.</div>
        {['Protection contre les impayés','Médiation en cas de litige','Support dédié 24/7'].map(p=>(
          <div key={p} style={{ display:'flex',alignItems:'center',gap:6,fontSize:12,color:green,marginTop:4 }}>
            <span>✓</span>{p}
          </div>
        ))}
      </div>
    </div>
  )

  // ── RETRAITS ───────────────────────────────────────────────────────────────
  const renderRetraits = () => (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)',borderRadius:16,padding:'24px 28px',color:'#fff',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16 }}>
          <div style={{ fontSize:18,fontWeight:800 }}>💸 Retraits & Versements</div>
          <Btn onClick={()=>alert('Ajout d\'une méthode de paiement...')} variant="primary" color="#fff" style={{ background:'rgba(255,255,255,0.2)',color:'#fff',border:'none' }}>+ Ajouter une méthode</Btn>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16 }}>
          {[{label:'Disponible au retrait',val:'3 200€'},{label:'Retraits ce mois',val:'2'},{label:'Total retiré',val:'3 200€'}].map(k=>(
            <div key={k.label}><div style={{ fontSize:11,opacity:.8,marginBottom:4 }}>{k.label}</div><div style={{ fontSize:22,fontWeight:900 }}>{k.val}</div></div>
          ))}
        </div>
      </div>

      <div style={{ fontSize:14,fontWeight:800,color:colors.text }}>💳 Vos méthodes de retrait</div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
        {[
          { name:'Compte Principal', detail:'FR76 **** **** **** 1234', default:true, icon:'🏦' },
          { name:'PayPal', detail:'user@email.com', default:false, icon:'💙' },
        ].map(m=>(
          <div key={m.name} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'16px 20px',boxShadow:colors.shadow }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10 }}>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <div style={{ width:36,height:36,borderRadius:10,background:purpleLight,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>{m.icon}</div>
                <div><div style={{ fontSize:13,fontWeight:700,color:colors.text }}>{m.name}</div><div style={{ fontSize:12,color:colors.textSecondary }}>{m.detail}</div></div>
              </div>
              {m.default&&<span style={{ fontSize:10,background:'#dcfce7',color:'#15803d',padding:'2px 8px',borderRadius:20,fontWeight:700 }}>Par défaut</span>}
            </div>
            <Btn onClick={()=>alert(`Modification de ${m.name}...`)} style={{ gap:6 }}>✏️ Modifier</Btn>
          </div>
        ))}
      </div>

      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'20px',boxShadow:colors.shadow }}>
        <div style={{ fontSize:14,fontWeight:800,color:green,marginBottom:12 }}>⚡ Retrait immédiat</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:16 }}>Transférez votre solde disponible maintenant</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16 }}>
          {[{label:'Solde disponible',val:'3 200€'},{label:'Méthode du retrait',val:'Compte Principal'},{label:'Frais de transaction',val:'0€'},{label:'Délai de traitement',val:'2-3 jours ouvrés'}].map(k=>(
            <div key={k.label} style={{ display:'flex',justifyContent:'space-between',fontSize:13 }}>
              <span style={{ color:colors.textSecondary }}>{k.label}</span>
              <span style={{ fontWeight:700,color:colors.text }}>{k.val}</span>
            </div>
          ))}
        </div>
        <Btn onClick={()=>alert('Retrait de 3 200€ initié !\nLes fonds seront virés dans 2-3 jours ouvrés sur votre Compte Principal.')} variant="green" style={{ width:'100%',justifyContent:'center',padding:'14px' }}>→ Retirer 3 200€ maintenant</Btn>
        <div style={{ fontSize:11,color:colors.textSecondary,textAlign:'center',marginTop:8 }}>Les retraits sont traités en 2-3 jours ouvrés · Aucun frais</div>
      </div>

      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'20px',boxShadow:colors.shadow }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
          <div style={{ fontSize:14,fontWeight:800,color:colors.text }}>🔄 Retrait automatique mensuel</div>
          <span style={{ fontSize:11,background:isDark?'rgba(34,197,94,0.15)':'#dcfce7',color:green,padding:'3px 10px',borderRadius:20,fontWeight:700 }}>Bientôt disponible</span>
        </div>
        <div style={{ fontSize:12,color:colors.textSecondary }}>Programmez des retraits automatiques vers votre compte chaque mois. Définissez un montant maximum et une date de versement préférée.</div>
      </div>

      <div style={{ fontSize:14,fontWeight:800,color:colors.text }}>📋 Historique des retraits</div>
      {HISTORIQUE_RETRAITS.map((r,i)=>(
        <div key={i} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:12,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:colors.shadow }}>
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <div style={{ width:34,height:34,borderRadius:8,background:'rgba(34,197,94,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>↙️</div>
            <div><div style={{ fontSize:14,fontWeight:700,color:colors.text }}>{r.amount}</div><div style={{ fontSize:12,color:colors.textSecondary }}>{r.account}</div></div>
          </div>
          <div style={{ textAlign:'right' }}>
            <StatusBadge status={r.status}/>
            <div style={{ fontSize:11,color:colors.textSecondary,marginTop:4 }}>✓ {r.date}</div>
          </div>
        </div>
      ))}

      <div style={{ background:isDark?'rgba(59,130,246,0.08)':'#eff6ff',border:`1px solid ${isDark?'rgba(59,130,246,0.2)':'#bfdbfe'}`,borderRadius:12,padding:'16px 20px' }}>
        <div style={{ fontSize:13,fontWeight:800,color:'#2563eb',marginBottom:6 }}>🔒 Vos retraits sont sécurisés</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:8 }}>Toutes les transactions sont chiffrées et vérifiées. Vos données financières sont protégées selon les normes PCI DSS.</div>
        {['Cryptage SSL/TLS','Conforme PCI DSS','Authentification à deux facteurs'].map(p=>(
          <div key={p} style={{ display:'flex',alignItems:'center',gap:6,fontSize:12,color:green,marginTop:4 }}>✓ {p}</div>
        ))}
      </div>
    </div>
  )

  // ── FISCALITÉ ──────────────────────────────────────────────────────────────
  const renderFiscalite = () => (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div style={{ background:isDark?'rgba(124,58,237,0.08)':'#faf5ff',border:`1px solid ${isDark?'rgba(124,58,237,0.2)':'#e9d5ff'}`,borderRadius:14,padding:'20px 24px' }}>
        <div style={{ fontSize:15,fontWeight:800,color:purple,marginBottom:4 }}>🧾 Espace Fiscalité</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:12 }}>Tous vos documents fiscaux au même endroit</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
          <div><div style={{ fontSize:11,color:colors.textSecondary }}>Revenus déclarables</div><div style={{ fontSize:22,fontWeight:900,color:purple }}>24 500€</div></div>
          <div><div style={{ fontSize:11,color:colors.textSecondary }}>Transactions globales</div><div style={{ fontSize:22,fontWeight:900,color:colors.text }}>24</div></div>
        </div>
      </div>

      <div style={{ fontSize:14,fontWeight:800,color:colors.text }}>📅 Récapitulatif par année</div>
      {[
        { year:'2024', sub:'Janvier - Décembre 2024', total:'24 500€', stats:[{k:'Transactions',v:'42'},{k:'Marques partenaires',v:'18'},{k:'Revenu mensuel moyen',v:'2 042€'}] },
        { year:'2023', sub:'Janvier - Décembre 2023', total:'18 200€', stats:[{k:'Transactions',v:'21'},{k:'Marques partenaires',v:'9'}] },
      ].map(y=>(
        <div key={y.year} style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'20px',boxShadow:colors.shadow }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
            <div>
              <div style={{ fontSize:18,fontWeight:900,color:colors.text }}>{y.year} <span style={{ fontSize:11,background:green+'22',color:green,padding:'2px 8px',borderRadius:20,fontWeight:700 }}>Clôturé</span></div>
              <div style={{ fontSize:11,color:colors.textSecondary }}>{y.sub}</div>
            </div>
            <div style={{ fontSize:22,fontWeight:900,color:purple }}>{y.total}</div>
          </div>
          {y.stats.map(s=><div key={s.k} style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:colors.textSecondary,marginBottom:4 }}><span>{s.k}</span><span style={{ fontWeight:700,color:colors.text }}>{s.v}</span></div>)}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:14 }}>
            <Btn onClick={()=>fakeDownload(`attestation_fiscale_${y.year}.txt`,`ATTESTATION FISCALE PARTNEXX\n\nAnnée: ${y.year}\nRevenus déclarés: ${y.total}\n\nCe document certifie les revenus perçus via la plateforme Partnexx.`)} variant="primary" style={{ justifyContent:'center' }}>📄 Attestation Fiscale {y.year}</Btn>
            <Btn onClick={()=>fakeDownload(`export_detaille_${y.year}.csv`,`date,marque,campagne,montant\n2024-01-15,GreenBeauty,Skincare,800\n2024-02-20,TechFlow,Review,500`)} style={{ justifyContent:'center' }}>📊 Export détaillé</Btn>
          </div>
        </div>
      ))}

      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'20px',boxShadow:colors.shadow }}>
        <div style={{ fontSize:14,fontWeight:800,color:colors.text,marginBottom:12 }}>📤 Exports personnalisés</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:14 }}>Téléchargez vos données dans différents formats</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
          {[
            { fmt:'Excel (.xlsx)', icon:'📊', desc:'Tableau complet pour comptable' },
            { fmt:'CSV', icon:'📋', desc:'Format universel importable' },
            { fmt:'PDF', icon:'📄', desc:'Document imprimable officiel' },
          ].map(e=>(
            <div key={e.fmt} onClick={()=>fakeDownload(`export_partnexx.${e.fmt.includes('xlsx')?'xlsx':e.fmt.includes('CSV')?'csv':'pdf'}`,`Export Partnexx - ${e.fmt}`)} style={{ background:isDark?'rgba(255,255,255,0.03)':'#fafafa',border:`1px solid ${colors.border}`,borderRadius:12,padding:'14px',textAlign:'center',cursor:'pointer',transition:'border-color .2s' }}
              onMouseEnter={e2=>e2.currentTarget.style.borderColor=purple}
              onMouseLeave={e2=>e2.currentTarget.style.borderColor=colors.border}>
              <div style={{ fontSize:24,marginBottom:6 }}>{e.icon}</div>
              <div style={{ fontSize:12,fontWeight:700,color:colors.text }}>{e.fmt}</div>
              <div style={{ fontSize:11,color:colors.textSecondary,marginTop:2 }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:colors.cardBg,border:`1px solid ${colors.border}`,borderRadius:14,padding:'20px',boxShadow:colors.shadow }}>
        <div style={{ fontSize:14,fontWeight:800,color:colors.text,marginBottom:12 }}>📑 Documents officiels</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:14 }}>Justificatifs conformes aux normes fiscales françaises</div>
        {[
          { name:"Attestation de revenus 2024", sub:"Document certifié conforme" },
          { name:"Récapitulatif mensuel 2024", sub:"Détail mois par mois" },
          { name:"Factures et reçus", sub:"Archive complète" },
        ].map(d=>(
          <div key={d.name} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:`1px solid ${colors.border}` }}>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:colors.text }}>{d.name}</div>
              <div style={{ fontSize:11,color:colors.textSecondary }}>{d.sub}</div>
            </div>
            <button onClick={()=>fakeDownload(`${d.name.replace(/ /g,'_')}.pdf`,`${d.name}\n\nDocument généré par Partnexx.`)} style={{ padding:'6px 14px',borderRadius:8,border:`1px solid ${colors.border}`,background:'transparent',color:purple,fontSize:12,fontWeight:700,cursor:'pointer' }}>📥 Télécharger</button>
          </div>
        ))}
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
        <div style={{ background:isDark?'rgba(124,58,237,0.06)':'#faf5ff',border:`1px solid ${isDark?'rgba(124,58,237,0.15)':'#e9d5ff'}`,borderRadius:14,padding:'18px' }}>
          <div style={{ fontSize:14,fontWeight:800,color:purple,marginBottom:10 }}>🤖 Assistant fiscal IA</div>
          <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:10 }}>Obtenez des réponses personnalisées sur votre situation fiscale</div>
          {['Auto-entrepreneur / Micro-entreprise','Particulier sans statut','Société (SAS, SARL...)'].map(s=>(
            <div key={s} onClick={()=>alert(`Conseil IA pour: ${s}\n\nNous analysons votre profil et vous fournissons des conseils personnalisés.`)} style={{ padding:'8px 12px',borderRadius:8,fontSize:12,color:purple,background:'transparent',border:`1px solid ${isDark?'rgba(124,58,237,0.2)':'#e9d5ff'}`,marginBottom:6,cursor:'pointer' }}>
              → {s}
            </div>
          ))}
        </div>
        <div style={{ background:isDark?'rgba(245,158,11,0.06)':'#fffbeb',border:`1px solid ${isDark?'rgba(245,158,11,0.2)':'#fde68a'}`,borderRadius:14,padding:'18px' }}>
          <div style={{ fontSize:14,fontWeight:800,color:'#a16207',marginBottom:10 }}>⚠️ Rappels importants</div>
          {[
            { label:'Déclaration annuelle', sub:'Avant le 31 mars', urgent:true },
            { label:'Cotisation sociale', sub:'Trimestrielle', urgent:false },
            { label:'TVA', sub:'Mensuelle si applicable', urgent:false },
          ].map(r=>(
            <div key={r.label} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${isDark?'rgba(245,158,11,0.15)':'#fde68a'}` }}>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:colors.text }}>{r.label}</div>
                <div style={{ fontSize:11,color:colors.textSecondary }}>{r.sub}</div>
              </div>
              {r.urgent&&<span style={{ fontSize:10,background:'#fee2e2',color:'#dc2626',padding:'2px 8px',borderRadius:20,fontWeight:700 }}>Urgent</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:isDark?'rgba(34,197,94,0.06)':'#f0fdf4',border:`1px solid ${isDark?'rgba(34,197,94,0.2)':'#bbf7d0'}`,borderRadius:12,padding:'16px 20px' }}>
        <div style={{ fontSize:13,fontWeight:800,color:green,marginBottom:6 }}>📘 Guide : Comment déclarer vos revenus d'influenceur ?</div>
        <div style={{ fontSize:12,color:colors.textSecondary,marginBottom:10 }}>Ce guide complet vous accompagne pas à pas dans vos obligations fiscales en tant qu'influenceur.</div>
        <Btn onClick={()=>fakeDownload('guide_fiscalite_influenceur.pdf','GUIDE FISCALITÉ INFLUENCEUR\n\nPartnexx vous accompagne dans vos déclarations fiscales.\n\n1. Choisir votre statut\n2. Déclarer vos revenus\n3. Gérer la TVA\n4. Optimiser votre situation\n\nContactez notre support pour plus d\'informations.')} variant="green" style={{ gap:6 }}>📥 Télécharger le guide PDF</Btn>
      </div>
    </div>
  )

  // ── RENDER ─────────────────────────────────────────────────────────────────

  const CONTRAT_SUBS = [
    { key:'dashboard', label:'Dashboard', icon:'📊' },
    { key:'actuels', label:'Contrats actuels', icon:'📄' },
    { key:'litiges', label:'Litiges', icon:'⚠️' },
    { key:'suivis', label:'Suivis', icon:'📈' },
  ]
  const PAIE_SUBS = [
    { key:'dashboard', label:'Dashboard', icon:'📊' },
    { key:'transactions', label:'Transactions', icon:'📋' },
    { key:'fonds', label:'Fonds en attente', icon:'⏳' },
    { key:'retraits', label:'Retraits', icon:'💸' },
    { key:'fiscalite', label:'Fiscalité', icon:'🧾' },
  ]

  return (
    <div style={{ padding:'28px 32px', fontFamily:"'Plus Jakarta Sans',sans-serif", background:colors.bg, minHeight:'100vh', color:colors.text }}>
      {/* HEADER */}
      <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:6 }}>
        <div style={{ fontSize:26,fontWeight:900,color:colors.text }}>Contrats & Paiements</div>
        <div style={{ display:'flex',alignItems:'center',gap:6,background:isDark?'rgba(124,58,237,0.2)':'#ede9fe',padding:'4px 12px',borderRadius:20 }}>
          <div style={{ width:7,height:7,borderRadius:'50%',background:'#7c3aed' }}/>
          <span style={{ fontSize:12,fontWeight:700,color:purple }}>IA actif</span>
        </div>
      </div>
      <div style={{ fontSize:13,color:colors.textSecondary,marginBottom:24 }}>Gestion Contractuelle · Suivi des Paiements · Historique Complet</div>

      {/* MAIN TABS */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,borderRadius:14,overflow:'hidden',border:`1px solid ${colors.border}`,marginBottom:16 }}>
        <button onClick={()=>setMainTab('contrats')} style={{ padding:'14px',border:'none',background:mainTab==='contrats'?'#3b82f6':'transparent',color:mainTab==='contrats'?'#fff':colors.textSecondary,fontWeight:700,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .2s' }}>
          📄 Contrats
        </button>
        <button onClick={()=>setMainTab('paiements')} style={{ padding:'14px',border:'none',background:mainTab==='paiements'?green:'transparent',color:mainTab==='paiements'?'#fff':colors.textSecondary,fontWeight:700,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .2s' }}>
          💳 Paiements
        </button>
      </div>

      {/* SUB TABS */}
      <div style={{ display:'grid',gridTemplateColumns:`repeat(${mainTab==='contrats'?4:5},1fr)`,gap:0,borderRadius:12,overflow:'hidden',border:`1px solid ${colors.border}`,marginBottom:24 }}>
        {(mainTab==='contrats'?CONTRAT_SUBS:PAIE_SUBS).map(t=>{
          const active = mainTab==='contrats' ? contratSub===t.key : paieSub===t.key
          return (
            <button key={t.key} onClick={()=>mainTab==='contrats'?setContratSub(t.key):setPaieSub(t.key)} style={{ padding:'11px 8px',border:'none',background:active?(mainTab==='contrats'?'#3b82f6':green):'transparent',color:active?'#fff':colors.textSecondary,fontWeight:700,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,transition:'all .2s',borderRight:`1px solid ${colors.border}` }}>
              {t.icon} {t.label}
            </button>
          )
        })}
      </div>

      {/* CONTENT */}
      {mainTab==='contrats' && contratSub==='dashboard'    && renderContratsDashboard()}
      {mainTab==='contrats' && contratSub==='actuels'      && renderContratsActuels()}
      {mainTab==='contrats' && contratSub==='litiges'      && renderLitiges()}
      {mainTab==='contrats' && contratSub==='suivis'       && renderSuivis()}
      {mainTab==='paiements' && paieSub==='dashboard'      && renderPaieDashboard()}
      {mainTab==='paiements' && paieSub==='transactions'   && renderTransactions()}
      {mainTab==='paiements' && paieSub==='fonds'          && renderFonds()}
      {mainTab==='paiements' && paieSub==='retraits'       && renderRetraits()}
      {mainTab==='paiements' && paieSub==='fiscalite'      && renderFiscalite()}
    </div>
  )
}