'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { Brain, Shield, Bell, CreditCard, Crown, Star, CheckCircle, Download, ExternalLink, MessageCircle, Settings, LogOut, AlertCircle } from 'lucide-react'
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
  const [changingPassword, setChangingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
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

        {/* SÉCURITÉ */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3"><Shield className="h-6 w-6 text-red-500" />Centre de Sécurité</CardTitle>
                <Badge className="bg-red-500 text-white">Compte Sécurisé</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Compte actuel */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Mail className="h-5 w-5 text-blue-500" />Compte Supabase</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Email du compte</p>
                <p className="font-semibold">{user?.email || 'Non connecté'}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle className="h-3 w-3" />Email vérifié</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">ID utilisateur</p>
                <p className="font-mono text-xs text-muted-foreground">{user?.id || '—'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Changer mot de passe */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5 text-red-500" />Changer le mot de passe</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold">Nouveau mot de passe</label>
                <Input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold">Confirmer le mot de passe</label>
                <Input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-9 text-sm" />
              </div>
              <Button onClick={handleChangePassword} disabled={changingPassword} className="w-full" size="sm">
                {changingPassword ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Mise à jour...</> : "Mettre à jour le mot de passe"}
              </Button>
            </CardContent>
          </Card>

          {/* Sessions */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Laptop className="h-5 w-5 text-cyan-500" />Session active</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Laptop className="h-4 w-4" />
                  <div>
                    <p className="font-semibold text-sm">Session actuelle</p>
                    <p className="text-xs text-muted-foreground">{user?.email} • Maintenant</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">Actuelle</Badge>
              </div>
              <Button variant="destructive" onClick={handleLogout} className="w-full" size="sm">
                <LogOut className="h-4 w-4 mr-2" />Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONFIDENTIALITÉ */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-purple-500" />Confidentialité & Données</CardTitle>
                <Badge className="bg-purple-500 text-white">Protégé</Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Cookie className="h-5 w-5 text-purple-500" />Préférences Cookies</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { key: "essential", name: "Cookies essentiels", desc: "Nécessaires au fonctionnement", required: true, checked: true },
                  { key: "analytics", name: "Cookies analytiques", desc: "Amélioration de l'expérience", required: false, checked: cookies.analytics },
                  { key: "marketing", name: "Cookies marketing", desc: "Publicité personnalisée", required: false, checked: cookies.marketing },
                ].map((cookie) => (
                  <div key={cookie.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div><p className="font-semibold text-sm">{cookie.name}</p><p className="text-xs text-muted-foreground">{cookie.desc}</p></div>
                    <Toggle checked={cookie.checked} disabled={cookie.required} onChange={(v) => !cookie.required && setCookies(prev => ({ ...prev, [cookie.key]: v }))} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Download className="h-5 w-5 text-blue-500" />Gestion des données</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => toast.info("Export disponible prochainement")}><Download className="h-4 w-4 mr-2" />Télécharger mes données</Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => toast.info("Export disponible prochainement")}><ExternalLink className="h-4 w-4 mr-2" />Exporter mon historique</Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => toast.info("Préférences sauvegardées")}><Settings className="h-4 w-4 mr-2" />Gérer mes préférences</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-background">
            <CardHeader><CardTitle className="flex items-center gap-2 text-red-600 text-base"><AlertTriangle className="h-5 w-5" />Suppression du compte</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Cette action est irréversible. Toutes vos données seront définitivement supprimées.</p>
              <Button variant="destructive" className="w-full" size="sm" onClick={handleDeleteAccount}>
                <Trash className="h-4 w-4 mr-2" />{deletingAccount ? "Cliquez à nouveau pour confirmer" : "Supprimer définitivement mon compte"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3"><Bell className="h-6 w-6 text-blue-500" />Centre de Notifications</CardTitle>
                <Badge className="bg-blue-500 text-white">Actives</Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-5 w-5 text-blue-500" />Canaux de notification</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { key: "push", name: "Notifications push", icon: Bell },
                  { key: "email", name: "Notifications email", icon: Mail },
                  { key: "sms", name: "Notifications SMS", icon: MessageCircle },
                ].map(({ key, name, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3"><Icon className="h-4 w-4" /><span className="font-semibold text-sm">{name}</span></div>
                    <Toggle checked={notifications[key]} onChange={(v) => { setNotifications(prev => ({ ...prev, [key]: v })); toast.success(`${name} ${v ? 'activées' : 'désactivées'}`) }} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Settings className="h-5 w-5 text-purple-500" />Préférences</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-semibold text-sm">Ne pas déranger</span>
                  <Toggle checked={dnd} onChange={(v) => { setDnd(v); toast.success(v ? "Mode silencieux activé" : "Notifications réactivées") }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold">Fréquence des résumés</label>
                  <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" onChange={() => toast.success("Préférence sauvegardée")}>
                    <option>Temps réel</option>
                    <option defaultValue>Quotidien</option>
                    <option>Hebdomadaire</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="h-5 w-5 text-purple-500" />Types de notifications</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: "Nouvelle opportunité", enabled: true },
                { title: "Message reçu", enabled: true },
                { title: "Collaboration acceptée", enabled: true },
                { title: "Paiement reçu", enabled: true },
                { title: "Nouvel avis reçu", enabled: true },
                { title: "Rappel de deadline", enabled: false },
              ].map((notif, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg gap-3">
                  <span className="font-semibold text-sm flex-1">{notif.title}</span>
                  <Toggle checked={notif.enabled} onChange={() => toast.success("Préférence mise à jour")} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPARENCE */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-background">
            <CardHeader><CardTitle className="flex items-center gap-3"><Palette className="h-6 w-6 text-amber-500" />Personnalisation</CardTitle></CardHeader>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Thème & Apparence</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "light", label: "Clair", sub: "Interface lumineuse", icon: Sun },
                  { key: "dark", label: "Sombre", sub: "Confort nocturne", icon: Moon },
                  { key: "auto", label: "Auto", sub: "Adaptatif", icon: Monitor },
                ].map(({ key, label, sub, icon: Icon }) => (
                  <div key={key} onClick={() => { setTheme(key); toast.success(`Thème ${label} activé`) }} className={`p-4 border-2 rounded-xl cursor-pointer hover:border-primary transition-colors ${theme === key ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3 mb-2"><Icon className="h-5 w-5 text-primary" /><span className="font-semibold text-sm">{label}</span></div>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAIEMENT */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3"><CreditCard className="h-6 w-6 text-green-500" />Paiement & Facturation</CardTitle>
                <Badge className="bg-green-500 text-white">Sécurisé Stripe</Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CreditCard className="h-5 w-5 text-green-500" />Moyens de paiement</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg border text-center text-sm text-muted-foreground">
                  Gérez vos moyens de paiement via Stripe
                </div>
                <Button className="w-full" size="sm" onClick={() => toast.info("Portail Stripe disponible prochainement")}>
                  <CreditCard className="h-4 w-4 mr-2" />Gérer mes paiements
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Download className="h-5 w-5 text-blue-500" />Factures</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg border text-center text-sm text-muted-foreground">
                  Vos factures sont disponibles dans le portail Stripe
                </div>
                <Button variant="outline" className="w-full" size="sm" onClick={() => toast.info("Portail Stripe disponible prochainement")}>
                  <Download className="h-4 w-4 mr-2" />Télécharger les factures
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

        {/* SUPPORT */}
        <TabsContent value="support" className="space-y-6">
          <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-cyan-500" />Aide & Support</CardTitle>
                <Badge className="bg-cyan-500 text-white">24/7</Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><HelpCircle className="h-5 w-5 text-cyan-500" />Centre d&apos;aide</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => toast.info("Documentation disponible prochainement")}><ExternalLink className="h-4 w-4 mr-2" />Documentation complète</Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => toast.info("FAQ disponible dans Ressources")}><MessageCircle className="h-4 w-4 mr-2" />Questions fréquentes</Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => toast.info("Tutoriels disponibles prochainement")}><ExternalLink className="h-4 w-4 mr-2" />Tutoriels vidéo</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="h-5 w-5 text-blue-500" />Contacter le support</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm" onClick={() => toast.info("Chat disponible prochainement")}><MessageCircle className="h-4 w-4 mr-2" />Chat en direct</Button>
                <Button variant="outline" className="w-full" size="sm" onClick={() => window.location.href = "mailto:support@partnexx.fr"}><Mail className="h-4 w-4 mr-2" />support@partnexx.fr</Button>
                <p className="text-xs text-muted-foreground text-center">Temps de réponse moyen : 2h</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Star className="h-5 w-5 text-purple-500" />Votre avis compte</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Aidez-nous à améliorer Partnexx en partageant votre expérience</p>
              <Button variant="outline" className="w-full" size="sm" onClick={() => toast.success("Merci pour votre retour !")}>
                <MessageCircle className="h-4 w-4 mr-2" />Donner mon avis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}