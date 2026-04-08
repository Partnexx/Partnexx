'use client'
import { useState } from 'react'
import { useTheme } from '../../ThemeContext'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const OUTILS_IA = [
  { id: 1, icon: '✏️', iconBg: '#ec4899', title: 'Générateur de Captions IA', desc: 'Créez des légendes engageantes optimisées pour chaque plateforme', features: ['Multilingue', 'Emojis intelligents', 'Hashtags suggérés'], premium: false },
  { id: 2, icon: '#', iconBg: '#06b6d4', title: 'Recherche Hashtags Intelligente', desc: 'Trouvez les hashtags les plus performants selon votre niche', features: ['Analyse tendances', 'Score popularité', 'Éviter shadowban'], premium: false },
  { id: 3, icon: '📊', iconBg: '#f97316', title: 'Analyseur de Tendances', desc: 'Découvrez les sujets viraux en temps réel', features: ['Alertes temps réel', 'Analyse prédictive', 'Multi-plateformes'], premium: true },
  { id: 4, icon: '💡', iconBg: '#f59e0b', title: "Générateur d'Idées Contenu", desc: 'Des suggestions personnalisées basées sur vos statistiques', features: ['Calendrier éditorial', 'Formats variés', 'Suggestions saison'], premium: false },
  { id: 5, icon: '🖼️', iconBg: '#22c55e', title: "Optimiseur d'Images IA", desc: 'Redimensionnez et améliorez vos visuels automatiquement', features: ['Multi-formats', 'Compression intelligente', 'Filtres IA'], premium: false },
  { id: 6, icon: '🎬', iconBg: '#ef4444', title: 'Générateur Scripts Vidéo', desc: 'Scripts personnalisés pour TikTok, Reels et Shorts', features: ['Templates prêts', 'Hooks accrocheurs', 'CTA optimisés'], premium: true },
  { id: 7, icon: '📱', iconBg: '#8b5cf6', title: 'Assistant Planification Stories', desc: 'Planifiez et créez des stories captivantes avec IA', features: ['Stickers suggérés', 'Meilleur timing', 'CTA intelligents'], premium: false },
  { id: 8, icon: '👥', iconBg: '#06b6d4', title: "Analyseur d'Audience", desc: 'Comprenez votre audience et adaptez votre contenu', features: ['Démographie', 'Comportements', 'Préférences contenu'], premium: true },
  { id: 9, icon: '📝', iconBg: '#7c3aed', title: 'Générateur de Bio Instagram', desc: 'Créez une bio percutante qui convertit', features: ['Call to action', 'Emojis optimisés', 'Mots clés SEO'], premium: true },
  { id: 10, icon: '🌍', iconBg: '#06b6d4', title: 'Traducteur Multilingue', desc: 'Traduisez votre contenu pour toucher une audience internationale', features: ['80+ langues', 'Ton adapté', 'Contexte culturel'], premium: false },
  { id: 11, icon: '💬', iconBg: '#22c55e', title: 'Générateur de Réponses', desc: "Répondez à vos commentaires avec l'aide de l'IA", features: ['Ton personnalisé', 'Réponses rapides', 'Engagement optimisé'], premium: false },
  { id: 12, icon: '🎨', iconBg: '#ec4899', title: 'Palette de Couleurs IA', desc: 'Trouvez la palette parfaite pour votre marque', features: ['Harmonies couleurs', 'Emojis optimisés', 'Accessibilité', 'Export formats'], premium: true },
]

const TEMPLATES = [
  { id: 1, title: 'Template Post Instagram', cat: 'Social Media', downloads: '2.4K', desc: 'Designs professionnels pour vos posts Instagram', bg: 'linear-gradient(135deg,#ec4899,#a855f7)', thumb: '📸' },
  { id: 2, title: 'Stories Templates Pack', cat: 'Stories', downloads: '3.1K', desc: 'Collection de 50+ templates pour stories Instagram', bg: 'linear-gradient(135deg,#06b6d4,#3b82f6)', thumb: '📱' },
  { id: 3, title: 'Kit Branding Complet', cat: 'Branding', downloads: '1.8K', desc: 'Logo, couleurs, typographies et guidelines', bg: 'linear-gradient(135deg,#374151,#1f2937)', thumb: '🎨' },
  { id: 4, title: 'Templates Reels/TikTok', cat: 'Vidéo', downloads: '4.2K', desc: 'Formats vidéo courts optimisés pour la viralité', bg: 'linear-gradient(135deg,#ef4444,#ec4899)', thumb: '🎬' },
  { id: 5, title: 'Media Kit Influenceur', cat: 'Business', downloads: '1.5K', desc: 'Présentez vos stats et tarifs de façon pro', bg: 'linear-gradient(135deg,#22c55e,#06b6d4)', thumb: '📊' },
  { id: 6, title: 'Calendrier Éditorial', cat: 'Planning', downloads: '2.9K', desc: 'Planifiez votre contenu sur 3 mois', bg: 'linear-gradient(135deg,#f59e0b,#f97316)', thumb: '📅' },
]

