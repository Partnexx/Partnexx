'use client'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Calendar as CalendarIcon, Clock, Target, Users, Video, Rocket,
  Plus, Trash2, Edit, ChevronLeft, ChevronRight, MapPin,
  CheckCircle, AlertCircle, Bell, Download, Brain, Eye,
} from 'lucide-react'
import { toast } from 'sonner'

/* ============== HELPERS ============== */
const STORAGE_KEY = 'partnexx_calendar_events_v2'

const TYPE_META = {
  reunion: { label: 'Réunion', icon: Users, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  campagne: { label: 'Campagne', icon: Rocket, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  deadline: { label: 'Deadline', icon: Target, color: 'bg-red-100 text-red-700 border-red-200' },
  ugc: { label: 'UGC à valider', icon: Video, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
}

const STATUS_META = {
  'a-venir':   { label: 'À venir',    color: 'bg-gray-100 text-gray-700 border-gray-200',          icon: Clock },
  'confirme':  { label: 'Confirmé',   color: 'bg-blue-100 text-blue-700 border-blue-200',          icon: CheckCircle },
  'termine':   { label: 'Terminé',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  'en-retard': { label: 'En retard',  color: 'bg-red-100 text-red-700 border-red-200',             icon: AlertCircle },
}

const toDateKey = (d) => {
  const dt = d instanceof Date ? d : new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

const addDays = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

const formatFR = (d, opts) => {
  const dt = typeof d === 'string' ? new Date(d) : d
  return dt.toLocaleDateString('fr-FR', opts || { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatDayMonth = (d) => {
  const dt = typeof d === 'string' ? new Date(d) : d
  return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_MINI = ['Lu','Ma','Me','Je','Ve','Sa','Di']
const DAYS_FULL = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']

const DEMO_EVENTS = () => [
  {
    id: 'e1',
    date: toDateKey(new Date()),
    time: '10:00', endTime: '11:00',
    title: 'Call onboarding Luna Studio',
    description: 'Briefing initial pour la campagne UGC Q3',
    type: 'reunion',
    participants: ['Marie Dubois', 'Alex Martin'],
    location: 'Salle de réunion A',
    isVirtual: false,
    status: 'confirme',
  },
  {
    id: 'e2',
    date: toDateKey(new Date()),
    time: '15:30', endTime: '16:30',
    title: 'Validation UGC Campagne Noël',
    description: 'Revue des contenus créateurs pour validation finale',
    type: 'ugc',
    participants: ['Sophie Laurent'],
    isVirtual: true,
    meetingLink: 'https://meet.google.com/abc-def-ghi',
    status: 'a-venir',
  },
  {
    id: 'e3',
    date: toDateKey(addDays(new Date(), 1)),
    time: '14:00',
    title: 'Deadline campagne Noël',
    description: 'Livraison finale du brief créatif Nova Media',
    type: 'deadline',
    status: 'a-venir',
  },
  {
    id: 'e4',
    date: toDateKey(addDays(new Date(), 3)),
    time: '09:00', endTime: '10:30',
    title: 'Lancement campagne printemps',
    description: 'Kick-off avec les créateurs sélectionnés',
    type: 'campagne',
    participants: ["Toute l'équipe", '5 créateurs'],
    location: 'Siège Paris',
    status: 'confirme',
  },
  {
    id: 'e5',
    date: toDateKey(addDays(new Date(), 5)),
    title: 'UGC à valider - Marie',
    description: '3 vidéos TikTok à reviewer',
    type: 'ugc',
    status: 'a-venir',
  },
  {
    id: 'e6',
    date: toDateKey(addDays(new Date(), -2)),
    title: 'Deadline rapport Q3',
    type: 'deadline',
    status: 'en-retard',
  },
]

const computeStatus = (evt) => {
  if (evt.status === 'termine') return 'termine'
  const evtDate = new Date(evt.date + (evt.time ? `T${evt.time}` : 'T23:59'))
  if (evtDate < new Date()) return 'en-retard'
  return evt.status || 'a-venir'
}

const EMPTY_FORM = {
  title: '', date: toDateKey(new Date()), time: '', endTime: '',
  type: 'reunion', description: '', participants: '', location: '',
  isVirtual: false, meetingLink: '', status: 'a-venir',
}

/* ============== COMPONENT ============== */
export default function CalendrierSection() {
  const [events, setEvents] = useState([])
  const [hydrated, setHydrated] = useState(false)

  const [view, setView] = useState('month')
  const [selected, setSelected] = useState(new Date())
  const [calMonth, setCalMonth] = useState(new Date())
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [showNewDialog, setShowNewDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [viewingEvent, setViewingEvent] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  /* === LOAD localStorage (avec données demo au premier chargement) === */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setEvents(JSON.parse(raw))
      } else {
        setEvents(DEMO_EVENTS())
      }
    } catch (e) {
      console.error('Erreur load:', e)
      setEvents(DEMO_EVENTS())
    }
    setHydrated(true)
  }, [])

  /* === SAVE localStorage === */
  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)) } catch (e) { console.error(e) }
  }, [events, hydrated])

  /* === EVENTS avec statut calculé === */
  const eventsWithStatus = useMemo(
    () => events.map(e => ({ ...e, status: computeStatus(e) })),
    [events]
  )

  const filteredEvents = useMemo(() => {
    return eventsWithStatus.filter(e => {
      const matchType = filterType === 'all' || e.type === filterType
      const matchStatus = filterStatus === 'all' || e.status === filterStatus
      return matchType && matchStatus
    })
  }, [eventsWithStatus, filterType, filterStatus])

  /* === STATS === */
  const todayKey = toDateKey(new Date())
  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const weekStart = new Date(today)
    const wd = weekStart.getDay() === 0 ? 6 : weekStart.getDay() - 1
    weekStart.setDate(weekStart.getDate() - wd)
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7)

    const todayCount = filteredEvents.filter(e => e.date === todayKey).length
    const weekCount = filteredEvents.filter(e => {
      const d = new Date(e.date)
      return d >= weekStart && d < weekEnd
    }).length
    const deadlinesCount = filteredEvents.filter(e =>
      e.type === 'deadline' && new Date(e.date) >= today
    ).length

    return { todayCount, weekCount, deadlinesCount }
  }, [filteredEvents, todayKey])

  /* === RAPPELS AUTO (3 prochains événements à venir) === */
  const upcomingReminders = useMemo(() => {
    return filteredEvents
      .filter(e => e.date >= todayKey && e.status !== 'termine')
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
      .slice(0, 3)
  }, [filteredEvents, todayKey])

  /* === MINI CALENDRIER (grille mois) === */
  const miniCalGrid = useMemo(() => {
    const y = calMonth.getFullYear(), m = calMonth.getMonth()
    const first = new Date(y, m, 1)
    const startWd = first.getDay() === 0 ? 6 : first.getDay() - 1
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const prevDays = new Date(y, m, 0).getDate()

    const cells = []
    // Jours du mois précédent (gris)
    for (let i = startWd - 1; i >= 0; i--) {
      cells.push({ date: new Date(y, m - 1, prevDays - i), outside: true })
    }
    // Jours du mois courant
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(y, m, d), outside: false })
    }
    // Compléter à 6 lignes max (42 cells)
    while (cells.length < 42) {
      const last = cells[cells.length - 1].date
      cells.push({ date: addDays(last, 1), outside: true })
    }
    // Si dernière ligne entièrement outside, on coupe à 5 lignes (35 cells)
    if (cells.slice(35).every(c => c.outside)) cells.length = 35

    return cells
  }, [calMonth])

  /* === VUE SEMAINE: 7 jours du lundi au dimanche === */
  const weekDays = useMemo(() => {
    const start = new Date(selected)
    const wd = start.getDay() === 0 ? 6 : start.getDay() - 1
    start.setDate(start.getDate() - wd)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i)
      return d
    })
  }, [selected])

  /* === VUE JOUR: événements du jour sélectionné triés par heure === */
  const dayKey = toDateKey(selected)
  const dayEvents = useMemo(() =>
    filteredEvents.filter(e => e.date === dayKey).sort((a, b) => (a.time || '').localeCompare(b.time || '')),
  [filteredEvents, dayKey])

  const hoursList = useMemo(() => Array.from({ length: 13 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`), [])

  /* === ACTIONS === */
  const handleCreate = () => {
    if (!form.title.trim()) { toast.error('Le titre est obligatoire'); return }
    const newEvent = {
      ...form,
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      participants: form.participants ? form.participants.split(',').map(p => p.trim()).filter(Boolean) : [],
    }
    setEvents(prev => [...prev, newEvent])
    setShowNewDialog(false); setForm(EMPTY_FORM)
    toast.success('📅 Événement créé', { description: `${newEvent.title} le ${formatFR(newEvent.date)}` })
  }

  const handleEdit = () => {
    if (!form.title.trim() || !editingEvent) return
    const updated = {
      ...editingEvent, ...form,
      participants: form.participants ? form.participants.split(',').map(p => p.trim()).filter(Boolean) : [],
    }
    setEvents(prev => prev.map(e => e.id === editingEvent.id ? updated : e))
    setEditingEvent(null); setForm(EMPTY_FORM)
    toast.success('✏️ Événement modifié')
  }

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    setViewingEvent(null); setEditingEvent(null)
    toast.success('🗑️ Événement supprimé')
  }

  const handleExportICS = () => {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Partnexx//Calendar//FR']
    eventsWithStatus.forEach(e => {
      const dateStr = e.date.replace(/-/g, '')
      const timeStr = (e.time || '00:00').replace(':', '') + '00'
      const endStr = (e.endTime || e.time || '00:00').replace(':', '') + '00'
      lines.push('BEGIN:VEVENT')
      lines.push(`UID:${e.id}@partnexx`)
      lines.push(`DTSTART:${dateStr}T${timeStr}`)
      lines.push(`DTEND:${dateStr}T${endStr}`)
      lines.push(`SUMMARY:${e.title}`)
      if (e.description) lines.push(`DESCRIPTION:${e.description}`)
      if (e.location) lines.push(`LOCATION:${e.location}`)
      lines.push('END:VEVENT')
    })
    lines.push('END:VCALENDAR')
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'partnexx-calendrier.ics'; a.click()
    URL.revokeObjectURL(url)
    toast.success('📥 Calendrier exporté (.ics)')
  }

  const openEditDialog = (evt) => {
    setForm({
      title: evt.title || '', date: evt.date, time: evt.time || '', endTime: evt.endTime || '',
      type: evt.type || 'reunion', description: evt.description || '',
      participants: Array.isArray(evt.participants) ? evt.participants.join(', ') : '',
      location: evt.location || '', isVirtual: evt.isVirtual || false, meetingLink: evt.meetingLink || '',
      status: evt.status === 'en-retard' ? 'a-venir' : (evt.status || 'a-venir'),
    })
    setEditingEvent(evt); setViewingEvent(null)
  }

  const openNewDialog = (presetDate) => {
    setForm({ ...EMPTY_FORM, date: presetDate ? toDateKey(presetDate) : toDateKey(new Date()) })
    setShowNewDialog(true)
  }

  /* === FORM FIELDS REUSABLE === */
  const renderFormFields = () => (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-1 block">Titre *</label>
        <Input placeholder="Ex: Réunion brief campagne" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Date</label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Type</label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TYPE_META).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Heure début</label>
          <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Heure fin</label>
          <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <Input placeholder="Détails..." value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Participants (séparés par virgules)</label>
        <Input placeholder="@marie, @alex..." value={form.participants}
          onChange={(e) => setForm({ ...form, participants: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Lieu / Lien visio</label>
        <Input placeholder="Adresse ou lien Zoom/Meet" value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Statut</label>
        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="a-venir">À venir</SelectItem>
            <SelectItem value="confirme">Confirmé</SelectItem>
            <SelectItem value="termine">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  /* === RENDER === */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="mb-2">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="text-3xl font-bold">Calendrier</h1>
          <Badge className="bg-gradient-to-r from-primary to-accent text-white">
            <Brain className="h-3 w-3 mr-1" />IA Activée
          </Badge>
        </div>
        <p className="text-muted-foreground">Planification intelligente de vos campagnes et événements</p>
      </header>

      {/* SOUS-HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Calendrier Entreprise</h2>
          <p className="text-sm text-muted-foreground mt-1">Gérez vos événements, deadlines et campagnes</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportICS}>
          <Download className="h-4 w-4 mr-2" />Exporter (.ics)
        </Button>
      </div>

      {/* 3 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Aujourd'hui", value: stats.todayCount, sub: 'événements', icon: CalendarIcon, grad: 'from-purple-500 to-violet-500' },
          { label: 'Cette semaine', value: stats.weekCount, sub: 'événements', icon: Clock, grad: 'from-pink-500 to-rose-500' },
          { label: 'Deadlines à venir', value: stats.deadlinesCount, sub: 'deadlines', icon: Target, grad: 'from-amber-500 to-orange-500' },
        ].map(k => {
          const Icon = k.icon
          return (
            <Card key={k.label} className="border-2 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{k.label}</p>
                    <p className="text-2xl font-bold">{k.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-br ${k.grad}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* RAPPELS AUTO */}
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />Rappels automatiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingReminders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun rappel</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingReminders.map(e => (
                <div key={e.id} className="border border-blue-200 bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                  <Bell className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>{e.title}</strong>
                    {e.time && ` — ${e.time}`}
                    {e.date !== todayKey && ` le ${formatDayMonth(e.date)}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ONGLETS VUE */}
      <Tabs value={view} onValueChange={setView}>
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          {[
            { value: 'month', label: 'Vue Mois', icon: CalendarIcon, color: 'from-blue-500 to-blue-600' },
            { value: 'week',  label: 'Vue Semaine', icon: Clock, color: 'from-green-500 to-green-600' },
            { value: 'day',   label: 'Vue Jour', icon: Target, color: 'from-purple-500 to-purple-600' },
          ].map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}
              className={`flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.color} data-[state=active]:text-white transition-all`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ============ VUE MOIS : Mini-cal à gauche + Liste à droite ============ */}
        <TabsContent value="month" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-6">
            {/* COL GAUCHE — Mini calendrier */}
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />Calendrier
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selected}
                  onSelect={(d) => d && setSelected(d)}
                  initialFocus
                  className="p-0 pointer-events-auto"
                />
              </CardContent>
            </Card>

            {/* COL DROITE — Liste événements du jour */}
            <Card className="border-2 border-primary/10 min-h-[500px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="capitalize">
                  Événements du {selected.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </CardTitle>
                <Button size="sm" onClick={() => openNewDialog(selected)}
                  className="bg-gradient-to-r from-primary to-accent text-white">
                  <Plus className="h-4 w-4 mr-2" />Nouvel événement
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {dayEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun événement ce jour</p>
                  </div>
                ) : (
                  dayEvents.map(e => {
                    const T = TYPE_META[e.type]
                    const S = STATUS_META[e.status]
                    const TypeIcon = T.icon
                    const StatusIcon = S.icon
                    return (
                      <div key={e.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-medium">{e.title}</h4>
                              <Badge variant="secondary" className={T.color}>
                                <TypeIcon className="h-3 w-3 mr-1" />{T.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {e.time ? `${e.time}${e.endTime ? ` - ${e.endTime}` : ''}` : 'Toute la journée'}
                              </span>
                              {e.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />{e.location}
                                </span>
                              )}
                              {e.isVirtual && (
                                <span className="flex items-center gap-1">
                                  <Video className="h-3 w-3" />Visio
                                </span>
                              )}
                            </div>
                            {e.description && <p className="text-sm text-muted-foreground mb-2">{e.description}</p>}
                            {e.participants?.length > 0 && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3" />{e.participants.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingEvent(e)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(e)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(e.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <Badge variant="outline" className={S.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />{S.label}
                          </Badge>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ VUE SEMAINE ============ */}
        <TabsContent value="week" className="space-y-4 mt-6">
          <Card className="border-2 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Vue Semaine</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Semaine du {formatDayMonth(weekDays[0])} au {formatDayMonth(weekDays[6])} {weekDays[6].getFullYear()}
                </p>
              </div>
              <Button size="sm" onClick={() => openNewDialog(selected)} className="bg-gradient-to-r from-primary to-accent text-white">
                <Plus className="h-4 w-4 mr-2" />Nouvel événement
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {weekDays.map((d, i) => {
                const key = toDateKey(d)
                const dEvents = filteredEvents.filter(e => e.date === key).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                const isToday = key === todayKey
                return (
                  <Card key={key} className={isToday ? 'border-2 border-primary bg-primary/5' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">{DAYS_FULL[i]} {d.getDate()} {MONTHS_FR[d.getMonth()].slice(0, 4).toLowerCase()}</p>
                          {isToday && <Badge className="bg-gradient-to-r from-primary to-accent text-white">Aujourd'hui</Badge>}
                        </div>
                        <Badge variant="outline">
                          {dEvents.length} événement{dEvents.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      {dEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun événement</p>
                      ) : (
                        <div className="space-y-2">
                          {dEvents.map(e => {
                            const T = TYPE_META[e.type]
                            const TypeIcon = T.icon
                            return (
                              <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition">
                                <div className="text-sm text-muted-foreground w-16 flex-shrink-0">
                                  {e.time || 'Toute\njournée'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium truncate">{e.title}</p>
                                    <Badge variant="secondary" className={T.color}>
                                      <TypeIcon className="h-3 w-3 mr-1" />{T.label}
                                    </Badge>
                                  </div>
                                  {e.description && (
                                    <p className="text-xs text-muted-foreground mt-1 truncate">{e.description}</p>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingEvent(e)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(e)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ VUE JOUR DÉTAILLÉE (timeline horaire) ============ */}
        <TabsContent value="day" className="space-y-4 mt-6">
          <Card className="border-2 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Vue Jour Détaillée</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {selected.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <Button size="sm" onClick={() => openNewDialog(selected)} className="bg-gradient-to-r from-primary to-accent text-white">
                <Plus className="h-4 w-4 mr-2" />Nouvel événement
              </Button>
            </CardHeader>
            <CardContent>
              {/* Récap haut */}
              <div className={`mb-4 p-3 rounded-lg border flex items-center justify-between ${dayKey === todayKey ? 'bg-primary/10 border-primary/30' : 'bg-muted/30'}`}>
                <div>
                  <p className="font-medium">{dayEvents.length} événement{dayEvents.length > 1 ? 's' : ''} prévu{dayEvents.length > 1 ? 's' : ''}</p>
                  <p className="text-xs text-muted-foreground">
                    {dayEvents.filter(e => e.time).length} avec horaire défini
                  </p>
                </div>
                {dayKey === todayKey && (
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white">Aujourd'hui</Badge>
                )}
              </div>

              {/* Timeline horaire */}
              <div className="space-y-0 divide-y border rounded-lg overflow-hidden">
                {hoursList.map(hour => {
                  const eventsAtHour = dayEvents.filter(e => e.time && e.time.startsWith(hour.slice(0, 2)))
                  return (
                    <div key={hour} className="flex min-h-[60px]">
                      <div className="w-20 flex-shrink-0 p-3 text-sm text-muted-foreground bg-muted/20 border-r">
                        {hour}
                      </div>
                      <div className="flex-1 p-2 space-y-2">
                        {eventsAtHour.length === 0 ? (
                          <div className="h-full flex items-center text-xs text-muted-foreground/50">—</div>
                        ) : (
                          eventsAtHour.map(e => {
                            const T = TYPE_META[e.type]
                            const TypeIcon = T.icon
                            return (
                              <div key={e.id} onClick={() => setViewingEvent(e)}
                                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition flex-wrap">
                                <div className="flex flex-col items-center min-w-[60px]">
                                  <span className="text-sm font-medium">{e.time}</span>
                                  {e.endTime && <span className="text-xs text-muted-foreground">— {e.endTime}</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium">{e.title}</p>
                                    <Badge variant="secondary" className={T.color}>
                                      <TypeIcon className="h-3 w-3 mr-1" />{T.label}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                                    {e.location && (
                                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>
                                    )}
                                    {e.participants?.length > 0 && (
                                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{e.participants.length} participant{e.participants.length > 1 ? 's' : ''}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(ev) => { ev.stopPropagation(); setViewingEvent(e) }}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(ev) => { ev.stopPropagation(); openEditDialog(e) }}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Événements sans horaire */}
              {dayEvents.filter(e => !e.time).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Événements sans horaire</p>
                  <div className="space-y-2">
                    {dayEvents.filter(e => !e.time).map(e => {
                      const T = TYPE_META[e.type]
                      const TypeIcon = T.icon
                      return (
                        <div key={e.id} onClick={() => setViewingEvent(e)}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 cursor-pointer">
                          <div className="text-sm text-muted-foreground">Toute journée</div>
                          <p className="flex-1 font-medium">{e.title}</p>
                          <Badge variant="secondary" className={T.color}>
                            <TypeIcon className="h-3 w-3 mr-1" />{T.label}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG NOUVEAU */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvel événement</DialogTitle>
            <DialogDescription>Crée un événement dans ton calendrier</DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Annuler</Button>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-primary to-accent text-white">
              <Plus className="h-4 w-4 mr-2" />Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG ÉDITION */}
      <Dialog open={!!editingEvent} onOpenChange={(o) => !o && setEditingEvent(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'événement</DialogTitle>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter className="flex-wrap gap-2">
            <Button variant="destructive" onClick={() => handleDelete(editingEvent?.id)}>
              <Trash2 className="h-4 w-4 mr-2" />Supprimer
            </Button>
            <Button variant="outline" onClick={() => setEditingEvent(null)}>Annuler</Button>
            <Button onClick={handleEdit} className="bg-gradient-to-r from-primary to-accent text-white">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG DÉTAILS */}
      <Dialog open={!!viewingEvent} onOpenChange={(o) => !o && setViewingEvent(null)}>
        <DialogContent className="max-w-lg">
          {viewingEvent && (() => {
            const T = TYPE_META[viewingEvent.type]
            const S = STATUS_META[viewingEvent.status]
            const TypeIcon = T.icon
            const StatusIcon = S.icon
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={T.color}>
                      <TypeIcon className="h-3 w-3 mr-1" />{T.label}
                    </Badge>
                    <Badge variant="outline" className={S.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />{S.label}
                    </Badge>
                  </div>
                  <DialogTitle>{viewingEvent.title}</DialogTitle>
                  <DialogDescription className="capitalize">
                    {new Date(viewingEvent.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  {viewingEvent.time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{viewingEvent.time}{viewingEvent.endTime && ` - ${viewingEvent.endTime}`}</span>
                    </div>
                  )}
                  {viewingEvent.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{viewingEvent.location}</span>
                    </div>
                  )}
                  {viewingEvent.isVirtual && (
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>Visioconférence</span>
                    </div>
                  )}
                  {viewingEvent.participants?.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {viewingEvent.participants.map((p, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {viewingEvent.description && (
                    <p className="text-sm text-muted-foreground pt-2 border-t">{viewingEvent.description}</p>
                  )}
                </div>
                <DialogFooter className="flex-wrap gap-2">
                  <Button variant="destructive" onClick={() => handleDelete(viewingEvent.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />Supprimer
                  </Button>
                  <Button variant="outline" onClick={() => setViewingEvent(null)}>Fermer</Button>
                  <Button onClick={() => openEditDialog(viewingEvent)}>
                    <Edit className="h-4 w-4 mr-2" />Modifier
                  </Button>
                </DialogFooter>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}