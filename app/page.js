'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: 'linear-gradient(135deg, #a8edea 0%, #c3b1e1 30%, #f8a4c8 60%, #ffd6e0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 3rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}>💜</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a2e' }}>Partnexx</span>
        </div>

        <button
          onClick={() => router.push('/login')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.6rem 1.25rem',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: '100px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#1a1a2e',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Connexion →
        </button>
      </nav>

      {/* HERO */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem 1rem',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 900,
          color: '#0f0f1a',
          lineHeight: 1.1,
          marginBottom: '0.25rem',
          margin: 0,
        }}>
          Une plateforme.
        </h1>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #38bdf8, #a78bfa, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
          margin: '0 0 1.25rem',
        }}>
          Deux expériences.
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#4a4a6a',
          fontWeight: 400,
          marginBottom: '3rem',
        }}>
          Deux expériences pensées pour les marques et les créateurs.
        </p>

        {/* CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
          maxWidth: '820px',
          width: '100%',
        }}>
          {/* Carte Marque */}
          <div
            onMouseEnter={() => setHoveredCard('brand')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: hoveredCard === 'brand' ? '0 20px 60px rgba(0,0,0,0.12)' : '0 8px 32px rgba(0,0,0,0.06)',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              transform: hoveredCard === 'brand' ? 'translateY(-4px)' : 'translateY(0)',
            }}
          >
            <div style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
              marginBottom: '1.25rem',
            }}>📢</div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f0f1a', marginBottom: '0.6rem', margin: '0 0 0.6rem' }}>
              Je suis une marque
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Lance des campagnes, trouve les bons créateurs et mesure tes performances.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
              {['Matching IA', 'Analytics', 'Paiements sécurisés'].map(f => (
                <span key={f} style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.78rem', color: '#374151', fontWeight: 500,
                  background: '#f3f4f6', borderRadius: '100px',
                  padding: '0.3rem 0.75rem',
                }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>✓</span> {f}
                </span>
              ))}
            </div>

            <button
              onClick={() => router.push('/signup?role=brand')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Lancer une campagne →
            </button>
          </div>

          {/* Carte Créateur */}
          <div
            onMouseEnter={() => setHoveredCard('creator')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: hoveredCard === 'creator' ? '0 20px 60px rgba(0,0,0,0.12)' : '0 8px 32px rgba(0,0,0,0.06)',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              transform: hoveredCard === 'creator' ? 'translateY(-4px)' : 'translateY(0)',
            }}
          >
            <div style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
              marginBottom: '1.25rem',
            }}>✨</div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f0f1a', marginBottom: '0.6rem', margin: '0 0 0.6rem' }}>
              Je suis un créateur
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Accède à des collaborations, développe ton audience et monétise ton contenu.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
              {['Contrats automatisés', 'Campagnes rémunérées', 'Partnexx Score'].map(f => (
                <span key={f} style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.78rem', color: '#374151', fontWeight: 500,
                  background: '#f3f4f6', borderRadius: '100px',
                  padding: '0.3rem 0.75rem',
                }}>
                  <span style={{ color: '#a78bfa', fontWeight: 700 }}>✓</span> {f}
                </span>
              ))}
            </div>

            <button
              onClick={() => router.push('/signup?role=influencer')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Rejoindre Partnexx →
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 3rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '24px', height: '24px',
            background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem',
          }}>💜</div>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a2e' }}>Partnexx</span>
          <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>© 2026</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Mentions légales', 'CGU', 'Politique de confidentialité'].map(link => (
            <a key={link} href="#" style={{ fontSize: '0.82rem', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>{link}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}