const GUIDES = [
  { id: 1, icon: '📸', iconBg: '#ec4899', title: 'Guide Complet Instagram 2024', desc: 'Stratégies complètes pour exploser sur Instagram', time: '45 min de lecture', tags: ['Algorithme', 'Croissance', 'Monétisation'] },
  { id: 2, icon: '🎵', iconBg: '#1a1a2e', title: 'Monétiser avec TikTok', desc: 'Tous les moyens de gagner de l\'argent sur TikTok', time: '30 min de lecture', tags: ['Creator Fund', 'Partenariats', 'Lives'] },
  { id: 3, icon: '📈', iconBg: '#06b6d4', title: 'Négociation & Tarification', desc: 'Comment définir vos tarifs et négocier avec les marques', time: '25 min de lecture', tags: ['Grille tarifaire', 'Contrats', 'Conditions'] },
  { id: 4, icon: '🎥', iconBg: '#f97316', title: 'Créer du Contenu UGC', desc: 'Maîtrisez l\'art du User Generated Content', time: '35 min de lecture', tags: ['Types de UGC', 'Équipement', 'Techniques'] },
  { id: 5, icon: '▶️', iconBg: '#ef4444', title: 'YouTube pour Créateurs', desc: 'Démarrer et monétiser sa chaîne YouTube', time: '50 min de lecture', tags: ['Optimisation SEO', 'Monétisation', 'Thumbnails'] },
  { id: 6, icon: '💼', iconBg: '#3b82f6', title: 'LinkedIn pour Influenceurs', desc: 'Développer votre présence professionnelle', time: '40 min de lecture', tags: ['Personal Branding', 'Networking', 'B2B Partnerships'] },
  { id: 7, icon: '📷', iconBg: '#22c55e', title: 'Photographier comme un Pro', desc: 'Techniques photo pour créateurs de contenu', time: '30 min de lecture', tags: ['Lumière', 'Composition', 'Édition mobile'] },
  { id: 8, icon: '👥', iconBg: '#8b5cf6', title: 'Community Management', desc: 'Engager et fidéliser votre communauté', time: '35 min de lecture', tags: ['Engagement', 'Modération', 'Croissance'] },
]

