'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect, useRef } from 'react'
import { Brain, Shield, Bell, CreditCard, Crown, Star, CheckCircle, Download, ExternalLink, MessageCircle, Settings, LogOut, AlertCircle, Eye, EyeOff, Copy, KeyRound, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

const ShieldCheck = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
const Palette = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const Laptop = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>
const Smartphone = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
const Mail = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
const Sun = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
const Moon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
const Monitor = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
const Tag = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
const Gift = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
const HelpCircle = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
const Trash = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
const Cookie = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01"/></svg>
const AlertTriangle = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>

// Calcule la force d'un mot de passe → largeur de barre + label + couleurs
function getPasswordStrength(pw) {
  if (!pw) return { pct: 0, label: '', barClass: '', textClass: '' }
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 2) return { pct: 33, label: 'Faible', barClass: 'bg-red-500', textClass: 'text-red-500' }
  if (s === 3) return { pct: 66, label: 'Moyen', barClass: 'bg-amber-500', textClass: 'text-amber-500' }
  return { pct: 100, label: 'Fort', barClass: 'bg-green-500', textClass: 'text-green-500' }
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted-foreground/30'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

export default function ParametresSection({ user, profile }) {
  const router = useRouter()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [notifications, setNotifications] = useState({ push: true, email: true, sms: false })
  const [cookies, setCookies] = useState({ analytics: true, marketing: false })
  const [dnd, setDnd] = useState(false)
  const [theme, setTheme] = useState("light")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [notifTypes, setNotifTypes] = useState({
    opportunity: true, message: true, collab: true, payment: true, review: true, deadline: false,
  })
  const [frequency, setFrequency] = useState('daily')
  const loadedRef = useRef(false)

  // Charge les préférences cookies sauvegardées (côté navigateur)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('partnexx_cookies')
      if (saved) setCookies(JSON.parse(saved))
    } catch (e) { /* ignore */ }
  }, [])

  // Charge les préférences de notifications
  useEffect(() => {
    try {
      const saved = localStorage.getItem('partnexx_notifs')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.channels) setNotifications(p.channels)
        if (p.types) setNotifTypes(p.types)
        if (typeof p.dnd === 'boolean') setDnd(p.dnd)
        if (p.frequency) setFrequency(p.frequency)
      }
    } catch (e) { /* ignore */ }
    loadedRef.current = true
  }, [])

  // Sauvegarde auto des préférences de notifications
  useEffect(() => {
    if (!loadedRef.current) return
    try {
      localStorage.setItem('partnexx_notifs', JSON.stringify({ channels: notifications, types: notifTypes, dnd, frequency }))
    } catch (e) { /* ignore */ }
  }, [notifications, notifTypes, dnd, frequency])

  // Applique le thème (clair / sombre / auto) sur la page
  const applyTheme = (t) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (t === 'dark') root.classList.add('dark')
    else if (t === 'light') root.classList.remove('dark')
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    }
  }

  // Charge + applique le thème sauvegardé
  useEffect(() => {
    try {
      const saved = localStorage.getItem('partnexx_theme') || 'light'
      setTheme(saved)
      applyTheme(saved)
    } catch (e) { /* ignore */ }
  }, [])

  const handleThemeChange = (t) => {
    setTheme(t)
    applyTheme(t)
    try { localStorage.setItem('partnexx_theme', t) } catch (e) { /* ignore */ }
    toast.success(`Thème ${t === 'light' ? 'Clair' : t === 'dark' ? 'Sombre' : 'Auto'} activé`)
  }

  const handleApplyPromo = () => {
    if (!promoCode.trim()) { toast.error("Veuillez entrer un code promo"); return }
    if (["WELCOME20", "PARTNER50"].includes(promoCode.toUpperCase())) {
      setPromoApplied(true)
      toast.success("Code promo appliqué ! -20% sur votre prochain paiement")
    } else {
      toast.error("Code promo invalide ou expiré")
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) { toast.error("Mot de passe trop court (min 6 caractères)"); return }
    if (newPassword !== confirmPassword) { toast.error("Les mots de passe ne correspondent pas"); return }
    setChangingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { toast.error("Erreur : " + error.message) }
    else { toast.success("Mot de passe mis à jour !"); setNewPassword(""); setConfirmPassword("") }
    setChangingPassword(false)
  }

  const handleCopyId = () => {
    if (!user?.id) return
    navigator.clipboard.writeText(user.id)
    toast.success("Identifiant copié !")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Télécharge un fichier dans le navigateur
  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Récupère TOUTES les données de l'utilisateur (réutilisé par PDF + JSON)
  const fetchAllUserData = async () => {
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: inf } = await supabase.from('influencers').select('*').eq('user_id', user.id).single()
    let social = [], collabs = [], reviews = []
    if (inf?.id) {
      const [sRes, cRes] = await Promise.allSettled([
        supabase.from('social_accounts').select('*').eq('influencer_id', inf.id),
        supabase.from('collaborations').select('*, campaigns(title), brands(company_name)').eq('influencer_id', inf.id),
      ])
      social = sRes.status === 'fulfilled' ? (sRes.value.data || []) : []
      collabs = cRes.status === 'fulfilled' ? (cRes.value.data || []) : []
    }
    const rRes = await supabase.from('reviews').select('*, collaborations(id, campaigns(title))').eq('reviewee_id', user.id)
    reviews = rRes.data || []
    return { prof, inf, social, collabs, reviews }
  }

  // Export complet des données du compte (RGPD) au format JSON
  const handleDownloadData = async () => {
    if (!user?.id) { toast.error("Non connecté"); return }
    setExporting(true)
    try {
      const { prof, inf, social, collabs, reviews } = await fetchAllUserData()
      const payload = {
        exported_at: new Date().toISOString(),
        account: { email: user?.email, id: user?.id },
        profile: prof || null,
        influencer: inf || null,
        social_accounts: social,
        collaborations: collabs,
        reviews: reviews,
      }
      downloadFile(JSON.stringify(payload, null, 2), 'mes-donnees-partnexx.json', 'application/json')
      toast.success("Tes données ont été téléchargées 📦")
    } catch (err) {
      toast.error("Erreur : " + (err.message || 'export échoué'))
    }
    setExporting(false)
  }

  // Export PDF lisible et complet des données du compte (multi-pages)
  const handleDownloadPdf = async () => {
    if (!user?.id) { toast.error("Non connecté"); return }
    setExporting(true)
    try {
      const { prof, inf, social, collabs, reviews } = await fetchAllUserData()

      // Import dynamique (évite tout souci côté serveur)
      const mod = await import('jspdf')
      const JsPDF = mod.jsPDF || mod.default
      const doc = new JsPDF()
      const margin = 16
      const pageH = doc.internal.pageSize.getHeight()
      let y = 20

      const ensureSpace = (need = 10) => { if (y + need > pageH - 16) { doc.addPage(); y = 20 } }
      const heading = (txt) => {
        ensureSpace(18); y += 4
        doc.setFontSize(14); doc.setTextColor(124, 58, 237); doc.setFont(undefined, 'bold')
        doc.text(txt, margin, y); doc.setFont(undefined, 'normal'); y += 6
        doc.setDrawColor(228); doc.line(margin, y - 1, 194, y - 1); y += 4
      }
      const subtitle = (txt) => {
        ensureSpace(8)
        doc.setFontSize(11); doc.setTextColor(70); doc.setFont(undefined, 'bold')
        doc.text(txt, margin, y); doc.setFont(undefined, 'normal'); y += 6
      }
      const line = (label, value) => {
        const txt = (value === null || value === undefined || value === '') ? '—' : String(value)
        const wrapped = doc.splitTextToSize(txt, 118)
        ensureSpace(6 * wrapped.length)
        doc.setFontSize(10); doc.setTextColor(120); doc.text(label, margin, y)
        doc.setTextColor(30); doc.text(wrapped, margin + 52, y)
        y += 6 * wrapped.length
      }

      // En-tête
      doc.setFontSize(22); doc.setTextColor(124, 58, 237); doc.setFont(undefined, 'bold')
      doc.text('Partnexx', margin, y); y += 8
      doc.setFont(undefined, 'normal'); doc.setFontSize(13); doc.setTextColor(60)
      doc.text('Export de mes données', margin, y); y += 6
      doc.setFontSize(10); doc.setTextColor(140)
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, margin, y); y += 2

      heading('Compte')
      line('Email', user?.email)
      line('Identifiant', user?.id)

      heading('Profil')
      line('Nom', inf?.display_name || prof?.full_name)
      line("Nom d'utilisateur", prof?.username)
      line('Pays', inf?.country)
      line('Niches', Array.isArray(inf?.niche) ? inf.niche.join(', ') : inf?.niche)
      line('Types de contenu', Array.isArray(inf?.content_types) ? inf.content_types.join(', ') : inf?.content_types)
      line('Tarif minimum', inf?.min_budget != null ? `${inf.min_budget} EUR` : null)
      line('Bio', prof?.bio)

      heading('Statistiques')
      line('Score Partnexx', inf?.ai_score)
      line('Revenus totaux', inf?.total_earned != null ? `${inf.total_earned} EUR` : null)
      line('Collaborations', inf?.collaborations_count)
      line('Note moyenne', inf?.avg_rating != null ? `${inf.avg_rating} / 5` : null)

      heading(`Réseaux connectés (${social.length})`)
      if (social.length === 0) line('Statut', 'Aucun réseau connecté')
      else social.forEach((s, i) => {
        subtitle(`${i + 1}. ${String(s.platform || '').toUpperCase()}`)
        line('   Pseudo', s.handle)
        line('   Lien', s.profile_url)
        line('   Abonnés', s.followers_count)
        line('   Engagement', s.engagement_rate != null ? `${s.engagement_rate} %` : null)
      })

      heading(`Collaborations (${collabs.length})`)
      if (collabs.length === 0) line('Statut', 'Aucune collaboration')
      else collabs.forEach((c, i) => {
        subtitle(`${i + 1}. ${c.campaigns?.title || 'Campagne'}`)
        line('   Marque', c.brands?.company_name)
        line('   Statut', c.status)
        line('   Date', c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : null)
      })

      heading(`Avis reçus (${reviews.length})`)
      if (reviews.length === 0) line('Statut', 'Aucun avis')
      else reviews.forEach((r, i) => {
        subtitle(`${i + 1}. ${r.collaborations?.campaigns?.title || 'Collaboration'}`)
        line('   Note', r.rating != null ? `${r.rating} / 5` : null)
        line('   Commentaire', r.comment)
        line('   Date', r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : null)
      })

      // Pieds de page numérotés
      const pages = doc.internal.getNumberOfPages()
      for (let p = 1; p <= pages; p++) {
        doc.setPage(p)
        doc.setFontSize(9); doc.setTextColor(165)
        doc.text(`Partnexx — Export de données — Page ${p}/${pages}`, margin, pageH - 8)
      }

      doc.save('mes-donnees-partnexx.pdf')
      toast.success("PDF téléchargé 📄")
    } catch (err) {
      toast.error("Erreur PDF : " + (err.message || 'export échoué'))
    }
    setExporting(false)
  }

  // Export de l'historique des collaborations au format CSV
  const handleExportHistory = async () => {
    if (!user?.id) { toast.error("Non connecté"); return }
    setExporting(true)
    try {
      const { data: inf } = await supabase.from('influencers').select('id').eq('user_id', user.id).single()
      let collabs = []
      if (inf?.id) {
        const { data: c } = await supabase
          .from('collaborations')
          .select('*, campaigns(title), brands(company_name)')
          .eq('influencer_id', inf.id)
        collabs = c || []
      }
      if (collabs.length === 0) { toast.info("Aucune collaboration à exporter pour l'instant"); setExporting(false); return }
      const rows = [['Campagne', 'Marque', 'Statut', 'Date']]
      collabs.forEach(c => rows.push([
        (c.campaigns?.title || '').replace(/;/g, ','),
        (c.brands?.company_name || '').replace(/;/g, ','),
        c.status || '',
        c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : '',
      ]))
      const csv = '\ufeff' + rows.map(r => r.join(';')).join('\n')
      downloadFile(csv, 'historique-collaborations.csv', 'text/csv;charset=utf-8;')
      toast.success("Historique exporté 📊")
    } catch (err) {
      toast.error("Erreur : " + (err.message || 'export échoué'))
    }
    setExporting(false)
  }

  // Sauvegarde les préférences cookies (côté navigateur)
  const handleSavePreferences = () => {
    try {
      localStorage.setItem('partnexx_cookies', JSON.stringify(cookies))
      toast.success("Préférences enregistrées ✅")
    } catch (e) {
      toast.error("Impossible d'enregistrer les préférences")
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletingAccount) {
      setDeletingAccount(true)
      toast.error("Êtes-vous sûr ? Cliquez à nouveau pour confirmer la suppression.")
      setTimeout(() => setDeletingAccount(false), 5000)
      return
    }
    toast.error("Suppression de compte — contactez support@partnexx.fr")
    setDeletingAccount(false)
  }

  const strength = getPasswordStrength(newPassword)
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword

  const tabs = [
    { value: "security", label: "Sécurité", icon: Shield, color: "from-red-500 to-red-600" },
    { value: "privacy", label: "Confidentialité", icon: ShieldCheck, color: "from-purple-500 to-purple-600" },
    { value: "notifications", label: "Notifications", icon: Bell, color: "from-blue-500 to-blue-600" },
    { value: "appearance", label: "Apparence", icon: Palette, color: "from-amber-500 to-amber-600" },
    { value: "payment", label: "Paiement", icon: CreditCard, color: "from-green-500 to-green-600" },
    { value: "subscription", label: "Abonnement", icon: Crown, color: "from-yellow-500 to-yellow-600" },
    { value: "support", label: "Support", icon: HelpCircle, color: "from-cyan-500 to-cyan-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
            <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Configuration • Notifications • Sécurité & Confidentialité</p>
        {user && <p className="text-sm text-muted-foreground mt-1">Connecté en tant que <span className="font-medium text-foreground">{user.email}</span></p>}
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 gap-2 bg-transparent p-0 h-auto">
          {tabs.map(({ value, label, icon: Icon, color }) => (
            <TabsTrigger key={value} value={value} className={`rounded-2xl h-14 data-[state=active]:bg-gradient-to-br data-[state=active]:${color} data-[state=active]:text-white data-[state=active]:shadow-lg bg-card hover:bg-muted/50 transition-all duration-300 border-2 border-border/50`}>
              <div className="flex flex-col items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-semibold">{label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══════════════ SÉCURITÉ ═══════════════ */}
        <TabsContent value="security" className="space-y-6">

          {/* Bannière statut */}
          <Card className="border-0 overflow-hidden bg-gradient-to-br from-red-500/10 via-orange-500/5 to-background shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Centre de Sécurité</h2>
                    <p className="text-sm text-muted-foreground">Gère ton mot de passe et tes connexions</p>
                  </div>
                </div>
                <Badge className="bg-green-500/15 text-green-600 border border-green-500/30 gap-1.5 px-3 py-1.5 self-start sm:self-auto">
                  <CheckCircle className="h-4 w-4" />Compte sécurisé
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-background/70 border rounded-full px-3 py-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />Email vérifié
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-background/70 border rounded-full px-3 py-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />Mot de passe actif
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-background/70 border rounded-full px-3 py-1.5 text-muted-foreground">
                  <Smartphone className="h-3.5 w-3.5" />Double authentification — bientôt
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Infos du compte */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Mail className="h-5 w-5 text-blue-500" />Informations du compte</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-4 bg-muted/40 rounded-xl border">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p className="font-semibold truncate">{user?.email || 'Non connecté'}</p>
                </div>
                <Badge className="bg-green-500/15 text-green-600 border border-green-500/30 gap-1 shrink-0"><CheckCircle className="h-3 w-3" />Vérifié</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 p-4 bg-muted/40 rounded-xl border">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Identifiant utilisateur</p>
                  <p className="font-mono text-xs text-muted-foreground truncate">{user?.id || '—'}</p>
                </div>
                <Button variant="outline" size="lg" onClick={handleCopyId} className="shrink-0 gap-1.5 h-11 rounded-xl"><Copy className="h-4 w-4" />Copier</Button>
              </div>
            </CardContent>
          </Card>

          {/* Changer le mot de passe */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><KeyRound className="h-5 w-5 text-red-500" />Changer le mot de passe</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Nouveau mot de passe</label>
                <div className="relative">
                  <Input type={showNew ? 'text' : 'password'} placeholder="Au moins 6 caractères" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pr-10 h-11" />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.barClass}`} style={{ width: `${strength.pct}%` }} />
                    </div>
                    <p className={`text-xs font-medium ${strength.textClass}`}>Sécurité : {strength.label}</p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Confirmer le mot de passe</label>
                <div className="relative">
                  <Input type={showConfirm ? 'text' : 'password'} placeholder="Retape le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10 h-11" />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`text-xs font-medium flex items-center gap-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                    {passwordsMatch ? <><CheckCircle className="h-3 w-3" />Les mots de passe correspondent</> : <><AlertCircle className="h-3 w-3" />Les mots de passe ne correspondent pas</>}
                  </p>
                )}
              </div>
              <Button onClick={handleChangePassword} disabled={changingPassword} size="lg" className="w-full h-12 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md">
                {changingPassword ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Mise à jour...</> : <><KeyRound className="h-5 w-5 mr-2" />Mettre à jour le mot de passe</>}
              </Button>
            </CardContent>
          </Card>

          {/* Session active */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Laptop className="h-5 w-5 text-cyan-500" />Session active</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/40 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shrink-0">
                    <Laptop className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">Cet appareil</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email} • Connecté maintenant</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">Actuelle</Badge>
              </div>
              <Button variant="outline" onClick={handleLogout} size="lg" className="w-full h-12 rounded-xl text-sm font-semibold border-2 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-600">
                <LogOut className="h-5 w-5 mr-2" />Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════ CONFIDENTIALITÉ (refaite + boutons fonctionnels) ═══════════════ */}
        <TabsContent value="privacy" className="space-y-6">

          {/* Bannière */}
          <Card className="border-0 overflow-hidden bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-background shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shrink-0">
                    <ShieldCheck className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Confidentialité & Données</h2>
                    <p className="text-sm text-muted-foreground">Gère tes cookies et récupère tes données</p>
                  </div>
                </div>
                <Badge className="bg-purple-500/15 text-purple-600 border border-purple-500/30 gap-1.5 px-3 py-1.5 self-start sm:self-auto">
                  <CheckCircle className="h-4 w-4" />Protégé
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Cookie className="h-5 w-5 text-purple-500" />Préférences Cookies</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { key: "essential", name: "Cookies essentiels", desc: "Nécessaires au fonctionnement", required: true, checked: true },
                { key: "analytics", name: "Cookies analytiques", desc: "Amélioration de l'expérience", required: false, checked: cookies.analytics },
                { key: "marketing", name: "Cookies marketing", desc: "Publicité personnalisée", required: false, checked: cookies.marketing },
              ].map((cookie) => (
                <div key={cookie.key} className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                  <div><p className="font-semibold text-sm">{cookie.name}</p><p className="text-xs text-muted-foreground">{cookie.desc}</p></div>
                  <Toggle checked={cookie.checked} disabled={cookie.required} onChange={(v) => !cookie.required && setCookies(prev => ({ ...prev, [cookie.key]: v }))} />
                </div>
              ))}
              <Button onClick={handleSavePreferences} size="lg" className="w-full h-12 rounded-xl text-sm font-semibold mt-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-md">
                <CheckCircle className="h-5 w-5 mr-2" />Enregistrer mes préférences
              </Button>
            </CardContent>
          </Card>

          {/* Gestion des données — gros boutons fonctionnels */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Download className="h-5 w-5 text-blue-500" />Mes données</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" onClick={handleDownloadPdf} disabled={exporting} className="w-full h-auto py-4 rounded-xl gap-3 justify-start border-2 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all">
                <span className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0"><FileText className="h-5 w-5 text-rose-500" /></span>
                <span className="flex flex-col items-start text-left">
                  <span className="text-sm font-semibold">Télécharger mes données (PDF)</span>
                  <span className="text-xs text-muted-foreground font-normal">Document lisible — facile à lire</span>
                </span>
              </Button>
              <Button variant="outline" onClick={handleDownloadData} disabled={exporting} className="w-full h-auto py-4 rounded-xl gap-3 justify-start border-2 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all">
                <span className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0"><Download className="h-5 w-5 text-blue-500" /></span>
                <span className="flex flex-col items-start text-left">
                  <span className="text-sm font-semibold">Télécharger mes données (JSON)</span>
                  <span className="text-xs text-muted-foreground font-normal">Export complet RGPD — format technique</span>
                </span>
              </Button>
              <Button variant="outline" onClick={handleExportHistory} disabled={exporting} className="w-full h-auto py-4 rounded-xl gap-3 justify-start border-2 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0"><ExternalLink className="h-5 w-5 text-emerald-500" /></span>
                <span className="flex flex-col items-start text-left">
                  <span className="text-sm font-semibold">Exporter mon historique</span>
                  <span className="text-xs text-muted-foreground font-normal">Tes collaborations au format CSV (Excel)</span>
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Suppression compte */}
          <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-background shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-red-600 text-base"><AlertTriangle className="h-5 w-5" />Suppression du compte</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Cette action est irréversible. Toutes tes données seront définitivement supprimées.</p>
              <Button variant="destructive" onClick={handleDeleteAccount} size="lg" className="w-full h-12 rounded-xl text-sm font-semibold">
                <Trash className="h-5 w-5 mr-2" />{deletingAccount ? "Cliquez à nouveau pour confirmer" : "Supprimer définitivement mon compte"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════ NOTIFICATIONS (refaite + fonctionnelle) ═══════════════ */}
        <TabsContent value="notifications" className="space-y-6">

          {/* Bannière */}
          <Card className="border-0 overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-background shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shrink-0">
                    <Bell className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Centre de Notifications</h2>
                    <p className="text-sm text-muted-foreground">Choisis ce que tu reçois et comment</p>
                  </div>
                </div>
                <Badge className="bg-blue-500/15 text-blue-600 border border-blue-500/30 gap-1.5 px-3 py-1.5 self-start sm:self-auto">
                  <CheckCircle className="h-4 w-4" />Sauvegarde auto
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Canaux */}
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-5 w-5 text-blue-500" />Canaux de notification</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: "push", name: "Notifications push", desc: "Sur ton appareil", icon: Bell, color: "bg-blue-500/15 text-blue-500" },
                  { key: "email", name: "Notifications email", desc: "Dans ta boîte mail", icon: Mail, color: "bg-purple-500/15 text-purple-500" },
                  { key: "sms", name: "Notifications SMS", desc: "Par message texte", icon: MessageCircle, color: "bg-emerald-500/15 text-emerald-500" },
                ].map(({ key, name, desc, icon: Icon, color }) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon className="h-5 w-5" /></span>
                      <div><p className="font-semibold text-sm">{name}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
                    </div>
                    <Toggle checked={notifications[key]} onChange={(v) => { setNotifications(prev => ({ ...prev, [key]: v })); toast.success(`${name} ${v ? 'activées' : 'désactivées'}`) }} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Préférences */}
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Settings className="h-5 w-5 text-indigo-500" />Préférences</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                  <div><p className="font-semibold text-sm">Ne pas déranger</p><p className="text-xs text-muted-foreground">Coupe toutes les notifications</p></div>
                  <Toggle checked={dnd} onChange={(v) => { setDnd(v); toast.success(v ? "Mode silencieux activé" : "Notifications réactivées") }} />
                </div>
                <div className="space-y-2 p-4 border rounded-xl bg-muted/30">
                  <label className="text-sm font-semibold">Fréquence des résumés</label>
                  <select value={frequency} onChange={(e) => { setFrequency(e.target.value); toast.success("Fréquence enregistrée") }} className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm">
                    <option value="realtime">Temps réel</option>
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Types */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="h-5 w-5 text-indigo-500" />Types de notifications</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { key: "opportunity", title: "Nouvelle opportunité" },
                { key: "message", title: "Message reçu" },
                { key: "collab", title: "Collaboration acceptée" },
                { key: "payment", title: "Paiement reçu" },
                { key: "review", title: "Nouvel avis reçu" },
                { key: "deadline", title: "Rappel de deadline" },
              ].map(({ key, title }) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-xl bg-muted/30 gap-3">
                  <span className="font-semibold text-sm flex-1">{title}</span>
                  <Toggle checked={!!notifTypes[key]} onChange={(v) => setNotifTypes(prev => ({ ...prev, [key]: v }))} />
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">Tes préférences sont enregistrées automatiquement.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════ APPARENCE (refaite + thème appliqué) ═══════════════ */}
        <TabsContent value="appearance" className="space-y-6">

          {/* Bannière */}
          <Card className="border-0 overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                  <Palette className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Personnalisation</h2>
                  <p className="text-sm text-muted-foreground">Choisis l'apparence de ton espace</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Thème</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "light", label: "Clair", sub: "Interface lumineuse", icon: Sun },
                  { key: "dark", label: "Sombre", sub: "Confort nocturne", icon: Moon },
                  { key: "auto", label: "Auto", sub: "Suit ton système", icon: Monitor },
                ].map(({ key, label, sub, icon: Icon }) => (
                  <button key={key} type="button" onClick={() => handleThemeChange(key)} className={`text-left p-5 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-md ${theme === key ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-white" /></span>
                      {theme === key && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="font-bold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground border-t pt-4">
                ℹ️ Ton choix est mémorisé. Le mode sombre s'applique à toute l'interface (à condition que le thème sombre soit activé dans l'app).
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════ PAIEMENT (refait) ═══════════════ */}
        <TabsContent value="payment" className="space-y-6">

          {/* Bannière */}
          <Card className="border-0 overflow-hidden bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-background shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shrink-0">
                    <CreditCard className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Paiement & Versements</h2>
                    <p className="text-sm text-muted-foreground">Reçois tes gains en toute sécurité</p>
                  </div>
                </div>
                <Badge className="bg-green-500/15 text-green-600 border border-green-500/30 gap-1.5 px-3 py-1.5 self-start sm:self-auto">
                  <CheckCircle className="h-4 w-4" />Sécurisé par Stripe
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compte de versement */}
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CreditCard className="h-5 w-5 text-green-500" />Compte de versement</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl border bg-muted/30 text-sm text-muted-foreground">
                  Tes paiements sont envoyés sur ton compte bancaire via <span className="font-medium text-foreground">Stripe</span>, après chaque collaboration validée.
                </div>
                <Button size="lg" className="w-full h-12 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white" onClick={() => toast.info("Configuration des versements bientôt disponible")}>
                  <CreditCard className="h-5 w-5 mr-2" />Configurer mes versements
                </Button>
              </CardContent>
            </Card>

            {/* Factures */}
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-5 w-5 text-blue-500" />Mes factures</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl border bg-muted/30 text-sm text-muted-foreground">
                  Retrouve les factures de tes collaborations terminées dans <span className="font-medium text-foreground">« Contrats &amp; Paiements »</span> (menu de gauche).
                </div>
                <Button variant="outline" size="lg" className="w-full h-12 rounded-xl text-sm font-semibold" onClick={() => toast.info("Tes factures sont dans « Contrats & Paiements » (menu de gauche)")}>
                  <FileText className="h-5 w-5 mr-2" />Où trouver mes factures ?
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABONNEMENT */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="border-primary bg-gradient-to-br from-primary/10 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Plan actuel</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Accès à la plateforme Partnexx</p>
                </div>
                <Badge className="bg-primary text-white text-lg px-4 py-2 capitalize">
                  {profile?.subscription_plan || 'Gratuit'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Starter", price: "0 €", period: "gratuit", features: ["5 opportunités par mois", "Support basique", "Messagerie limitée", "Statistiques de base"], popular: false },
                  { name: "Pro", price: "29,99 €", period: "par mois", features: ["Opportunités illimitées", "Support prioritaire", "Messagerie avancée", "Statistiques détaillées", "Badge vérifié"], popular: true },
                  { name: "Enterprise", price: "99,99 €", period: "par mois", features: ["Tout inclus du Pro", "Support dédié 24/7", "API access", "Branding personnalisé", "Priorité absolue"], popular: false },
                ].map((plan, i) => (
                  <Card key={i} className={plan.popular ? "border-2 border-primary relative" : ""}>
                    {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-primary text-white">Recommandé</Badge></div>}
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="pt-4"><p className="text-3xl font-bold">{plan.price}</p><p className="text-xs text-muted-foreground">{plan.period}</p></div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((f, j) => <li key={j} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /><span className="text-sm">{f}</span></li>)}
                      </ul>
                      <Button
                        variant={plan.popular ? "default" : "outline"}
                        className="w-full"
                        onClick={() => toast.info(`Passage au plan ${plan.name} — disponible prochainement`)}
                      >
                        Choisir ce plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Code promo */}
          <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gift className="h-5 w-5 text-emerald-500" />Code Promo
                {promoApplied && <Badge className="ml-2 bg-emerald-500 text-white">Actif</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Vous avez un code promo ? Entrez-le ci-dessous.</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Entrez votre code promo" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} className="pl-10" disabled={promoApplied} />
                </div>
                <Button onClick={handleApplyPromo} disabled={promoApplied} className="bg-emerald-500 hover:bg-emerald-600">
                  {promoApplied ? "Appliqué" : "Appliquer"}
                </Button>
              </div>
              {promoApplied && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-600 font-medium">Code appliqué — 20% de réduction sur votre prochain paiement</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════ SUPPORT (refait) ═══════════════ */}
        <TabsContent value="support" className="space-y-6">

          {/* Bannière */}
          <Card className="border-0 overflow-hidden bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-background shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shrink-0">
                    <HelpCircle className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Aide & Support</h2>
                    <p className="text-sm text-muted-foreground">On est là si tu as besoin d&apos;un coup de main</p>
                  </div>
                </div>
                <Badge className="bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 gap-1.5 px-3 py-1.5 self-start sm:self-auto">
                  <CheckCircle className="h-4 w-4" />Réponse ~2h
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contacter le support — gros boutons */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="h-5 w-5 text-cyan-500" />Contacter le support</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => window.location.href = "mailto:support@partnexx.fr?subject=Demande%20de%20support"} className="w-full h-auto py-4 rounded-xl gap-3 justify-start bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white">
                <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0"><Mail className="h-5 w-5 text-white" /></span>
                <span className="flex flex-col items-start text-left">
                  <span className="text-sm font-semibold">Écrire au support</span>
                  <span className="text-xs text-white/80 font-normal">support@partnexx.fr</span>
                </span>
              </Button>
              <Button variant="outline" onClick={() => toast.info("Le chat en direct arrive bientôt")} className="w-full h-auto py-4 rounded-xl gap-3 justify-start border-2">
                <span className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0"><MessageCircle className="h-5 w-5 text-cyan-500" /></span>
                <span className="flex flex-col items-start text-left">
                  <span className="text-sm font-semibold">Chat en direct</span>
                  <span className="text-xs text-muted-foreground font-normal">Bientôt disponible</span>
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Centre d'aide */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><HelpCircle className="h-5 w-5 text-cyan-500" />Centre d&apos;aide</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-sm font-semibold" onClick={() => toast.info("Documentation bientôt disponible")}><ExternalLink className="h-4 w-4 mr-2" />Documentation</Button>
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-sm font-semibold" onClick={() => toast.info("FAQ bientôt disponible")}><HelpCircle className="h-4 w-4 mr-2" />Questions fréquentes</Button>
            </CardContent>
          </Card>

          {/* Avis */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Star className="h-5 w-5 text-purple-500" />Ton avis compte</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Une idée, un bug, une suggestion ? Dis-nous tout, ça nous aide à améliorer Partnexx.</p>
              <Button variant="outline" size="lg" className="w-full h-12 rounded-xl text-sm font-semibold" onClick={() => window.location.href = "mailto:support@partnexx.fr?subject=Mon%20avis%20sur%20Partnexx"}>
                <MessageCircle className="h-5 w-5 mr-2" />Donner mon avis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
