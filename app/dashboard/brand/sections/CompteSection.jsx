'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Building, Globe, Users, User, Mail, Phone, MapPin, ExternalLink,
  Award, Plus, Trash2, CheckCircle, Sparkles, Brain, Save,
  Upload, Crown, Shield, Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'

const STORAGE_KEY_GENERAL = 'partnexx_brand_general'
const STORAGE_KEY_CONTACT = 'partnexx_brand_contact'
const STORAGE_KEY_LEGAL = 'partnexx_brand_legal'
const STORAGE_KEY_BILLING = 'partnexx_brand_billing'
const STORAGE_KEY_TEAM = 'partnexx_brand_team'

const SECTORS = [
  'Mode & Beauté', 'Tech & Software', 'Food & Restaurant', 'Sport & Fitness',
  'Voyage & Tourisme', 'Finance & Crypto', 'Éducation', 'Santé & Bien-être',
  'Auto & Moto', 'Immobilier', 'E-commerce', 'Gaming', 'Lifestyle', 'Autre',
]

const TEAM_ROLES = [
  { value: 'owner', label: 'Propriétaire', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'admin', label: 'Administrateur', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'manager', label: 'Manager', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'editor', label: 'Éditeur', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'viewer', label: 'Observateur', color: 'bg-gray-100 text-gray-700 border-gray-200' },
]

const COUNTRIES = ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada', 'Espagne', 'Italie', 'Allemagne', 'Royaume-Uni', 'États-Unis']

const COMPANY_SIZES = ['1-5 employés', '6-10', '11-25', '26-50', '51-100', '101-250', '250-500', '500+']

const DEFAULT_GENERAL = {
  company_name: '', logo_url: '', description: '',
  sector: '', size: '', website: '',
}

const DEFAULT_CONTACT = {
  name: '', role: '', email: '', phone: '',
}

const DEFAULT_TEAM_MEMBERS = [
  { id: 'm1', name: 'Dylan Perquin', email: 'perquindylan39@gmail.com', role: 'owner', status: 'active', joined: '2024-01-15' },
]