const FAQ_SECTIONS = [
  {
    titre: 'Démarrage',
    questions: [
      {
        q: 'Comment commencer sur Partnexx en tant que créateur ?',
        a: "Pour démarrer sur Partnexx, créez votre profil en renseignant vos réseaux sociaux, vos statistiques et vos niches. Complétez ensuite votre portfolio avec vos meilleurs contenus. Une fois votre profil vérifié, vous pourrez postuler aux opportunités et être contacté directement par les marques.",
      },
      {
        q: 'Combien de temps faut-il pour être vérifié ?',
        a: "La vérification de votre profil prend généralement entre 24 et 48 heures. Nous vérifions l'authenticité de vos comptes sociaux et la qualité de votre contenu. Vous recevrez une notification dès que votre profil sera approuvé.",
      },
      {
        q: 'Quels sont les critères pour rejoindre la plateforme ?',
        a: "Nous acceptons les créateurs de toute taille. Les critères principaux sont : avoir au moins 1 000 abonnés sur une plateforme, publier régulièrement du contenu de qualité, et respecter nos conditions d'utilisation.",
      },
    ],
  },
  {
    titre: 'Collaborations',
    questions: [
      {
        q: 'Comment fixer mes tarifs pour une collaboration ?',
        a: "Vos tarifs dépendent de plusieurs facteurs : votre nombre d'abonnés, vos taux d'engagement, votre niche et le type de contenu demandé. En général, comptez 0,01 € à 0,10 € par abonné pour un post Instagram. Notre guide Négociation & Tarification vous donnera des grilles tarifaires détaillées.",
      },
      {
        q: 'Puis-je refuser une collaboration ?',
        a: "Absolument, vous avez le contrôle total sur les collaborations que vous acceptez. Vous pouvez refuser une opportunité si elle ne correspond pas à vos valeurs, votre audience ou vos tarifs. Cela n'affectera pas négativement votre profil.",
      },
      {
        q: 'Comment se passe le paiement ?',
        a: "Une fois la collaboration terminée et validée par la marque, le paiement est effectué sous 7 à 14 jours ouvrés. Vous pouvez choisir entre virement bancaire ou PayPal. Tous les paiements sont sécurisés via notre plateforme.",
      },
      {
        q: 'Que faire en cas de litige avec une marque ?',
        a: "Contactez immédiatement notre équipe via la messagerie. Nous intervenons comme médiateurs pour résoudre les litiges équitablement. Gardez toutes les preuves de communication et de travail effectué.",
      },
    ],
  },
  {
    titre: 'Contenu & Création',
    questions: [
      {
        q: 'Quels formats de contenu sont les plus demandés ?',
        a: "Les formats les plus demandés sont les Reels Instagram, les vidéos TikTok, les stories sponsorisées, les posts carousels et le contenu UGC (User Generated Content). Les vidéos courtes de 15 à 60 secondes ont actuellement la meilleure performance.",
      },
      {
        q: "Dois-je mentionner que c'est un partenariat payant ?",
        a: "Oui, c'est obligatoire. Vous devez indiquer qu'il s'agit d'un partenariat rémunéré avec #ad, #sponsored ou « Partenariat rémunéré avec [nom de la marque] ». C'est une obligation légale dans la plupart des pays.",
      },
      {
        q: 'Puis-je réutiliser du contenu sponsorisé ?',
        a: "Cela dépend du contrat signé avec la marque. Généralement, vous conservez les droits d'utilisation sur vos propres réseaux, mais la marque peut avoir des droits d'exclusivité temporaires. Vérifiez toujours les conditions avant de republier.",
      },
      {
        q: "Comment améliorer mon taux d'engagement ?",
        a: "Publiez régulièrement (3 à 5 fois par semaine), interagissez avec votre communauté en répondant aux commentaires, utilisez les bons hashtags, créez du contenu authentique et varié, et analysez vos statistiques pour comprendre ce qui fonctionne.",
      },
    ],
  },
  {
    titre: 'Technique & Outils',
    questions: [
      { q: 'Quels outils IA sont gratuits sur Partnexx ?', a: "La plupart de nos outils IA de base sont gratuits : générateur de captions, recherche de hashtags, générateur d'idées, optimiseur d'images et bien d'autres. Les outils avancés comme l'Analyseur de Tendances, le Générateur de Scripts Vidéo ou l'Analyseur d'Audience sont réservés aux membres Premium." },
      { q: 'Puis-je utiliser les templates pour mes clients ?', a: "Oui, tous nos templates peuvent être utilisés pour vos projets personnels et professionnels. Pour une utilisation commerciale à grande échelle (revente de templates modifiés), une licence commerciale est requise. Contactez le support pour en savoir plus." },
      { q: 'Les outils IA remplaceront-ils ma créativité ?', a: "Non, les outils IA sont des assistants pour gagner du temps et trouver l'inspiration. Ils génèrent des suggestions que vous pouvez personnaliser et adapter à votre style unique. Votre touche personnelle reste essentielle et irremplaçable." },
    ],
  },
  {
    titre: 'Abonnement & Premium',
    questions: [
      { q: 'Quelle est la différence entre gratuit et Premium ?', a: "Le plan gratuit donne accès aux opportunités basiques et aux outils IA essentiels. Le plan Premium débloque les opportunités exclusives, les outils IA avancés, les statistiques détaillées, le support prioritaire, le badge vérifié et l'accès aux formations." },
      { q: 'Puis-je annuler mon abonnement Premium ?', a: "Oui, vous pouvez annuler à tout moment dans vos Paramètres > Abonnement. L'abonnement reste actif jusqu'à la fin de la période payée. Aucun remboursement n'est effectué pour la période en cours." },
      { q: 'Y a-t-il des réductions pour les étudiants ?', a: "Oui, les étudiants bénéficient de 50% de réduction sur l'abonnement Premium. Contactez notre support avec une photo de votre carte étudiant valide pour obtenir votre code promo personnalisé." },
    ],
  },
]

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function RessourcesPage() {
  const { isDark, colors } = useTheme()
  const [tab, setTab] = useState('outils')
  const [search, setSearch] = useState('')
  const [faqOpen, setFaqOpen] = useState({})
  const [downloadedTpl, setDownloadedTpl] = useState({})
  const [triedTool, setTriedTool] = useState({})

  const purple = '#7c3aed'
  const purpleLight = isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.07)'

  const fakeDownload = (name) => {
    const blob = new Blob([`Template Partnexx: ${name}\n\nFichier généré automatiquement.`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${name.replace(/ /g, '_')}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  const TABS = [
    { key: 'outils', label: 'Outils IA', icon: '🤖', color: purple },
    { key: 'templates', label: 'Templates', icon: '🗂️', color: '#3b82f6' },
    { key: 'guides', label: 'Guides', icon: '📖', color: '#ec4899' },
    { key: 'faq', label: 'FAQ', icon: '❓', color: '#f97316' },
  ]

  // ── OUTILS IA ──────────────────────────────────────────────────────────────
  const renderOutils = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
      {OUTILS_IA.map(o => (
        <div key={o.id} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px', boxShadow: colors.shadow, position: 'relative', overflow: 'hidden' }}>
          {o.premium && (
            <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: 20, fontWeight: 800 }}>Premium</div>
          )}
          <div style={{ width: 44, height: 44, borderRadius: 12, background: o.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12, color: '#fff', fontWeight: 900 }}>
            {o.icon}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: colors.text, marginBottom: 6 }}>{o.title}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.5, marginBottom: 14 }}>{o.desc}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            {o.features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.textSecondary }}>
                <span style={{ color: '#22c55e', fontSize: 10 }}>✓</span>{f}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (o.premium) { alert(`Outil Premium : ${o.title}\n\nPassez à Premium pour y accéder !`) }
              else { setTriedTool(p => ({ ...p, [o.id]: true })); alert(`Lancement de "${o.title}"...`) }
            }}
            style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: triedTool[o.id] ? '#22c55e' : (o.premium ? '#f59e0b' : `linear-gradient(135deg,${purple},#a855f7)`), color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: `0 4px 14px ${o.premium ? '#f59e0b' : purple}44` }}
          >
            {triedTool[o.id] ? '✓ Ouvert' : (o.premium ? '🔒 Premium' : '▶ Essayer maintenant')}
          </button>
        </div>
      ))}
    </div>
  )

  // ── TEMPLATES ──────────────────────────────────────────────────────────────
  const renderTemplates = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
      {TEMPLATES.map(t => (
        <div key={t.id} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: colors.shadow }}>
          {/* thumbnail */}
          <div style={{ height: 160, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative' }}>
            {t.thumb}
            <div style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 8, fontWeight: 700 }}>{t.cat}</div>
            <div style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 8 }}>⬇ {t.downloads}</div>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: colors.text, marginBottom: 4 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 14, lineHeight: 1.5 }}>{t.desc}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => alert(`Aperçu : ${t.title}`)} style={{ padding: '9px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                👁️ Aperçu
              </button>
              <button
                onClick={() => { setDownloadedTpl(p => ({ ...p, [t.id]: true })); fakeDownload(t.title) }}
                style={{ padding: '9px', borderRadius: 10, border: 'none', background: downloadedTpl[t.id] ? '#22c55e' : `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
              >
                {downloadedTpl[t.id] ? '✓ Téléchargé' : '⬇ Télécharger'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // ── GUIDES ─────────────────────────────────────────────────────────────────
  const renderGuides = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {GUIDES.map(g => (
        <div key={g.id} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '18px 20px', boxShadow: colors.shadow, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: g.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, color: '#fff' }}>{g.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: colors.text, marginBottom: 4 }}>{g.title}</div>
              <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.5 }}>{g.desc}</div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>📖 {g.time}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {g.tags.map(tag => (
              <span key={tag} style={{ fontSize: 11, background: purpleLight, color: purple, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
          <button
            onClick={() => alert(`Lecture du guide : ${g.title}\n\n${g.desc}`)}
            style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: `0 4px 14px ${purple}44` }}
          >
            Lire le guide →
          </button>
        </div>
      ))}
    </div>
  )

  // ── FAQ ────────────────────────────────────────────────────────────────────
  const renderFAQ = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: purpleLight, border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : '#e9d5ff'}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>💬</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: purple }}>Questions Fréquentes</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>Toutes les réponses à vos questions sur Partnexx</div>
        </div>
      </div>

      {FAQ_SECTIONS.map(section => (
        <div key={section.titre}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 4, height: 20, borderRadius: 99, background: purple }} />
            <div style={{ fontSize: 15, fontWeight: 800, color: colors.text }}>{section.titre}</div>
          </div>
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: colors.shadow }}>
            {section.questions.map((item, i) => {
              const key = `${section.titre}-${i}`
              const open = faqOpen[key]
              return (
                <div key={key} style={{ borderBottom: i < section.questions.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <button
                    onClick={() => setFaqOpen(p => ({ ...p, [key]: !p[key] }))}
                    style={{ width: '100%', padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, textAlign: 'left' }}>{item.q}</span>
                    <span style={{ fontSize: 16, color: purple, flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {open && (
                    <div style={{ padding: '0 20px 16px', fontSize: 13, color: colors.textSecondary, lineHeight: 1.7, borderTop: `1px solid ${colors.border}`, paddingTop: 12 }}>
                      {item.a || (
                        <span style={{ color: colors.textMuted, fontStyle: 'italic' }}>
                          Réponse à venir — contactez notre support si vous avez besoin d'aide immédiatement.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Contact support */}
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '24px', textAlign: 'center', boxShadow: colors.shadow }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 4 }}>💬 Vous ne trouvez pas votre réponse ?</div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 20 }}>Notre équipe support est disponible pour vous aider. Temps de réponse moyen : 2h</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[
            { icon: '💬', label: 'Chat en direct', sub: 'En ligne', color: '#3b82f6', status: 'green' },
            { icon: '📧', label: 'Email', sub: '2h', color: '#ec4899', status: null },
            { icon: '📞', label: 'Téléphone', sub: '09-18h', color: '#22c55e', status: null },
            { icon: '🛟', label: "Centre d'aide", sub: '24/7', color: '#ef4444', status: null },
          ].map(c => (
            <button key={c.label} onClick={() => alert(`Contacter via ${c.label}`)} style={{ padding: '16px 12px', borderRadius: 14, border: `1px solid ${colors.border}`, background: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: c.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{c.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{c.label}</div>
              <div style={{ fontSize: 10, color: c.status === 'green' ? '#22c55e' : colors.textSecondary, background: c.status === 'green' ? '#dcfce7' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'), padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                {c.sub}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Plus Jakarta Sans',sans-serif", background: colors.bg, minHeight: '100vh', color: colors.text }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: colors.text }}>Ressources & Templates</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(124,58,237,0.2)' : '#ede9fe', padding: '4px 12px', borderRadius: 20 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: purple }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: purple }}>IA actif</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 16 }}>Outils IA · Templates Pro · Guides Complets</div>

      {/* COMPTEURS */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '🤖', val: '12', label: 'Outils IA', color: purple },
          { icon: '🗂️', val: '6', label: 'Templates prêts', color: '#3b82f6' },
          { icon: '📖', val: '8', label: 'Guides', color: '#ec4899' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: colors.textSecondary }}>
            <span>{s.icon}</span>
            <span style={{ fontWeight: 800, color: s.color }}>{s.val}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un outil, template ou guide..."
          style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
        />
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}>🔍</span>
      </div>

      {/* TAB BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, borderRadius: 14, overflow: 'hidden', border: `1px solid ${colors.border}`, marginBottom: 24 }}>
        {TABS.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '12px', border: 'none',
              background: tab === t.key ? t.color : 'transparent',
              color: tab === t.key ? '#fff' : colors.textSecondary,
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all .2s',
              borderRight: i < 3 ? `1px solid ${colors.border}` : 'none',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {tab === 'outils'    && renderOutils()}
      {tab === 'templates' && renderTemplates()}
      {tab === 'guides'    && renderGuides()}
      {tab === 'faq'       && renderFAQ()}
    </div>
  )
}