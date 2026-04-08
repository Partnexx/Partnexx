'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function Contracts() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [litigeTab, setLitigeTab] = useState('open')
  const [contratsTab, setContratsTab] = useState('actifs')
  const [selectedContract, setSelectedContract] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    getUser()
  }, [])

  const metrics = [
    { label: 'Valeur totale', value: '36 500,00 €', sub: '↗ +12% ce mois' },
    { label: 'Contrats actifs', value: '1', sub: '👥 1 en signature' },
    { label: 'Score IA moyen', value: '87%', sub: '⊙ Qualité excellente' },
    { label: 'Litiges ouverts', value: '3', sub: '✦ Médiation IA active' },
  ]

  const contratsCreés = [
    { id: 1, name: 'Contrat Placement de Produit - uhgyftg', type: 'Personnalisé', amount: '4 000,00 €', livrables: 4, date: '28/03/2026', sent: false },
    { id: 2, name: 'Contrat UGC - hghhhhhh', type: 'UGC', amount: '3 000,00 €', livrables: 3, date: '15/11/2025', sent: false },
    { id: 3, name: 'Contrat Ambassadeur - ujhgf', type: 'Ambassadeur', amount: '18 000,00 €', livrables: 4, date: '11/11/2025', sent: true, to: 'Alexandre Dubois', campaign: 'Programme Ambassadeurs Tech 2024', sentDate: '11/11/2025' },
  ]

  const allContrats = [
    { name: 'Contrat UGC Q3', campaign: 'Back to School 2025', expire: '30/09/2025', partner: 'Luna Studio', escrow: 'Bloqué', escrowColor: '#3b82f6', score: 94, risk: 'Faible', riskColor: '#22c55e', status: 'En signature', statusColor: '#a855f7', amount: '5 000,00 €' },
    { name: 'Ambassadeur 12 mois', campaign: 'Ambassadeurs Elite 2025', expire: '15/01/2026', partner: 'Max&Co', escrow: 'Partiel', escrowColor: '#f59e0b', score: 87, risk: 'Moyen', riskColor: '#f59e0b', status: 'Signé', statusColor: '#22c55e', amount: '18 000,00 €' },
    { name: 'Op Noël 2025', campaign: 'Magie de Noël 2025', expire: '20/12/2025', partner: 'Nova Media', escrow: 'En attente', escrowColor: '#a0aec0', score: 72, risk: 'Élevé', riskColor: '#ef4444', status: 'Brouillon', statusColor: '#718096', amount: '9 000,00 €' },
  ]

  const allContratsArchives = [
    { name: 'Summer Vibes 2024', campaign: 'Summer Collection 2024', expire: '30/08/2024', partner: 'Bloom Beauty', escrow: 'Libéré', escrowColor: '#22c55e', score: 96, risk: 'Faible', riskColor: '#22c55e', status: 'Archive', statusColor: '#718096', amount: '4 500,00 €' },
  ]

  const litiges = [
    {
      id: 1,
      title: 'Non-respect des guidelines de marque',
      status: 'Médiation',
      statusColor: '#a855f7',
      contract: 'Contrat UGC Q3',
      partner: 'Luna Studio',
      type: 'Non-conformité du contenu',
      opened: '27 août 2025',
      desc: "Le contenu livré ne respecte pas les guidelines de la marque : couleurs non conformes, logo mal positionné, et tonalité trop informelle.",
      files: ['guidelines.pdf', 'contenu_livré.jpg', 'exemple_attendu.jpg'],
      iaReco: "Organiser une session de briefing supplémentaire et valider le mood board avant production.",
      mediationActive: true,
      messages: [
        { sender: 'Vous', text: "Bonjour, le contenu livré ne correspond pas à nos guidelines. Nous avons besoin d'une révision complète. Voir les documents joints pour comparaison.", time: '11h24 min', color: '#a855f7', isMe: true },
        { sender: 'Luna Studio', text: "Je comprends votre point de vue, mais j'ai respecté le brief initial. Les guidelines n'étaient pas aussi détaillées lors du briefing.", time: '12h03 min', color: '#6366f1', isMe: false },
        { sender: 'Vous', text: "Le document de guidelines a été envoyé dès le début du contrat. Nous ne pouvons pas accepter ce contenu en l'état.", time: '13h45 min', color: '#a855f7', isMe: true },
        { sender: 'Robot Partnexx', text: "Bonjour, je suis Sophie de l'équipe Partnexx. J'ai étudié le dossier. Proposition : l'influenceur refait le contenu en suivant les guidelines détaillées que nous allons co-créer.", time: '14h20 min', color: '#ec4899', isMe: false },
      ]
    },
    {
      id: 2,
      title: 'Conditions de paiement - Live shopping',
      status: 'Discussion',
      statusColor: '#f59e0b',
      contract: 'Op Noël 2025',
      partner: 'Nova Media',
      type: 'Désaccord de paiement',
      opened: '24 août 2025',
      deadline: '72h restantes',
      desc: "Négociation des conditions de paiement pour le live shopping. L'influenceur demande un paiement anticipé de 50% alors que le contrat prévoit 30%.",
      files: ['contrat_initial.pdf'],
      iaReco: "Proposer un paiement échelonné : 30% à la signature, 40% à mi-parcours, 30% à la livraison.",
      mediationActive: false,
      messages: [
        { sender: 'Nova Media', text: "Bonjour, pour le live shopping de Noël, j'aurais besoin d'un avance de 50% au lieu de 30%. J'ai des frais importants à engager (studio, équipe technique, préparation).", time: '09h15 min', color: '#6366f1', isMe: false },
        { sender: 'Vous', text: "Bonjour, nous comprenons votre besoin mais notre politique est de verser 30% à la signature. C'est notre standard pour tous les contrats.", time: '10h30 min', color: '#a855f7', isMe: true },
        { sender: 'Nova Media', text: "Je comprends, mais ce live shopping demande beaucoup plus de préparation qu'un post classique. Peut-on trouver un compromis ? 45% par exemple ?", time: '11h00 min', color: '#6366f1', isMe: false },
        { sender: 'Vous', text: "Laissez-nous étudier cette demande. Nous reviendrons vers vous rapidement.", time: '11h45 min', color: '#a855f7', isMe: true },
      ]
    }
  ]

  const litigesClos = [
    { title: 'Retard de contenu - Semaine 32', status: 'Clos', contract: 'Ambassadeur 12 mois', opened: '10/08/2025', closed: '20/08/2025', decision: "Résolu à l'amiable - livraison effectuée avec 1 jour de retard", type: 'Retard de livraison', priority: 'Moyenne', messages: 4, partner: 'Max&Co' }
  ]

  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif" }
  const inp = { width: '100%', padding: '0.6rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }

  return (
    <div style={{ ...s, background: '#f8f9ff', minHeight: '100vh', padding: '2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* MODAL CONTRAT */}
      {selectedContract && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Contrat UGC Q3</h3>
              <button onClick={() => setSelectedContract(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#a0aec0' }}>✕</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Campagne</span>
                <span style={{ background: '#f4f4f5', color: '#71717a', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>UGC</span>
                <span style={{ background: '#f4f4f5', color: '#71717a', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Score IA: 94%</span>
                <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Faible</span>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>📋 Informations générales</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div><div style={{ color: '#a0aec0', fontSize: '0.75rem' }}>Partenaire</div><div style={{ fontWeight: 500 }}>Luna Studio</div></div>
                  <div><div style={{ color: '#a0aec0', fontSize: '0.75rem' }}>Montant total</div><div style={{ fontWeight: 500, color: '#a855f7' }}>5 000,00 €</div></div>
                  <div><div style={{ color: '#a0aec0', fontSize: '0.75rem' }}>Date de début</div><div style={{ fontWeight: 500 }}>25 août 2025</div></div>
                  <div><div style={{ color: '#a0aec0', fontSize: '0.75rem' }}>Date de fin</div><div style={{ fontWeight: 500 }}>30 septembre 2025</div></div>
                  <div><div style={{ color: '#a0aec0', fontSize: '0.75rem' }}>Campagne associée</div><div style={{ fontWeight: 500, color: '#3b82f6', fontSize: '0.82rem' }}>🔗 Back to School 2025</div></div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>💰 Budget et paiements</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.82rem' }}><div style={{ color: '#a0aec0', fontSize: '0.72rem' }}>Budget total</div><div style={{ fontWeight: 600 }}>5 000,00 €</div></div>
                  <div style={{ fontSize: '0.82rem' }}><div style={{ color: '#a0aec0', fontSize: '0.72rem' }}>Montant libéré</div><div style={{ fontWeight: 600, color: '#a855f7' }}>1 500,00 €</div></div>
                  <div style={{ fontSize: '0.82rem' }}><div style={{ color: '#a0aec0', fontSize: '0.72rem' }}>Statut escrow</div><div style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>Bloqué</div></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginBottom: '0.3rem' }}>Progression des paiements · 30%</div>
                <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: '30%', background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '3px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>📦 Livrables (3)</div>
                {['3 posts Instagram', '1 story', 'Reporting engagement'].map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>{l}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>⏰ Jalons (3)</div>
                {[['Validation brief/moodboard', '15 août 2025', 'Semaine'], ['Publication posts', '15 septembre 2025'], ['Livraison reporting', '30 septembre 2025']].map(([label, date], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none', fontSize: '0.82rem' }}>
                    <span>{label}</span>
                    <span style={{ background: '#f4f4f5', color: '#718096', fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{date}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#ef4444' }}>⚠️</span>
                  <span style={{ fontWeight: 600, color: '#ef4444', fontSize: '0.82rem' }}>Échéance : Ce contrat arrive à échéance dans 15 jours</span>
                </div>
                <span style={{ background: '#fecaca', color: '#991b1b', fontSize: '0.68rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>ATTENTION</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>⬇ Télécharger le contrat</button>
                <button style={{ flex: 1, padding: '0.7rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>✏ Modifier le contrat</button>
                <button onClick={() => setSelectedContract(null)} style={{ flex: 1, padding: '0.7rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>← Retour au litige</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Contrats</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Gestion des contrats • Templates intelligents • Suivi escrow • Mode collaboratif</p>
      </div>

      {/* SECTION CONTRATS & DOCUMENTS */}
      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1rem' }}>Contrats & Documents</div>

      {/* MÉTRIQUES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #f0f0f0', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '0.78rem', color: '#a0aec0', marginBottom: '0.4rem' }}>{m.label}</div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.3rem' }}>{m.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#718096' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', background: '#f8f9fa', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        {[
          { id: 'dashboard', icon: '📊', label: 'Dashboard', activeColor: '#3b82f6' },
          { id: 'contrats', icon: '📋', label: 'Contrats', activeColor: '#22c55e' },
          { id: 'suivi', icon: '⏱', label: 'Suivi', activeColor: '#6366f1' },
          { id: 'litiges', icon: '✦', label: 'Litiges', activeColor: '#ef4444' },
          { id: 'creer', icon: '+', label: 'Créer', activeColor: '#a855f7' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '0.65rem 1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? t.activeColor : 'transparent', color: tab === t.id ? '#fff' : '#718096', borderRadius: '8px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== DASHBOARD ===== */}
      {tab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#a855f7' }}>⓪</span> Insights IA Contrats
            </div>
            {[
              { icon: '⚡', color: '#a855f7', bg: 'rgba(168,85,247,0.06)', border: 'rgba(168,85,247,0.2)', label: 'Recommandation', text: '3 contrats arrivent à échéance dans les 30 prochains jours. Prévoir les renouvellements.' },
              { icon: '✓', color: '#22c55e', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', label: 'Opportunité', text: 'Les contrats UGC montrent un ROI 23% supérieur. Considérer l\'expansion de cette vertical.' },
              { icon: '⚠', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', label: 'Attention', text: '2 partenaires montrent des signes de risque accru. Surveillance renforcée recommandée.' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
                <span style={{ color: item.color, fontWeight: 700, fontSize: '0.875rem' }}>{item.icon} {item.label} : </span>
                <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>{item.text}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📊 Performance Contrats
            </div>
            {[['Taux de signature', 94], ['Respect des délais', 87], ['Satisfaction partenaires', 91], ['Qualité livrables', 88], ['Taux de renouvellement', 82]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#4a5568' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#1a202c' }}>{val}%</span>
                </div>
                <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${val}%`, background: 'linear-gradient(90deg,#a855f7,#3b82f6)', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== CONTRATS ===== */}
      {tab === 'contrats' && (
        <div>
          {/* Contrats créés */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📄 Contrats créés ({contratsCreés.length})</div>
                <div style={{ fontSize: '0.78rem', color: '#718096' }}>Prêts à être envoyés depuis la messagerie</div>
              </div>
              <button onClick={() => setTab('creer')} style={{ padding: '0.5rem 1rem', background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Nouveaux contrats</button>
            </div>
            {contratsCreés.map((c, i) => (
              <div key={c.id} style={{ padding: '1rem 1.5rem', borderBottom: i < contratsCreés.length - 1 ? '1px solid #f0f0f0' : 'none', background: c.sent ? 'rgba(34,197,94,0.02)' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                      <span style={{ background: '#f4f4f5', color: '#71717a', fontSize: '0.68rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{c.type}</span>
                      {c.sent && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.68rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>✈ Envoyé</span>}
                    </div>
                    {c.sent && <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.2rem' }}>Pour: {c.to}</div>}
                    {c.sent && <div style={{ fontSize: '0.78rem', color: '#3b82f6' }}>🔗 {c.campaign}</div>}
                    <div style={{ fontSize: '0.78rem', color: '#718096', marginTop: '0.2rem' }}>
                      💲 {c.amount} · {c.livrables} livrables · Créé le {c.date}
                    </div>
                    {c.sent && <div style={{ fontSize: '0.72rem', color: '#a0aec0', marginTop: '0.2rem' }}>Envoyé à {c.to} le {c.sentDate}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <button onClick={() => setSelectedContract(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#a0aec0' }}>👁</button>
                    {!c.sent && <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#ef4444' }}>🗑</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tous les contrats */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Tous les contrats</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setContratsTab('actifs')} style={{ padding: '0.4rem 0.9rem', background: contratsTab === 'actifs' ? '#1a202c' : '#fff', color: contratsTab === 'actifs' ? '#fff' : '#718096', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: contratsTab === 'actifs' ? 600 : 400 }}>Actifs</button>
                <button onClick={() => setContratsTab('archives')} style={{ padding: '0.4rem 0.9rem', background: contratsTab === 'archives' ? '#1a202c' : '#fff', color: contratsTab === 'archives' ? '#fff' : '#718096', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: contratsTab === 'archives' ? 600 : 400 }}>Archivés</button>
              </div>
            </div>
            <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.72rem', color: '#a0aec0', fontWeight: 600 }}>
              {['Contrat & Campagne', 'Partenaire', 'Escrow', 'Score IA', 'Risque', 'Statut', 'Montant', 'Actions'].map(h => <div key={h}>{h}</div>)}
            </div>
            {(contratsTab === 'actifs' ? allContrats : allContratsArchives).map((c, i) => (
              <div key={i} style={{ padding: '0.85rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1a202c' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#3b82f6' }}>🔗 {c.campaign}</div>
                  <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>Expire: {c.expire}</div>
                </div>
                <span style={{ color: '#4a5568' }}>{c.partner}</span>
                <span style={{ background: `${c.escrowColor}20`, color: c.escrowColor, fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>{c.escrow}</span>
                <span style={{ fontWeight: 600 }}>{c.score}%</span>
                <span style={{ background: `${c.riskColor}15`, color: c.riskColor, fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '100px', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>⊙ {c.risk}</span>
                <span style={{ background: `${c.statusColor}15`, color: c.statusColor, fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>{c.status}</span>
                <span style={{ fontWeight: 600 }}>{c.amount}</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => setSelectedContract(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#a0aec0' }}>👁</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#a0aec0' }}>✏</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#a0aec0' }}>📋</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#a0aec0' }}>⬇</button>
                </div>
              </div>
            ))}
            <div style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#a0aec0' }}>
              Gestion intelligente de vos contrats avec suivi IA.
            </div>
          </div>
        </div>
      )}

      {/* ===== SUIVI ===== */}
      {tab === 'suivi' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '2rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⏱ Contrats arrivant à échéance
          </div>
          <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '3rem' }}>Contrats arrivant à échéance dans les 90 prochains jours</div>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>✓</div>
            <div style={{ fontWeight: 600, color: '#a0aec0', marginBottom: '0.4rem' }}>Aucun contrat arrivant à échéance</div>
            <div style={{ fontSize: '0.875rem', color: '#cbd5e0' }}>Tous vos contrats sont à jour</div>
          </div>
        </div>
      )}

      {/* ===== LITIGES ===== */}
      {tab === 'litiges' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✦ Gestion des Litiges</div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>Résolution transparente et sécurisée des conflits avec médiation Partnexx</div>
            </div>
            <button style={{ padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Ouvrir un litige</button>
          </div>

          {/* Sous-onglets litiges */}
          <div style={{ display: 'flex', gap: '0', background: '#f8f9fa', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', width: 'fit-content' }}>
            <button onClick={() => setLitigeTab('open')} style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: litigeTab === 'open' ? '#fff' : 'transparent', color: litigeTab === 'open' ? '#1a202c' : '#718096', fontSize: '0.85rem', fontWeight: litigeTab === 'open' ? 600 : 400, fontFamily: 'inherit', boxShadow: litigeTab === 'open' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              ⚠ Litiges ouverts (2)
            </button>
            <button onClick={() => setLitigeTab('closed')} style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: litigeTab === 'closed' ? '#fff' : 'transparent', color: litigeTab === 'closed' ? '#1a202c' : '#718096', fontSize: '0.85rem', fontWeight: litigeTab === 'closed' ? 600 : 400, fontFamily: 'inherit', boxShadow: litigeTab === 'closed' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              📋 Litiges clos (1)
            </button>
          </div>

          {/* Litiges ouverts */}
          {litigeTab === 'open' && litiges.map((litige, idx) => (
            <div key={litige.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', marginBottom: '1.5rem', overflow: 'hidden' }}>
              {/* Header litige */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{litige.title}</span>
                  <span style={{ background: `${litige.statusColor}15`, color: litige.statusColor, fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{litige.status}</span>
                  {litige.deadline && <span style={{ background: '#fff5f5', color: '#ef4444', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>⏰ {litige.deadline}</span>}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#718096' }}>
                  Contrat: {litige.contract} · Partenaire: {litige.partner} · Type: {litige.type}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>Ouvert le {litige.opened}</div>
              </div>

              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0' }}>
                {/* Description */}
                <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.5rem' }}>📋 Description du problème</div>
                  <p style={{ fontSize: '0.82rem', color: '#4a5568', margin: '0 0 0.75rem' }}>{litige.desc}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {litige.files.map(f => (
                      <span key={f} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', color: '#718096', cursor: 'pointer' }}>📎 {f}</span>
                    ))}
                  </div>
                </div>

                {/* IA Reco */}
                <div style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#a855f7', fontWeight: 600, fontSize: '0.82rem' }}>⓪ Recommandation IA : </span>
                  <span style={{ fontSize: '0.82rem', color: '#4a5568' }}>{litige.iaReco}</span>
                </div>

                {/* Médiation */}
                {litige.mediationActive && (
                  <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                    <span style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.82rem' }}>⓪ Médiation Partnexx active : </span>
                    <span style={{ fontSize: '0.82rem', color: '#4a5568' }}>Notre équipe est intervenue pour faciliter la résolution de ce litige. Nous analysons les échanges et proposerons une décision équitable.</span>
                  </div>
                )}
              </div>

              {/* Conversation */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>💬 Conversation dédiée</div>
                  {litige.mediationActive && <span style={{ fontSize: '0.72rem', color: '#a855f7', background: 'rgba(168,85,247,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Avec Partnexx</span>}
                  {!litige.mediationActive && <span style={{ fontSize: '0.72rem', color: '#718096', cursor: 'pointer' }}>Discuter Manuellement</span>}
                </div>

                {/* Messages */}
                <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', maxHeight: '220px', overflowY: 'auto' }}>
                  {litige.messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.isMe ? 'flex-end' : 'flex-start', marginBottom: '0.75rem' }}>
                      {!msg.isMe && (
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, marginRight: '0.5rem' }}>
                          {msg.sender[0]}
                        </div>
                      )}
                      <div style={{ maxWidth: '70%' }}>
                        {!msg.isMe && <div style={{ fontSize: '0.68rem', color: '#a0aec0', marginBottom: '0.2rem' }}>{msg.sender}</div>}
                        <div style={{ background: msg.isMe ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#fff', color: msg.isMe ? '#fff' : '#1a202c', padding: '0.6rem 0.9rem', borderRadius: msg.isMe ? '12px 12px 0 12px' : '12px 12px 12px 0', fontSize: '0.8rem', border: msg.isMe ? 'none' : '1px solid #e2e8f0', lineHeight: 1.5 }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#a0aec0', marginTop: '0.2rem', textAlign: msg.isMe ? 'right' : 'left' }}>{msg.time}</div>
                      </div>
                      {msg.isMe && (
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, marginLeft: '0.5rem' }}>
                          V
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input message */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Entrer un message..." style={{ ...inp, flex: 1 }} />
                  <button style={{ padding: '0.6rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>➤</button>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {litige.mediationActive && (
                    <button style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Marquer comme résolu</button>
                  )}
                  {!litige.mediationActive && (
                    <button style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>⚡ Faire Intervenir Partnexx</button>
                  )}
                  {!litige.mediationActive && (
                    <button style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Marquer comme résolu</button>
                  )}
                  <button onClick={() => setSelectedContract({})} style={{ padding: '0.5rem 1rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>👁 Voir le contrat</button>
                </div>
              </div>
            </div>
          ))}

          {/* Litiges clos */}
          {litigeTab === 'closed' && litigesClos.map((l, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>{l.title}</span>
                <span style={{ background: '#f4f4f5', color: '#71717a', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Clos</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.3rem' }}>Contrat: {l.contract}</div>
              <div style={{ fontSize: '0.72rem', color: '#a0aec0', marginBottom: '1rem' }}>Ouvert le {l.opened} · Clos le {l.closed}</div>
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.82rem' }}>✓ Décision finale : </span>
                <span style={{ fontSize: '0.82rem', color: '#4a5568' }}>{l.decision}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
                {[['Type', l.type], ['Priorité', l.priority], ['Messages', l.messages], ['Partenaire', l.partner]].map(([k, v]) => (
                  <div key={k}><div style={{ color: '#a0aec0', fontSize: '0.72rem' }}>{k}</div><div style={{ fontWeight: v === 'Moyenne' ? 500 : 400 }}>{v === 'Moyenne' ? <span style={{ background: '#fef9c3', color: '#854d0e', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>{v}</span> : v}</div></div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button style={{ padding: '0.5rem 1rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>⏱ Voir l'historique complet</button>
                <button style={{ padding: '0.5rem 1rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>⬇ Télécharger le rapport</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== CRÉER ===== */}
      {tab === 'creer' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '2rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            + Créer un nouveau contrat
          </div>
          <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '3rem' }}>Templates prêts à l'emploi fournis par Partnexx</div>
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>📄</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.75rem' }}>Templates de contrats Partnexx</h3>
            <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              Choisissez parmi nos modèles professionnels pré-remplis et personnalisez-les selon vos besoins
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
              {['✓ 6 templates disponibles', '✓ Conformes juridiquement', '✓ 100% personnalisables'].map(f => (
                <span key={f} style={{ fontSize: '0.875rem', color: '#22c55e', fontWeight: 500 }}>{f}</span>
              ))}
            </div>
            <button style={{ padding: '0.85rem 2.5rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              + Choisir un template
            </button>
            <div style={{ fontSize: '0.78rem', color: '#a0aec0', marginTop: '1.5rem' }}>
              Les contrats créés seront automatiquement archivés et disponibles pour envoi dans la section Messages
            </div>
          </div>
        </div>
      )}
    </div>
  )
}