export default function CompteSection({ user: userProp }) {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [savingCompany, setSavingCompany] = useState(false)
  const [brandId, setBrandId] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [plan] = useState('Enterprise')

  /* === Onglet GÉNÉRAL (localStorage) === */
  const [general, setGeneral] = useState(DEFAULT_GENERAL)
  const [contact, setContact] = useState(DEFAULT_CONTACT)

  /* === Onglet ENTREPRISE (Supabase brands + localStorage legal/billing) === */
  const [company, setCompany] = useState({
    company_name: '', address: '', zip: '', city: '', country: 'France',
    siret: '', vat_number: '',
  })
  const [legal, setLegal] = useState({ legal_form: 'SAS' })
  const [billing, setBilling] = useState({
    same_as_legal: true,
    address: '',
    email: '',
    payment_delay: '30jours',
    currency: 'EUR',
  })

  /* === Onglet ÉQUIPE (localStorage) === */
  const [teamMembers, setTeamMembers] = useState([])
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'editor' })
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  /* === LOAD === */
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        try {
          const rawG = localStorage.getItem(STORAGE_KEY_GENERAL)
          if (rawG) setGeneral({ ...DEFAULT_GENERAL, ...JSON.parse(rawG) })

          const rawC = localStorage.getItem(STORAGE_KEY_CONTACT)
          if (rawC) setContact({ ...DEFAULT_CONTACT, ...JSON.parse(rawC) })

          const rawL = localStorage.getItem(STORAGE_KEY_LEGAL)
          if (rawL) setLegal({ legal_form: 'SAS', ...JSON.parse(rawL) })

          const rawB = localStorage.getItem(STORAGE_KEY_BILLING)
          if (rawB) setBilling(b => ({ ...b, ...JSON.parse(rawB) }))

          const rawT = localStorage.getItem(STORAGE_KEY_TEAM)
          setTeamMembers(rawT ? JSON.parse(rawT) : DEFAULT_TEAM_MEMBERS)
        } catch (e) {
          console.error('Erreur localStorage:', e)
          setTeamMembers(DEFAULT_TEAM_MEMBERS)
        }

        let userId = userProp?.id
        let email = userProp?.email
        if (!userId) {
          const { data } = await supabase.auth.getUser()
          userId = data?.user?.id
          email = data?.user?.email
        }
        if (!userId) { if (!cancelled) setLoading(false); return }
        if (!cancelled && email) setUserEmail(email)

        const { data: brand, error } = await supabase
          .from('brands')
          .select('id, company_name, address, zip, city, country, siret, vat_number')
          .eq('user_id', userId)
          .single()

        if (error || !brand) { if (!cancelled) setLoading(false); return }

        if (!cancelled) {
          setBrandId(brand.id)
          setCompany({
            company_name: brand.company_name || '',
            address: brand.address || '',
            zip: brand.zip || '',
            city: brand.city || '',
            country: brand.country || 'France',
            siret: brand.siret || '',
            vat_number: brand.vat_number || '',
          })
          if (!general.company_name && brand.company_name) {
            setGeneral(g => ({ ...g, company_name: brand.company_name }))
          }
          setLoading(false)
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProp])

  /* === SAVE Identité (localStorage) === */
  const saveIdentity = () => {
    try {
      localStorage.setItem(STORAGE_KEY_GENERAL, JSON.stringify(general))
      toast.success('✅ Identité enregistrée')
    } catch (e) { toast.error('Erreur de sauvegarde') }
  }

  /* === SAVE Contact (localStorage) === */
  const saveContact = () => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(contact))
      toast.success('✅ Contact mis à jour')
    } catch (e) { toast.error('Erreur de sauvegarde') }
  }

  /* === SAVE Légal (Supabase + localStorage forme juridique) === */
  const saveLegal = async () => {
    if (!brandId) { toast.error('Profil marque introuvable'); return }
    setSavingCompany(true)
    try {
      const { error } = await supabase
        .from('brands')
        .update(company)
        .eq('id', brandId)
      if (error) throw error
      try { localStorage.setItem(STORAGE_KEY_LEGAL, JSON.stringify(legal)) } catch (e) { console.error(e) }
      toast.success('✅ Informations légales enregistrées')
    } catch (e) {
      console.error(e)
      toast.error('Erreur de sauvegarde', { description: e.message })
    } finally {
      setSavingCompany(false)
    }
  }

  /* === SAVE Facturation (localStorage) === */
  const saveBilling = () => {
    try {
      localStorage.setItem(STORAGE_KEY_BILLING, JSON.stringify(billing))
      toast.success('✅ Informations de facturation mises à jour')
    } catch (e) { toast.error('Erreur de sauvegarde') }
  }

  /* === Équipe CRUD === */
  const saveTeam = (members) => {
    try { localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(members)) } catch (e) { console.error(e) }
  }
  const addMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      toast.error('Nom et email obligatoires'); return
    }
    const member = { ...newMember, id: `m_${Date.now()}`, status: 'pending', joined: new Date().toISOString().slice(0, 10) }
    const updated = [...teamMembers, member]
    setTeamMembers(updated); saveTeam(updated)
    setNewMember({ name: '', email: '', role: 'editor' })
    toast.success('👤 Membre ajouté', { description: `Invitation envoyée à ${member.email}` })
  }
  const removeMember = (id) => {
    const member = teamMembers.find(m => m.id === id)
    if (member?.role === 'owner') { toast.error('Impossible de supprimer le propriétaire'); return }
    const updated = teamMembers.filter(m => m.id !== id)
    setTeamMembers(updated); saveTeam(updated)
    toast.success('🗑️ Membre retiré')
  }
  const changeRole = (id, newRole) => {
    const updated = teamMembers.map(m => m.id === id ? { ...m, role: newRole } : m)
    setTeamMembers(updated); saveTeam(updated)
    toast.success('✏️ Rôle mis à jour')
  }

  const handleLogoUpload = () => {
    toast.info('📷 Upload logo - bientôt disponible', {
      description: 'Tu pourras coller une URL dans le champ "URL du logo" pour l\'instant',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-32 bg-muted/30 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-64 bg-muted/30 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <header>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="text-3xl font-bold">Compte entreprise</h1>
          <Badge className="bg-gradient-to-r from-primary to-accent text-white">
            <Brain className="h-3 w-3 mr-1" />IA Activée
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Gestion du profil • Optimisation automatique • Recommandations personnalisées
        </p>
      </header>

      {/* SOUS-HEADER : Profil Entreprise + badge Plan */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />Profil Entreprise
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestion complète de votre profil et paramètres d'entreprise
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 px-3 py-1">
          <Award className="h-4 w-4 mr-1" />Plan {plan}
        </Badge>
      </div>

      {/* ONGLETS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="general"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all">
            <Globe className="h-4 w-4" />Général
          </TabsTrigger>
          <TabsTrigger value="company"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all">
            <Building className="h-4 w-4" />Entreprise
          </TabsTrigger>
          <TabsTrigger value="team"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all">
            <Users className="h-4 w-4" />Équipe
          </TabsTrigger>
        </TabsList>

        {/* ============ ONGLET GÉNÉRAL : Identité + Contact principal ============ */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CARD 1 - Identité de l'entreprise */}
            <Card className="card-elevated profile-section-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient-blue">
                  <Sparkles className="h-5 w-5" />Identité de l'entreprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo + bouton Changer */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-blue-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {general.logo_url ? (
                      <img src={general.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-blue-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Button variant="outline" size="sm" onClick={handleLogoUpload} className="bg-white">
                      <Upload className="h-4 w-4 mr-2" />Changer le logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">PNG, SVG recommandés. Max 5MB.</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nom de l'entreprise</label>
                  <Input
                    placeholder="TechCorp Solutions"
                    value={general.company_name}
                    onChange={(e) => setGeneral({ ...general, company_name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Description de l'entreprise</label>
                  <Textarea
                    placeholder="Je connecte des marques ambitieuses avec des créateurs pertinents pour maximiser leur impact digital."
                    rows={3}
                    value={general.description}
                    onChange={(e) => setGeneral({ ...general, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Secteur d'activité</label>
                    <Select value={general.sector} onValueChange={(v) => setGeneral({ ...general, sector: v })}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        {SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Taille de l'entreprise</label>
                    <Select value={general.size} onValueChange={(v) => setGeneral({ ...general, size: v })}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Site web</label>
                  <Input
                    placeholder="https://techcorp.com"
                    value={general.website}
                    onChange={(e) => setGeneral({ ...general, website: e.target.value })}
                  />
                </div>

                <Button onClick={saveIdentity} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md">
                  <Save className="h-4 w-4 mr-2" />Enregistrer les modifications
                </Button>
              </CardContent>
            </Card>

            {/* CARD 2 - Contact principal */}
            <Card className="card-elevated profile-section-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient-blue">
                  <User className="h-5 w-5" />Contact principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {(contact.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{contact.name || 'Alex Dupont'}</p>
                    <p className="text-sm text-muted-foreground">{contact.role || 'Responsable partenariats'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nom du contact principal</label>
                  <Input
                    placeholder="Alex Dupont"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Fonction</label>
                  <Input
                    placeholder="Responsable partenariats"
                    value={contact.role}
                    onChange={(e) => setContact({ ...contact, role: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Mail className="h-3 w-3" />Email professionnel
                  </label>
                  <Input
                    type="email"
                    placeholder="alex.dupont@example.com"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Phone className="h-3 w-3" />Téléphone
                  </label>
                  <Input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  />
                </div>

                <Button onClick={saveContact} variant="outline" className="w-full bg-white">
                  Mettre à jour le contact
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ ONGLET ENTREPRISE (Supabase + localStorage facturation/juridique) ============ */}
        <TabsContent value="company" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CARD 1 - Informations légales */}
            <Card className="card-elevated profile-section-emerald">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient-emerald">
                  <Building className="h-5 w-5" />Informations légales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Numéro SIRET</label>
                    <Input
                      placeholder="12345678901234"
                      value={company.siret}
                      onChange={(e) => setCompany({ ...company, siret: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Numéro de TVA</label>
                    <Input
                      placeholder="FR12345678901"
                      value={company.vat_number}
                      onChange={(e) => setCompany({ ...company, vat_number: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Raison sociale *</label>
                  <Input
                    placeholder="Nom légal de la société"
                    value={company.company_name}
                    onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Adresse du siège social</label>
                  <Textarea
                    placeholder="Paris, France"
                    rows={2}
                    value={`${company.address}${company.address ? ', ' : ''}${company.zip}${company.zip ? ' ' : ''}${company.city}${company.city ? ', ' : ''}${company.country}`.trim().replace(/^,\s*|,\s*$/g, '')}
                    onChange={(e) => {
                      // Parse simple : "rue, CP ville, pays"
                      const parts = e.target.value.split(',').map(s => s.trim())
                      const [address = '', cpCity = '', country = company.country] = parts
                      const [zip, ...cityParts] = cpCity.split(' ')
                      setCompany({
                        ...company,
                        address,
                        zip: zip || '',
                        city: cityParts.join(' '),
                        country: country || company.country,
                      })
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Format : Rue, CP Ville, Pays</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Forme juridique</label>
                  <Select
                    value={legal.legal_form}
                    onValueChange={(v) => setLegal({ ...legal, legal_form: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="SAS" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAS">SAS</SelectItem>
                      <SelectItem value="SARL">SARL</SelectItem>
                      <SelectItem value="SA">SA</SelectItem>
                      <SelectItem value="EURL">EURL</SelectItem>
                      <SelectItem value="SASU">SASU</SelectItem>
                      <SelectItem value="EI">Entreprise individuelle</SelectItem>
                      <SelectItem value="Auto-entrepreneur">Auto-entrepreneur</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={saveLegal} disabled={savingCompany || !brandId}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md">
                  <Save className="h-4 w-4 mr-2" />
                  {savingCompany ? 'Sauvegarde...' : 'Enregistrer'}
                </Button>
              </CardContent>
            </Card>

            {/* CARD 2 - Facturation */}
            <Card className="card-elevated profile-section-orange">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient-orange">
                  <Building className="h-5 w-5" />Facturation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Adresse de facturation</label>
                  <Textarea
                    placeholder="Si différente de l'adresse du siège social..."
                    rows={2}
                    disabled={billing.same_as_legal}
                    value={billing.same_as_legal
                      ? `${company.address}${company.address ? ', ' : ''}${company.zip} ${company.city}, ${company.country}`.trim().replace(/^,\s*|,\s*$/g, '')
                      : billing.address}
                    onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBilling({ ...billing, same_as_legal: !billing.same_as_legal })}
                    className={`relative w-10 h-6 rounded-full transition ${billing.same_as_legal ? 'bg-orange-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${billing.same_as_legal ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <label className="text-sm">Identique à l'adresse du siège social</label>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Email de facturation</label>
                  <Input
                    type="email"
                    placeholder="comptabilite@votre-entreprise.com"
                    value={billing.email}
                    onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Délai de paiement</label>
                    <Select value={billing.payment_delay} onValueChange={(v) => setBilling({ ...billing, payment_delay: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comptant">Comptant</SelectItem>
                        <SelectItem value="15jours">15 jours</SelectItem>
                        <SelectItem value="30jours">30 jours</SelectItem>
                        <SelectItem value="45jours">45 jours</SelectItem>
                        <SelectItem value="60jours">60 jours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Devise</label>
                    <Select value={billing.currency} onValueChange={(v) => setBilling({ ...billing, currency: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CHF">CHF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={saveBilling} variant="outline" className="w-full bg-white">
                  Mettre à jour la facturation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        {/* ============ ONGLET ÉQUIPE (localStorage) ============ */}
        <TabsContent value="team" className="space-y-6 mt-6">

          {/* CARD GLOBALE - Gestion de l'équipe + 3 KPIs colorés */}
          <Card className="card-elevated profile-section-purple">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-gradient-purple text-xl">Gestion de l'équipe</CardTitle>
                <Button
                  onClick={() => setShowInviteDialog(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />Inviter un membre
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* 3 KPIs avec couleurs Lovable */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-700">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Membres actifs</p>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Mail className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-700">
                    {teamMembers.filter(m => m.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-700">
                    {teamMembers.filter(m => m.role === 'owner' || m.role === 'admin').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Administrateur{teamMembers.filter(m => m.role === 'owner' || m.role === 'admin').length > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* MEMBRES DE L'ÉQUIPE - liste épurée */}
              <div className="mt-6">
                <h3 className="text-base font-semibold mb-3">Membres de l'équipe</h3>
                <div className="space-y-2">
                  {teamMembers.map(member => {
                    const roleObj = TEAM_ROLES.find(r => r.value === member.role) || TEAM_ROLES[3]
                    return (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition flex-wrap gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${member.role === 'owner' ? 'bg-gradient-to-br from-yellow-500 to-amber-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                            {member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium truncate">{member.name}</p>
                              {member.role === 'owner' && <Crown className="h-4 w-4 text-yellow-500" />}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`text-xs ${member.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {member.status === 'pending' ? 'En attente' : 'Actif'}
                          </Badge>
                          {member.role === 'owner' ? (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                              <Crown className="h-3 w-3 mr-1" />Propriétaire
                            </Badge>
                          ) : (
                            <Select value={member.role} onValueChange={(v) => changeRole(member.id, v)}>
                              <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {TEAM_ROLES.filter(r => r.value !== 'owner').map(r => (
                                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {member.role !== 'owner' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => removeMember(member.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* PERMISSIONS PAR RÔLE - 3 cards */}
          <Card className="card-elevated profile-section-purple">
            <CardHeader>
              <CardTitle className="text-gradient-purple flex items-center gap-2">
                <Shield className="h-5 w-5" />Permissions par rôle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Administrateur */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-700">Administrateur</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-900">
                    <li>• Accès complet à tous les paramètres</li>
                    <li>• Gestion des membres et permissions</li>
                    <li>• Facturation et abonnements</li>
                  </ul>
                </div>

                {/* Manager */}
                <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-pink-600" />
                    <h4 className="font-semibold text-pink-700">Manager</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-pink-900">
                    <li>• Gestion des campagnes et partenaires</li>
                    <li>• Accès aux statistiques</li>
                    <li>• Création de rapports</li>
                  </ul>
                </div>

                {/* Viewer */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-700">Viewer</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-green-900">
                    <li>• Consultation en lecture seule</li>
                    <li>• Accès aux tableaux de bord</li>
                    <li>• Visualisation des campagnes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* DIALOG INVITER UN MEMBRE */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un nouveau membre</DialogTitle>
            <DialogDescription>L'invitation sera envoyée par email avec un lien d'activation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Nom complet</label>
              <Input
                placeholder="Jean Dupont"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                type="email" placeholder="jean@exemple.com"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Rôle</label>
              <Select value={newMember.role} onValueChange={(v) => setNewMember({ ...newMember, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEAM_ROLES.filter(r => r.value !== 'owner').map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Annuler</Button>
            <Button
              onClick={() => { addMember(); setShowInviteDialog(false) }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />Envoyer l'invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}