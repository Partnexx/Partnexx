'use client'
import { useState } from 'react'

export default function Calendrier() {
  const [view, setView] = useState('mois')
  const [selectedDate, setSelectedDate] = useState(31)
  const [selectedMonth, setSelectedMonth] = useState(2) // March = index 2
  const [selectedYear, setSelectedYear] = useState(2026)
  const [showModal, setShowModal] = useState(false)

  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif" }
  const card = { background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', padding: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }

  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa']

  // Events data
  const events = [
    { id: 1, date: '2026-03-31', time: '10:00', endTime: '11:00', title: 'Call onboarding Luna Studio', type: 'Réunion', typeColor: '#a855f7', typeBg: '#f3e8ff', lieu: 'Salle de réunion A', desc: 'Briefing initial pour la campagne UGC Q3', participants: 'Marie Dubois, Alex Martin', status: 'Confirmé', statusColor: '#22c55e', statusBg: '#dcfce7', rappels: 2 },
    { id: 2, date: '2026-03-31', time: '15:30', endTime: '16:30', title: 'Validation UGC Campagne Noël', type: 'UGC à valider', typeColor: '#22c55e', typeBg: '#dcfce7', lieu: 'Visio', desc: 'Revue des contenus créateurs pour validation finale', participants: 'Sophie Laurent', status: 'À venir', statusColor: '#f59e0b', statusBg: '#fef3c7', rappels: 2 },
    { id: 3, date: '2026-04-01', time: '14:00', endTime: '15:00', title: 'Deadline campagne Noël', type: 'Deadline', typeColor: '#ef4444', typeBg: '#fee2e2', lieu: '', desc: 'Livraison finale du brief créatif Nova Media', participants: '', status: 'À venir', statusColor: '#f59e0b', statusBg: '#fef3c7', rappels: 1 },
    { id: 4, date: '2026-04-03', time: '09:00', endTime: '10:00', title: 'Lancement campagne printemps', type: 'Campagne', typeColor: '#3b82f6', typeBg: '#dbeafe', lieu: '', desc: 'Kick off avec les créateurs sélectionnés', participants: '', status: 'À venir', statusColor: '#f59e0b', statusBg: '#fef3c7', rappels: 0 },
    { id: 5, date: '2026-04-05', allDay: true, title: 'UGC à valider - Marie', type: 'UGC à valider', typeColor: '#22c55e', typeBg: '#dcfce7', lieu: '', desc: '3 vidéos TikTok à reviewer', participants: '', status: 'À venir', statusColor: '#f59e0b', statusBg: '#fef3c7', rappels: 1 },
  ]

  const rappels = [
    { label: 'Deadline campagne Noël', time: '14:00 le 1 avr.' },
    { label: 'Lancement campagne printemps', time: '09:00 le 3 avr.' },
    { label: 'UGC à valider - Marie', time: 'le 5 avr.' },
  ]

  // Calendar grid
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay()

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  const getEventsForDate = (day) => {
    if (!day) return []
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return events.filter(e => e.date === dateStr)
  }

  const selectedDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2,'0')}-${String(selectedDate).padStart(2,'0')}`
  const selectedEvents = events.filter(e => e.date === selectedDateStr)

  // Week view: March 30 - April 5, 2026
  const weekDays = [
    { label: 'lundi 30 mars', date: '2026-03-30', isToday: false },
    { label: 'mardi 31 mars', date: '2026-03-31', isToday: true },
    { label: 'mercredi 1 avril', date: '2026-04-01', isToday: false },
    { label: 'jeudi 2 avril', date: '2026-04-02', isToday: false },
    { label: 'vendredi 3 avril', date: '2026-04-03', isToday: false },
    { label: 'samedi 4 avril', date: '2026-04-04', isToday: false },
    { label: 'dimanche 5 avril', date: '2026-04-05', isToday: false },
  ]

  // Day view hours
  const hours = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00']

  const TypeBadge = ({ type, typeColor, typeBg }) => (
    <span style={{ background: typeBg, color: typeColor, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>{type}</span>
  )

  return (
    <div style={{ ...s, padding: '2rem', background: '#f8f9ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Calendrier</h1>
              <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
            </div>
            <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Planification intelligente de vos campagnes et événements</p>
          </div>
        </div>
      </div>

      {/* CALENDRIER ENTREPRISE */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c' }}>Calendrier Entreprise</div>
            <div style={{ fontSize: '0.78rem', color: '#718096' }}>Gérez vos événements, deadlines et campagnes</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568' }}>
            ⬇ Exporter (.ics)
          </button>
        </div>

        {/* 3 metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
          {[["Aujourd'hui", '2', 'événements'], ["Cette semaine", '5', 'événements'], ["Deadlines à venir", '1', 'deadlines']].map(([label, val, sub]) => (
            <div key={label} style={card}>
              <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.3rem' }}>{label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.15rem' }}>{val}</div>
              <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Rappels automatiques */}
        <div style={{ ...card, marginBottom: '1.25rem', background: '#faf5ff', border: '1px solid #e9d5ff' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            🔔 Rappels automatiques
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {rappels.map((r, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.78rem', color: '#4a5568' }}>
                🔔 <strong style={{ color: '#a855f7' }}>{r.label}</strong> — {r.time}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW TABS */}
      <div style={{ display: 'flex', gap: '0', background: '#f8f9fa', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        {[
          { id: 'mois', icon: '📅', label: 'Vue Mois', activeColor: '#3b82f6' },
          { id: 'semaine', icon: '🗓', label: 'Vue Semaine', activeColor: '#22c55e' },
          { id: 'jour', icon: '🕐', label: 'Vue Jour', activeColor: '#a855f7' },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            flex: 1, padding: '0.65rem 1rem', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.85rem',
            fontWeight: view === t.id ? 700 : 400,
            background: view === t.id ? t.activeColor : 'transparent',
            color: view === t.id ? '#fff' : '#718096',
            borderRadius: '8px', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== VUE MOIS ===== */}
      {view === 'mois' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
          {/* Mini calendar */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              📅 Calendrier
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <button onClick={() => setSelectedMonth(m => m === 0 ? 11 : m - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#718096' }}>‹</button>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{monthNames[selectedMonth]} {selectedYear}</span>
              <button onClick={() => setSelectedMonth(m => m === 11 ? 0 : m + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#718096' }}>›</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '0.5rem' }}>
              {dayNames.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', color: '#a0aec0', fontWeight: 600, padding: '0.2rem 0' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
              {calendarDays.map((day, i) => {
                const hasEvents = day && getEventsForDate(day).length > 0
                const isSelected = day === selectedDate
                const isToday = day === 31 && selectedMonth === 2 && selectedYear === 2026
                return (
                  <div
                    key={i}
                    onClick={() => day && setSelectedDate(day)}
                    style={{
                      textAlign: 'center', padding: '0.35rem 0.2rem', borderRadius: '6px', cursor: day ? 'pointer' : 'default',
                      background: isSelected ? '#a855f7' : isToday ? '#f3e8ff' : 'transparent',
                      color: isSelected ? '#fff' : isToday ? '#a855f7' : day ? '#1a202c' : '#e2e8f0',
                      fontSize: '0.78rem', fontWeight: isSelected || isToday ? 700 : 400,
                      position: 'relative',
                    }}
                  >
                    {day || ''}
                    {hasEvents && !isSelected && (
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a855f7', margin: '1px auto 0' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Events for selected day */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                Événements du {selectedDate ? `${selectedDate > 28 ? 'mardi' : ''} ${selectedDate} ${monthNames[selectedMonth]} ${selectedYear}` : ''}
              </div>
              <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600 }}>
                + Nouvel événement
              </button>
            </div>

            {selectedEvents.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#a0aec0', padding: '2rem', fontSize: '0.875rem' }}>Aucun événement ce jour</div>
            ) : (
              selectedEvents.map(evt => (
                <div key={evt.id} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{evt.title}</span>
                      <TypeBadge type={evt.type} typeColor={evt.typeColor} typeBg={evt.typeBg} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>👁</button>
                      <button style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>✏</button>
                      <button style={{ width: '28px', height: '28px', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#ef4444' }}>🗑</button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#718096', display: 'flex', gap: '1rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    {!evt.allDay && <span>🕐 {evt.time} - {evt.endTime}</span>}
                    {evt.lieu && <span>📍 {evt.lieu}</span>}
                  </div>
                  {evt.desc && <div style={{ fontSize: '0.78rem', color: '#4a5568', marginBottom: '0.35rem' }}>{evt.desc}</div>}
                  {evt.participants && <div style={{ fontSize: '0.72rem', color: '#a0aec0', marginBottom: '0.5rem' }}>👥 {evt.participants}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: evt.statusBg, color: evt.statusColor, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>{evt.status}</span>
                    {evt.rappels > 0 && <span style={{ fontSize: '0.68rem', color: '#a0aec0' }}>🔔 {evt.rappels} rappel(s)</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===== VUE SEMAINE ===== */}
      {view === 'semaine' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Vue Semaine</div>
              <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>Semaine du 30 mars au 5 avr. 2026</div>
            </div>
            <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600 }}>
              + Nouvel événement
            </button>
          </div>

          {weekDays.map((day) => {
            const dayEvents = events.filter(e => e.date === day.date)
            return (
              <div key={day.date} style={{ border: day.isToday ? '2px solid #a855f720' : '1px solid #f0f0f0', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '0.75rem', background: day.isToday ? '#faf5ff' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: dayEvents.length > 0 ? '0.65rem' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: day.isToday ? '#a855f7' : '#1a202c' }}>{day.label}</span>
                    {day.isToday && <span style={{ background: '#a855f7', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '100px' }}>Aujourd'hui</span>}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{dayEvents.length} événement{dayEvents.length !== 1 ? 's' : ''}</span>
                </div>
                {dayEvents.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>Aucun événement</div>
                ) : (
                  dayEvents.map(evt => (
                    <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.55rem 0', borderTop: '1px solid #f5f5f5' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 500, flexShrink: 0, width: '40px' }}>{evt.allDay ? 'Toute journée' : evt.time}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{evt.title}</span>
                            <TypeBadge type={evt.type} typeColor={evt.typeColor} typeBg={evt.typeBg} />
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{evt.desc}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button style={{ width: '26px', height: '26px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.7rem' }}>👁</button>
                        <button style={{ width: '26px', height: '26px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.7rem' }}>✏</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ===== VUE JOUR ===== */}
      {view === 'jour' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Vue Jour Détaillée</div>
              <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>Mardi 31 mars 2026</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.4rem 0.75rem', background: '#f3e8ff', color: '#a855f7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 600 }}>Aujourd'hui</button>
              <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600 }}>
                + Nouvel événement
              </button>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '0.6rem 0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>2 événements prévus</span>
            <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>2 avec horaire défini</span>
          </div>

          {/* Timeline */}
          {hours.map((hour) => {
            const hourEvt = events.find(e => e.date === '2026-03-31' && e.time && e.time.startsWith(hour.slice(0,2)))
            return (
              <div key={hour} style={{ display: 'flex', gap: '0', minHeight: '44px', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ width: '50px', flexShrink: 0, paddingTop: '0.4rem', fontSize: '0.68rem', color: '#a0aec0', fontWeight: 500 }}>{hour}</div>
                <div style={{ flex: 1, paddingLeft: '0.75rem', paddingTop: '0.3rem', paddingBottom: '0.3rem' }}>
                  {hourEvt ? (
                    <div style={{ background: hourEvt.typeBg, border: `1px solid ${hourEvt.typeColor}30`, borderLeft: `3px solid ${hourEvt.typeColor}`, borderRadius: '6px', padding: '0.4rem 0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a202c' }}>{hourEvt.time} {hourEvt.title}</span>
                          <TypeBadge type={hourEvt.type} typeColor={hourEvt.typeColor} typeBg={hourEvt.typeBg} />
                        </div>
                        {hourEvt.lieu && <div style={{ fontSize: '0.68rem', color: '#718096' }}>📍 {hourEvt.lieu} {hourEvt.participants && `• 👥 ${hourEvt.participants.split(',').length} participant(s)`}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.65rem' }}>👁</button>
                        <button style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.65rem' }}>✏</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.62rem', color: '#e2e8f0', paddingTop: '0.1rem' }}>—</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL NOUVEL ÉVÉNEMENT */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>+ Nouvel événement</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#a0aec0' }}>✕</button>
            </div>
            {[['Titre', 'text', 'Ex: Réunion Luna Studio'], ['Date', 'date', ''], ['Heure début', 'time', ''], ['Lieu', 'text', 'Ex: Salle de réunion A']].map(([label, type, ph]) => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                <input type={type} placeholder={ph} style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Type</label>
              <select style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: '#4a5568', background: '#fff' }}>
                {['Réunion', 'Deadline', 'Campagne', 'UGC à valider', 'Autre'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700 }}>
              Créer l'événement
            </button>
          </div>
        </div>
      )}
    </div>
  )
}