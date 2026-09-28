import { useState, useEffect, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
type Photo = string | null
type EightPhotos = [Photo, Photo, Photo, Photo, Photo, Photo, Photo, Photo]

// ── Defaults (Unsplash) ───────────────────────────────────────────────────
const U = 'https://images.unsplash.com/photo-'
const driveThumbnail = (id: string, width: number, height: number) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${width}-h${height}`
const EXTRA_PHOTOS_BY_SLIDE = [
  [
    driveThumbnail('1-S8X1HbP3ndGVu5mVxqhuVXWuuJ1YqUL', 320, 380),
    driveThumbnail('10RZjsRUQZ0nE6LxZOEjk_YLRPk6nngCw', 320, 380),
    driveThumbnail('11X8y6DKGkkSAa3WQNsAXcgCR3Vey40Xz', 320, 380),
    driveThumbnail('12M0Z7NMxicgk9Y8ERlbuB4yv5a6jtpRj', 320, 380),
    driveThumbnail('150P_aP9bkREmcRbN7AXOPwHn298RYRQI', 320, 380),
  ],
  [
    driveThumbnail('19vX2_qsdb33HZzYVlhHsdiLARhV69VsP', 260, 260),
    driveThumbnail('1A3f5Ogg407eg9cwWP1YAj7swQP2dxgzG', 260, 260),
    driveThumbnail('1BS8KN8eI134VUxv7C5C4MS10nEOZsfTK', 260, 260),
    driveThumbnail('1DBAXcQsZtw4ix_imE5jjupQ_bzNmbm-A', 260, 260),
    driveThumbnail('1G45a6cAUxv9HR-WoJC39M3p3T9uRTiMT', 260, 260),
  ],
  [
    driveThumbnail('1GJ3ZL5hwu6Z2nFbyPgyGElCyOErsMhe1', 200, 460),
    driveThumbnail('1GoBtx8FpTeCqPJPqrfVlbunjG-OPCzgp', 200, 460),
    driveThumbnail('1JS7_5iKVFpPyDKpDpqrFBHeXrE5jr_N8', 200, 460),
    driveThumbnail('1MBnEuSMLEZSi4z1uwp-a2dpOIwhDUPnx', 200, 460),
    driveThumbnail('1MD6Seb_9R-XP57Li-gWcIaDg6NHSAflB', 200, 460),
  ],
  [
    driveThumbnail('1Me2xdm8c9XAbO4J9NTAk4uC2NqcZQAL6', 240, 300),
    driveThumbnail('1Mr8ZMch3sQZjz2VcriSQu3RVV4vWtVfx', 240, 300),
    driveThumbnail('1N5W1Zy4TgCK1AjV9ZZE-YwtEZLQPkdWO', 240, 300),
    driveThumbnail('1NeEYYpd2uN3C-V-2-uI5EOMUkyQUwq5I', 240, 300),
    driveThumbnail('1OaXbXVXkNfDSQgwgkAzPuE92kVq1NdYz', 240, 300),
  ],
  [
    driveThumbnail('1PYEVT90bwxwK6tT8HOfB4bQfTWfntPRG', 180, 180),
    driveThumbnail('1QHXog7Z47tg0kO4-pBnLP4Pf2L2Zwx_h', 180, 180),
    driveThumbnail('1WRLzFhLaDaikQp7rljiwTH4aWi9hJS_g', 180, 180),
    driveThumbnail('1Zp9o6wz0QmruRLbETWKN46QZbzhnxyrw', 180, 180),
    driveThumbnail('1ZulJNFJk4PfosHIgMxnOVIclSUAW5unL', 180, 180),
  ],
  [
    driveThumbnail('1_36aTEWh1izqOHedi31wtWI0xKFVkL06', 210, 260),
    driveThumbnail('1_UDXQVoDbfxp9LsPD0jiV6Ixwp60jfbF', 210, 260),
    driveThumbnail('1_ywyzjQNMU5VvPlyQ4MeLyUTlFF1lycd', 210, 260),
    driveThumbnail('1b29N_PFqTK95wyx2PKrLWg07ZqVPKkrS', 210, 260),
    driveThumbnail('1dLJfxzhZySp1oZZSl92DEbf8uL0PJKMV', 210, 260),
  ],
  [
    driveThumbnail('1dw09gHlr31FMCLVEcyMe5i295VfCc8FI', 210, 210),
    driveThumbnail('1eTOOU2NYRi1Bkt3OfO705dP6TW9SpScg', 210, 210),
    driveThumbnail('1fTiZKXWHr7mapZNWSn5TEDuim8NvM8IF', 210, 210),
    driveThumbnail('1gNBoFy0vTLC-_OnxzFa5sTNCikGwV0iT', 210, 210),
    driveThumbnail('1hNuFyw4mo6dIZooaet8HPrCDkSeS7Chi', 210, 210),
  ],
  [
    driveThumbnail('1jpL4UX3PyPyNviESLUunyFwRCgWNf51S', 380, 360),
    driveThumbnail('1jrcyoEhUBQCeesGfCotjhIA7Ra0pL_CI', 190, 112),
    driveThumbnail('1llk3CmHjFHdla3iWh8z9kfGhERSRYbcR', 190, 112),
    driveThumbnail('1mUbp4HSn-AHEssLqQ7qlERvSwLr03JZS', 190, 112),
    driveThumbnail('1n2jrFqZOGesbeJ9y3Fbiq4DEySHSmIG4', 190, 112),
  ],
  [
    driveThumbnail('1o7AVtQv1iS4zQJUpFjKf10lVznk5frNy', 270, 270),
    driveThumbnail('1oK9BdIoIAueC9eHnhfYDfk45Bsgt7Oyt', 270, 270),
    driveThumbnail('1pvaZlheDDWrUoHgMhOFKxNiQlF3Q1a9X', 270, 270),
    driveThumbnail('1rQPgH4lWrt4Rzpl44tNH7CulcYx2i4c9', 270, 270),
    driveThumbnail('1sxCHBGzL7WAO8xcCcIFXm8hokgInTodz', 270, 270),
  ],
  [
    driveThumbnail('1t3scZ_bgScmP8sO0suB3rzJO-4p6vp9N', 270, 330),
    driveThumbnail('1uvHMYfZf9n65jdPc-XVtl_uSf0X-XmW5', 270, 330),
    driveThumbnail('1v9n7iQecurQqtpweNkiSfD-sp3cZnJ07', 270, 330),
    driveThumbnail('1voL9_YBgtaBtLFu_eSKFjITeXJxSTkri', 270, 330),
    driveThumbnail('1wDyNTgCsTJtTl5WVNrSeJOMK4HTUDr8-', 270, 330),
  ],
] as const
const DRIVE_PHOTOS = EXTRA_PHOTOS_BY_SLIDE.flat()

function shuffleArray<T>(items: readonly T[]): T[] {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[randomIndex]] = [next[randomIndex], next[index]]
  }
  return next
}

function createRandomPhotoSets(photoPool: readonly string[]): EightPhotos[] {
  return Array.from({ length: 10 }, () => {
    const shuffled = shuffleArray(photoPool)
    return shuffled.slice(0, 8) as EightPhotos
  })
}

const DEFAULTS: EightPhotos[] = createRandomPhotoSets(DRIVE_PHOTOS).map(set => shuffleArray(set) as EightPhotos)

// ── Design tokens ─────────────────────────────────────────────────────────
const ROSE_GOLD = '#B76E79'
const BLUSH = '#FF4D79'
const DEEP = '#2D2D2D'
const SOFT_ROSE = '#A35C6A'

type SoundEffect = 'nav' | 'tap' | 'upload' | 'blow' | 'gift' | 'confetti' | 'birthday'

let sharedAudioContext: AudioContext | null = null

function playSynthSound(effect: SoundEffect) {
  try {
    const AudioContextClass = window.AudioContext
      || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    const context = sharedAudioContext ?? new AudioContextClass()
    sharedAudioContext = context
    if (context.state === 'suspended') void context.resume()

    const now = context.currentTime
    const tone = (
      frequency: number,
      start: number,
      duration: number,
      type: OscillatorType = 'sine',
      volume = 0.045,
      endFrequency = frequency,
    ) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, start)
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.018)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(start)
      oscillator.stop(start + duration + 0.02)
    }

    const noise = (start: number, duration: number, volume: number, cutoff: number) => {
      const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1
      const source = context.createBufferSource()
      const filter = context.createBiquadFilter()
      const gain = context.createGain()
      source.buffer = buffer
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(cutoff, start)
      gain.gain.setValueAtTime(volume, start)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      source.connect(filter).connect(gain).connect(context.destination)
      source.start(start)
    }

    if (effect === 'nav') {
      tone(430, now, 0.12, 'sine', 0.035, 560)
    } else if (effect === 'tap') {
      tone(620, now, 0.09, 'sine', 0.025, 700)
    } else if (effect === 'upload') {
      tone(440, now, 0.16, 'triangle', 0.04, 660)
      tone(660, now + 0.09, 0.18, 'triangle', 0.035, 880)
    } else if (effect === 'blow') {
      noise(now, 0.48, 0.075, 1500)
      tone(260, now + 0.25, 0.3, 'sine', 0.024, 520)
    } else if (effect === 'gift') {
      ;[523, 659, 784, 1047].forEach((frequency, i) => {
        tone(frequency, now + i * 0.075, 0.34, 'sine', 0.035)
      })
    } else if (effect === 'confetti') {
      noise(now, 0.34, 0.045, 3800)
      ;[659, 784, 988].forEach((frequency, i) => {
        tone(frequency, now + 0.04 + i * 0.07, 0.3, 'triangle', 0.035)
      })
    } else if (effect === 'birthday') {
      const melody = [
        [392, 0.26], [392, 0.26], [440, 0.42], [392, 0.42], [523.25, 0.42], [494, 0.62],
        [392, 0.26], [392, 0.26], [440, 0.42], [392, 0.42], [587.33, 0.42], [523.25, 0.62],
        [392, 0.26], [392, 0.26], [784, 0.42], [659.25, 0.42], [523.25, 0.42], [494, 0.42],
        [440, 0.78],
      ] as const

      melody.forEach(([frequency, duration], index) => {
        const start = now + index * 0.22
        tone(frequency, start, duration, 'triangle', 0.032)
      })
    }
  } catch {
    // Audio is an enhancement; unsupported or blocked playback should not affect the deck.
  }
}

// ── Shared helpers ────────────────────────────────────────────────────────
const pjSans: React.CSSProperties = { fontFamily: "'Plus Jakarta Sans', sans-serif" }
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" }

function PhotoPlaceholder({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="photo-placeholder"
      onClick={onClick}
      style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', gap: 8,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" stroke={ROSE_GOLD} strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M11 7v8M7 11h8" stroke={ROSE_GOLD} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span style={{ ...pjSans, fontSize: 10, color: ROSE_GOLD, fontWeight: 500 }}>Add photo</span>
    </div>
  )
}

function Tape({ rotate = 0 }: { rotate?: number }) {
  return (
    <div className="tape" style={{
      width: 42, height: 15,
      background: 'rgba(255, 192, 203, 0.48)',
      borderRadius: 4,
      transform: `rotate(${rotate}deg)`,
      boxShadow: '0 1px 3px rgba(183,110,121,0.12)',
    }} />
  )
}

interface PolaroidProps {
  photo: Photo
  caption?: string
  editableCaption?: boolean
  onCaptionChange?: (v: string) => void
  style?: React.CSSProperties
  onClick?: () => void
  tape?: 'top' | 'corners' | false
  tapeRotate?: number
}
function Polaroid({ photo, caption, editableCaption, onCaptionChange, style, onClick, tape, tapeRotate = 0 }: PolaroidProps) {
  return (
    <div className="photo-card" style={{
      background: 'rgba(255,255,255,0.94)',
      padding: '7px 7px 26px',
      border: '1px solid rgba(255,255,255,0.88)',
      boxShadow: '0 10px 28px rgba(126,65,78,0.12)',
      borderRadius: 3,
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
      transition: 'transform 0.28s ease, box-shadow 0.28s ease',
      ...style,
    }}>
      {tape === 'top' && (
        <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)' }}>
          <Tape rotate={tapeRotate} />
        </div>
      )}
      {tape === 'corners' && (
        <>
          <div style={{ position: 'absolute', top: -8, left: 10 }}><Tape rotate={-14} /></div>
          <div style={{ position: 'absolute', top: -8, right: 10 }}><Tape rotate={14} /></div>
        </>
      )}
      <div
        style={{ flex: 1, background: '#fce4ec', overflow: 'hidden', cursor: 'pointer', minHeight: 0 }}
        onClick={onClick}
      >
        {photo
          ? <img src={photo} alt="Memory" style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              borderStyle: 'none', borderColor: 'rgba(0, 0, 0, 0)',
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px',
              ['--figma-make-local-effect-type' as string]: 'DROP_SHADOW',
              transition: 'transform 0.45s ease',
            }} />
          : <PhotoPlaceholder onClick={onClick} />
        }
      </div>
      {editableCaption ? (
        <input
          type="text" value={caption ?? ''} onChange={e => onCaptionChange?.(e.target.value)}
          placeholder="caption…"
          style={{
            position: 'absolute', bottom: 6, left: 0, right: 0,
            textAlign: 'center', fontSize: 11, color: SOFT_ROSE,
            ...pjSans, border: 'none', outline: 'none', background: 'transparent',
            fontStyle: 'italic',
          }}
        />
      ) : caption ? (
        <p style={{
          position: 'absolute', bottom: 6, left: 0, right: 0,
          textAlign: 'center', fontSize: 11, color: SOFT_ROSE, margin: 0,
          ...pjSans, fontStyle: 'italic',
        }}>{caption}</p>
      ) : null}
    </div>
  )
}

function SlideTag({ label }: { label: string }) {
  return (
    <div className="slide-tag" style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(255,255,255,0.74)',
      border: `1px solid rgba(183,110,121,0.18)`,
      borderRadius: 100, padding: '4px 14px',
      boxShadow: '0 4px 16px rgba(183,110,121,0.07)',
      ...pjSans, fontSize: 10, fontWeight: 700, color: ROSE_GOLD,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>{label}</div>
  )
}

function SlideTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h1 className="slide-title" style={{
      ...playfair, fontStyle: 'italic', fontWeight: 500,
      fontSize: 34, color: DEEP, margin: 0, lineHeight: 1.15,
      ...style,
    }}>{children}</h1>
  )
}

// ── SVG Cake ──────────────────────────────────────────────────────────────
function CakeSVG({ blown }: { blown: boolean }) {
  const candles = [38, 56, 74, 92, 110]
  const sparkles = [
    { x: 20, y: 76, delay: 0 },
    { x: 142, y: 82, delay: 0.08 },
    { x: 18, y: 122, delay: 0.16 },
    { x: 148, y: 126, delay: 0.24 },
    { x: 30, y: 48, delay: 0.32 },
    { x: 132, y: 48, delay: 0.4 },
  ]
  return (
    <svg
      className={`cake-svg ${blown ? 'wish-made' : ''}`}
      width="164"
      height="210"
      viewBox="0 0 164 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={blown ? 'Birthday cake with candles blown out' : 'Birthday cake with glowing candles'}
    >
      {/* Candles */}
      {candles.map((x, i) => (
        <g className="cake-candle" key={i}>
          <rect x={x - 4} y={68} width={8} height={22} rx={3} fill={i % 2 === 0 ? '#FFB3C1' : '#FF85A1'} />
          {!blown ? (
            <g
              className="candle-flame"
              style={{ animationDelay: `${i * 0.09}s`, transformOrigin: `${x}px 66px` }}
            >
              <ellipse cx={x} cy={63} rx={5} ry={7} fill="#FFE082" opacity={0.95} />
              <ellipse cx={x} cy={61} rx={2.5} ry={4} fill="#FF8F00" opacity={0.7} />
            </g>
          ) : (
            <g
              className="candle-smoke"
              style={{ animationDelay: `${i * 0.1}s`, transformOrigin: `${x}px 66px` }}
            >
              <ellipse cx={x} cy={66} rx={3.5} ry={2} fill="#9D8790" opacity={0.32} />
              <path
                d={`M${x} 64 C${x - 5} 57 ${x + 6} 53 ${x} 46 C${x - 4} 41 ${x + 2} 37 ${x + 4} 33`}
                stroke="#B9A5AD"
                strokeWidth="2"
                strokeLinecap="round"
                opacity={0.5}
              />
            </g>
          )}
        </g>
      ))}
      {/* Frosting wavy top of top tier */}
      <path className="cake-frosting" d="M28 92 Q40 84 52 92 Q64 84 76 92 Q88 84 100 92 Q112 84 124 92 Q136 84 148 92V100H28Z" fill="white" opacity={0.7} />
      {/* Top tier */}
      <rect className="cake-tier" x={28} y={90} width={120} height={48} rx={6} fill="#FFCDD2" />
      {[42,56,70,84,98,112,126].map((x,i)=>(
        <circle key={i} cx={x} cy={98} r={4.5} fill="white" opacity={0.65} />
      ))}
      {/* Frosting wavy top of bottom tier */}
      <path className="cake-frosting" d="M8 140 Q22 132 36 140 Q50 132 64 140 Q78 132 92 140 Q106 132 120 140 Q134 132 148 140 Q158 132 168 140V148H8Z" fill="white" opacity={0.65} />
      {/* Bottom tier */}
      <rect className="cake-tier" x={8} y={138} width={160} height={58} rx={6} fill="#F8BBD0" />
      {[22,38,54,70,86,102,118,134,150].map((x,i)=>(
        <circle key={i} cx={x} cy={148} r={5.5} fill="white" opacity={0.6} />
      ))}
      {/* Plate shadow */}
      <ellipse cx={88} cy={198} rx={78} ry={8} fill="#FFDDE1" opacity={0.5} />
      {/* Decorative dots on bottom tier */}
      {[35,65,95,125,155].map((x,i)=>(
        <circle key={i} cx={x} cy={172} r={3} fill={ROSE_GOLD} opacity={0.3} />
      ))}
      {blown && (
        <g className="wish-sparkles">
          {sparkles.map((sparkle, i) => (
            <g
              className="wish-sparkle"
              key={i}
              style={{
                animationDelay: `${sparkle.delay}s`,
                transformOrigin: `${sparkle.x}px ${sparkle.y}px`,
              }}
            >
              <path
                d={`M${sparkle.x} ${sparkle.y - 5} L${sparkle.x + 1.5} ${sparkle.y - 1.5} L${sparkle.x + 5} ${sparkle.y} L${sparkle.x + 1.5} ${sparkle.y + 1.5} L${sparkle.x} ${sparkle.y + 5} L${sparkle.x - 1.5} ${sparkle.y + 1.5} L${sparkle.x - 5} ${sparkle.y} L${sparkle.x - 1.5} ${sparkle.y - 1.5} Z`}
                fill={i % 2 === 0 ? '#FF4D79' : '#FFD166'}
              />
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

// ── SVG Gift ──────────────────────────────────────────────────────────────
function GiftSVG({ opened }: { opened: boolean }) {
  const particles = [
    { x: 32, y: 48, color: '#FF4D79', delay: 0 },
    { x: 54, y: 30, color: '#FFD166', delay: 0.08 },
    { x: 80, y: 22, color: '#FFB3C6', delay: 0.16 },
    { x: 106, y: 30, color: '#B76E79', delay: 0.24 },
    { x: 132, y: 48, color: '#FFD166', delay: 0.32 },
    { x: 24, y: 78, color: '#C9B1FF', delay: 0.4 },
    { x: 140, y: 78, color: '#98D8C8', delay: 0.48 },
  ]
  return (
    <svg
      className={`gift-svg ${opened ? 'is-open' : ''}`}
      width="160"
      height="168"
      viewBox="0 0 160 168"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={opened ? 'An open birthday gift' : 'A wrapped birthday gift'}
    >
      {opened && (
        <g className="gift-burst">
          {particles.map((particle, i) => (
            <g
              className="gift-particle"
              key={i}
              style={{
                animationDelay: `${particle.delay}s`,
                transformOrigin: `${particle.x}px ${particle.y}px`,
              }}
            >
              <circle cx={particle.x} cy={particle.y} r={i % 2 === 0 ? 4 : 3} fill={particle.color} />
              <path
                d={`M${particle.x} ${particle.y - 7}V${particle.y + 7}M${particle.x - 7} ${particle.y}H${particle.x + 7}`}
                stroke={particle.color}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          ))}
          <path className="gift-glow" d="M44 84 Q80 5 116 84Z" fill="url(#giftGlow)" opacity="0.56" />
        </g>
      )}
      <defs>
        <linearGradient id="giftGlow" x1="80" y1="8" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF4B8" stopOpacity="0" />
          <stop offset="1" stopColor="#FFD166" stopOpacity="0.72" />
        </linearGradient>
      </defs>
      <g className="gift-body">
        <rect x={18} y={80} width={124} height={80} rx={5} fill="#FFB3C6" />
        <rect x={72} y={80} width={16} height={80} fill={ROSE_GOLD} opacity={0.75} />
        <path d="M142 80 L156 70 L156 150 L142 160Z" fill="#F06292" opacity={0.22} />
        <text className="gift-label" x="80" y="126" textAnchor="middle" fill="#8F5360" fontSize="11" fontWeight="700">
          FOR YOU
        </text>
      </g>
      <g className="gift-lid">
        <rect x={14} y={62} width={132} height={22} rx={5} fill="#FF85A1" />
        <rect x={14} y={68} width={132} height={8} fill={ROSE_GOLD} opacity={0.75} />
        <path d="M80 64 C62 46 28 52 38 64 C48 76 76 60 80 64Z" fill={BLUSH} opacity={0.88} />
        <path d="M80 64 C98 46 132 52 122 64 C112 76 84 60 80 64Z" fill={BLUSH} opacity={0.88} />
        <circle cx={80} cy={64} r={9} fill={ROSE_GOLD} />
        <circle cx={80} cy={64} r={4.5} fill="#fff" opacity={0.4} />
      </g>
    </svg>
  )
}

// ── Confetti ──────────────────────────────────────────────────────────────
const CONF_COLORS = ['#FF4D79','#FFB3C6','#B76E79','#FF85A1','#FFCDD2','#FFD700','#98D8C8','#C9B1FF']
const CONFETTI_DATA = Array.from({ length: 44 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: -(Math.random() * 60),
  color: CONF_COLORS[i % CONF_COLORS.length],
  size: 6 + Math.random() * 8,
  delay: Math.random() * 2.5,
  rotate: Math.random() * 360,
  type: (['circle','rect','bar'] as const)[i % 3],
}))

function ConfettiOverlay({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
      {CONFETTI_DATA.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.type === 'bar' ? p.size * 2 : p.size,
          height: p.type === 'circle' ? p.size : p.type === 'bar' ? p.size * 0.5 : p.size,
          borderRadius: p.type === 'circle' ? '50%' : 2,
          background: p.color,
          animation: `confettiFall 3.2s ${p.delay}s ease-in both`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  )
}

// ── Static confetti for slide 10 ──────────────────────────────────────────
function StaticConfetti() {
  const pieces = [
    { x: 7,  y: 18, c: '#FF4D79',  r: 6, rot: 25  },
    { x: 91, y: 14, c: '#FFB3C6',  r: 7, rot: -18 },
    { x: 3,  y: 60, c: '#B76E79',  r: 5, rot: 40  },
    { x: 95, y: 55, c: '#FF85A1',  r: 6, rot: -30 },
    { x: 48, y: 6,  c: '#FFCDD2',  r: 8, rot: 15  },
    { x: 55, y: 90, c: '#FF4D79',  r: 5, rot: -45 },
    { x: 18, y: 85, c: '#FFD700',  r: 4, rot: 55  },
    { x: 82, y: 88, c: '#C9B1FF',  r: 5, rot: -20 },
    { x: 30, y: 10, c: '#98D8C8',  r: 4, rot: 30  },
    { x: 70, y: 8,  c: '#FF4D79',  r: 5, rot: -10 },
    { x: 12, y: 40, c: '#FFCDD2',  r: 7, rot: 50  },
    { x: 88, y: 38, c: '#FFB3C6',  r: 6, rot: -35 },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.r * 2, height: i % 3 === 0 ? p.r * 2 : p.r,
          borderRadius: i % 3 === 0 ? '50%' : 2,
          background: p.c,
          transform: `rotate(${p.rot}deg)`,
          opacity: 0.75,
        }} />
      ))}
    </div>
  )
}

// ── Nav Bar ───────────────────────────────────────────────────────────────
interface NavBarProps {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
}
function NavBar({ current, total, onPrev, onNext }: NavBarProps) {
  const circBtn: React.CSSProperties = {
    width: 40, height: 40, borderRadius: '50%',
    border: '1.5px solid rgba(255,255,255,0.85)',
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: ROSE_GOLD, transition: 'background 0.2s',
    outline: 'none', flexShrink: 0,
  }
  return (
    <div className="nav-bar" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
      padding: '10px 28px',
      borderTop: '1px solid rgba(255,255,255,0.45)',
      background: 'rgba(255,255,255,0.15)',
    }}>
      <button className="nav-button" style={circBtn} onClick={onPrev} disabled={current === 0}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M9.5 12L5.5 7.5L9.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`slide-dot ${i === current ? 'active' : ''}`} style={{
            height: 7, borderRadius: 100,
            background: i === current ? BLUSH : 'rgba(183,110,121,0.22)',
            width: i === current ? 26 : 7,
            transition: 'all 0.38s cubic-bezier(0.4,0,0.2,1)',
          }} />
        ))}
      </div>

      <button className="nav-button" style={circBtn} onClick={onNext} disabled={current === total - 1}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M5.5 3L9.5 7.5L5.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

// ── Slide layout helpers ──────────────────────────────────────────────────
interface SlideProps {
  photos: EightPhotos
  onPhotoClick: (slot: number) => void
  playSound: (effect: SoundEffect) => void
}

// ── Slide 1 ── Cover & Greeting ───────────────────────────────────────────
function Slide1({ photos, onPhotoClick, onNext }: SlideProps & { onNext: () => void }) {
  const rotations = [-4, 2, -2, 5, 3, -3, 2, -4]
  return (
    <div className="slide-content slide-1" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Header */}
      <div className="slide-heading" style={{ position: 'absolute', top: 22, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10 }}>
        <SlideTag label="01 / Happy Birthday" />
        <SlideTitle>For Someone Special</SlideTitle>
      </div>

      {/* 8 staggered polaroids */}
      <div className="photo-grid slide1-grid" style={{
        position: 'absolute', inset: '92px 42px 64px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)', gap: 14,
      }}>
        {photos.map((photo, i) => (
          <Polaroid key={i} photo={photo} onClick={() => onPhotoClick(i)}
            tape="corners" style={{
              width: '100%', height: '100%', minHeight: 0,
              transform: `rotate(${rotations[i]}deg)`, zIndex: 2,
            }} />
        ))}
      </div>

      {/* CTA */}
      <button className="btn-primary" onClick={onNext} style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        padding: '11px 26px', borderRadius: 100,
        background: `linear-gradient(135deg, ${BLUSH}, ${ROSE_GOLD})`,
        color: 'white', border: 'none', cursor: 'pointer',
        ...pjSans, fontSize: 13, fontWeight: 700,
        boxShadow: '0 5px 18px rgba(255,77,121,0.32)', zIndex: 10,
        transition: 'filter 0.2s, transform 0.2s',
        letterSpacing: '0.02em',
      }}>Explore Deck →</button>
    </div>
  )
}

// ── Slide 2 ── Childhood Memories ─────────────────────────────────────────
function Slide2({ photos, onPhotoClick }: SlideProps) {
  const [captions, setCaptions] = useState(['Summer', 'Giggles', 'Sunshine', 'Sweet', 'Together', 'Magic', 'Cheers', 'Forever'])
  const tapeAngles = [-8, 6, 4, -5, 7, -4, 5, -7]
  return (
    <div className="slide-content slide-2" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '22px 32px 16px' }}>
      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
        <SlideTag label="02 / Memories" />
        <SlideTitle>Little Moments</SlideTitle>
      </div>
      <div className="photo-grid slide2-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 14 }}>
        {photos.map((photo, i) => (
          <Polaroid key={i} photo={photo} onClick={() => onPhotoClick(i)}
            tape="top" tapeRotate={tapeAngles[i]}
            editableCaption caption={captions[i]}
            onCaptionChange={v => setCaptions(prev => prev.map((c, j) => j === i ? v : c))}
            style={{ height: '100%' }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Slide 3 ── Travel & Adventures ────────────────────────────────────────
function Slide3({ photos, onPhotoClick }: SlideProps) {
  return (
    <div className="slide-content slide-3" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '22px 28px 16px' }}>
      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        <SlideTag label="03 / Adventures" />
        <SlideTitle>Wanderlust</SlideTitle>
      </div>
      <div className="photo-grid slide3-grid" style={{
        flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)', gap: 12, minHeight: 0,
      }}>
        {photos.map((photo, i) => (
          <div key={i} className="adventure-card" onClick={() => onPhotoClick(i)} style={{
            flex: 1, borderRadius: 20, overflow: 'hidden',
            background: '#fce4ec', cursor: 'pointer',
            boxShadow: '0 4px 22px rgba(183,110,121,0.11)',
          }}>
            {photo
              ? <img src={photo} alt="Adventure" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <PhotoPlaceholder onClick={() => onPhotoClick(i)} />
            }
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Slide 4 ── Favorite Smiles ────────────────────────────────────────────
function Slide4({ photos, onPhotoClick }: SlideProps) {
  const rots   = [-9, -5, 3, 7, -6, 4, -2, 8]
  const yOffs  = [8, -12, 6, -8, 10, -6, 5, -10]
  const xOverlap = -16
  return (
    <div className="slide-content slide-4" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '22px 28px 16px' }}>
      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
        <SlideTag label="04 / Smiles" />
        <SlideTitle>Pure Joy</SlideTitle>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="photo-grid slide4-grid" style={{ display: 'flex', alignItems: 'center' }}>
          {photos.map((photo, i) => (
            <Polaroid key={i} photo={photo} onClick={() => onPhotoClick(i)}
              tape="top" tapeRotate={rots[i]}
              style={{
                width: 128, height: 206,
                transform: `rotate(${rots[i]}deg) translateY(${yOffs[i]}px)`,
                marginLeft: i > 0 ? xOverlap : 0,
                zIndex: i + 1,
                transition: 'transform 0.22s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Slide 5 ── Cake & Wish ────────────────────────────────────────────────
function Slide5({ photos, onPhotoClick, playSound }: SlideProps) {
  const [blown, setBlown] = useState(false)
  return (
    <div className="slide-content slide-5" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '22px 32px 12px' }}>
      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        <SlideTag label="05 / Make a Wish" />
        <SlideTitle>Blow the Candles</SlideTitle>
      </div>
      <div className="slide5-body" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
        {/* Left 4 photos */}
        <div className="photo-grid cake-photo-grid" style={{ width: 320, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[0, 1, 2, 3].map(i => (
            <Polaroid key={i} photo={photos[i]} onClick={() => onPhotoClick(i)}
              style={{ width: 148, height: 168 }} />
          ))}
        </div>

        {/* Cake center */}
        <div className="cake-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <CakeSVG blown={blown} />
          <button
            className={`btn-ghost cake-button ${blown ? 'wish-made' : ''}`}
            aria-pressed={blown}
            onClick={() => {
              playSound(blown ? 'tap' : 'blow')
              setBlown(b => !b)
            }}
            style={{
            padding: '10px 22px', borderRadius: 100,
            background: blown ? 'rgba(183,110,121,0.1)' : 'white',
            border: `1.5px solid rgba(183,110,121,${blown ? '0.2' : '0.3'})`,
            cursor: 'pointer',
            ...pjSans, fontSize: 13, fontWeight: 600,
            color: blown ? ROSE_GOLD : DEEP,
            transition: 'all 0.3s',
          }}>
            {blown ? '🌟 Wish Made!' : '✨ Blow Candles'}
          </button>
        </div>

        {/* Right 4 photos */}
        <div className="photo-grid cake-photo-grid" style={{ width: 320, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[4, 5, 6, 7].map(i => (
            <Polaroid key={i} photo={photos[i]} onClick={() => onPhotoClick(i)}
              style={{ width: 148, height: 168 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Slide 6 ── Surprises ──────────────────────────────────────────────────
function Slide6({ photos, onPhotoClick, playSound }: SlideProps) {
  const [giftOpened, setGiftOpened] = useState(false)
  const corners = [
    { top: '18%', left: '2%', rotate: -7 },
    { top: '13%', left: '17%', rotate: 5 },
    { top: '13%', right: '17%', rotate: -4 },
    { top: '18%', right: '2%', rotate: 7 },
    { bottom: '4%', left: '2%', rotate: 5 },
    { bottom: '7%', left: '17%', rotate: -4 },
    { bottom: '7%', right: '17%', rotate: 5 },
    { bottom: '4%', right: '2%', rotate: -6 },
  ]
  return (
    <div className="slide-content slide-6" style={{ position: 'relative', width: '100%', height: '100%', padding: '22px 28px 16px' }}>
      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 5 }}>
        <SlideTag label="06 / Surprises" />
        <SlideTitle>Unwrap Joy</SlideTitle>
      </div>

      {/* Floating gift center */}
      <div
        className={`gift-center ${giftOpened ? 'is-open' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={giftOpened}
        aria-label={giftOpened ? 'Close birthday gift' : 'Open birthday gift'}
        onClick={() => {
          playSound(giftOpened ? 'tap' : 'gift')
          setGiftOpened(open => !open)
        }}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            playSound(giftOpened ? 'tap' : 'gift')
            setGiftOpened(open => !open)
          }
        }}
        style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'floatGift 3.5s ease-in-out infinite',
        zIndex: 4, cursor: 'pointer', outline: 'none',
      }}>
        <GiftSVG opened={giftOpened} />
        <span className="gift-message">
          {giftOpened ? 'A little surprise for you' : 'Tap to open'}
        </span>
      </div>
      <button
        className={`gift-mobile-control ${giftOpened ? 'is-open' : ''}`}
        aria-pressed={giftOpened}
        onClick={() => {
          playSound(giftOpened ? 'tap' : 'gift')
          setGiftOpened(open => !open)
        }}
      >
        {giftOpened ? 'Close gift' : 'Open gift'}
      </button>

      {/* 8 surrounding polaroids */}
      <div className="photo-grid slide6-grid">
        {photos.map((photo, i) => {
          const { rotate, ...pos } = corners[i]
          return (
            <Polaroid key={i} photo={photo} onClick={() => onPhotoClick(i)}
              tape="corners"
              style={{
                position: 'absolute', width: 136, height: 158,
                transform: `rotate(${rotate}deg)`, zIndex: 3,
                ...pos,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

// ── Slide 7 ── Laughter ───────────────────────────────────────────────────
function Slide7({ photos, onPhotoClick }: SlideProps) {
  return (
    <div className="slide-content slide-7" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '22px 28px 12px' }}>
      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
        <SlideTag label="07 / Laughter" />
        <SlideTitle>Best Times</SlideTitle>
      </div>

      {/* 8-photo memory grid */}
      <div className="photo-grid slide7-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)', gap: 12, minHeight: 0, flex: 1,
      }}>
        {photos.map((photo, i) => (
          <div key={i} className="photo-tile" onClick={() => onPhotoClick(i)} style={{
            minWidth: 0, minHeight: 0, borderRadius: 14,
            overflow: 'hidden', background: '#fce4ec',
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 4px 22px rgba(183,110,121,0.12)',
          }}>
            {photo
              ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <PhotoPlaceholder onClick={() => onPhotoClick(i)} />
            }
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
        <p style={{
          ...playfair, fontStyle: 'italic', fontSize: 21, color: SOFT_ROSE,
          textAlign: 'center', maxWidth: 580, lineHeight: 1.55, margin: 0,
        }}>
          "In all the world, there is no heart for me like yours."
        </p>
      </div>
    </div>
  )
}

// ── Slide 8 ── Little Things ──────────────────────────────────────────────
function Slide8({ photos, onPhotoClick }: SlideProps) {
  const mosaic = [
    { gridColumn: '1 / 3', gridRow: '1 / 3' },
    { gridColumn: '3 / 5', gridRow: '1 / 2' },
    { gridColumn: '5 / 7', gridRow: '1 / 3' },
    { gridColumn: '3 / 4', gridRow: '2 / 3' },
    { gridColumn: '4 / 5', gridRow: '2 / 3' },
    { gridColumn: '1 / 3', gridRow: '3 / 5' },
    { gridColumn: '3 / 5', gridRow: '3 / 5' },
    { gridColumn: '5 / 7', gridRow: '3 / 5' },
  ]
  return (
    <div className="slide-content slide-8" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '22px 32px 16px' }}>
      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
        <SlideTag label="08 / Little Things" />
        <SlideTitle>Everyday Magic</SlideTitle>
      </div>
      <div className="photo-grid slide8-grid" style={{
        flex: 1, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)', gap: 10, minHeight: 0,
      }}>
        {photos.map((photo, i) => (
          <div key={i} className="photo-tile" onClick={() => onPhotoClick(i)} style={{
            ...mosaic[i],
            borderRadius: i === 0 || i === 2 ? 20 : 14,
            overflow: 'hidden', background: '#fce4ec', cursor: 'pointer', minHeight: 0,
            boxShadow: i === 0 || i === 2
              ? '0 8px 34px rgba(183,110,121,0.15)'
              : '0 4px 18px rgba(183,110,121,0.11)',
          }}>
            {photo
              ? <img src={photo} alt={`Everyday memory ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <PhotoPlaceholder onClick={() => onPhotoClick(i)} />
            }
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Slide 9 ── Wishes ─────────────────────────────────────────────────────
const WISHES = [
  'May your day be as bright as your smile ✨',
  'Here\'s to another year of adventures 🌸',
  'Wishing you all the joy in the world 🎀',
  'Forever grateful you were born 💕',
  'May every wish find its way to you ✨',
  'More laughter, love, and magic ahead 🌷',
  'Keep shining in your beautiful way 💫',
  'To memories we have yet to make 🥂',
]
function Slide9({ photos, onPhotoClick }: SlideProps) {
  return (
    <div className="slide-content slide-9" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '22px 40px 16px' }}>
      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        <SlideTag label="09 / Wishes" />
        <SlideTitle>Cheers to You</SlideTitle>
      </div>
      <div className="photo-grid slide9-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 12 }}>
        {photos.map((photo, i) => (
          <div key={i} className="photo-tile" onClick={() => onPhotoClick(i)} style={{
            position: 'relative', borderRadius: 18, overflow: 'hidden',
            background: '#fce4ec', cursor: 'pointer',
            boxShadow: '0 4px 22px rgba(183,110,121,0.13)',
          }}>
            {photo
              ? <img src={photo} alt={`Birthday wish ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <PhotoPlaceholder onClick={() => onPhotoClick(i)} />
            }
            {/* Frosted wish overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,245,247,0.52)',
              backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 18,
            }}>
              <p style={{
                ...playfair, fontStyle: 'italic', fontSize: 13.5,
                color: DEEP, textAlign: 'center', lineHeight: 1.55, margin: 0,
              }}>{WISHES[i]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Slide 10 ── Closing ───────────────────────────────────────────────────
function Slide10({
  photos, onPhotoClick, confettiActive, onConfetti,
}: SlideProps & { confettiActive: boolean; onConfetti: () => void }) {
  const rotations = [-5, 3, -2, 5, 3, -4, 2, -3]
  return (
    <div className="slide-content slide-10" style={{ position: 'relative', width: '100%', height: '100%', padding: '22px 28px 16px' }}>
      <StaticConfetti />

      <div className="slide-heading" style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 5 }}>
        <SlideTag label="10 / Forever Celebrating" />
        <SlideTitle>The Best is Yet to Come</SlideTitle>
      </div>

      {/* 8 polaroids */}
      <div className="photo-grid slide10-grid" style={{
        position: 'absolute', inset: '92px 38px 68px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)', gap: 12, zIndex: 3,
      }}>
        {photos.map((photo, i) => (
          <Polaroid key={i} photo={photo} onClick={() => onPhotoClick(i)}
            tape="corners"
            style={{
              width: '100%', height: '100%', minHeight: 0,
              transform: `rotate(${rotations[i]}deg)`,
            }}
          />
        ))}
      </div>

      {/* Action button */}
      <div className="closing-actions" style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 12, zIndex: 10,
      }}>
        <button className="btn-primary" onClick={onConfetti} style={{
          padding: '11px 22px', borderRadius: 100,
          background: `linear-gradient(135deg, ${BLUSH}, ${ROSE_GOLD})`,
          color: 'white', border: 'none', cursor: 'pointer',
          ...pjSans, fontSize: 13, fontWeight: 700,
          boxShadow: '0 5px 18px rgba(255,77,121,0.32)',
          transition: 'filter 0.2s, transform 0.2s',
        }}>🎉 Pop Confetti</button>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [slide, setSlide] = useState(0)
  const [photos] = useState<EightPhotos[]>(() =>
    DEFAULTS.map(set => shuffleArray(set) as EightPhotos)
  )
  const [confetti, setConfetti] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [scale, setScale] = useState(1)

  // Scale deck to viewport
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth  - 40
      const h = window.innerHeight - 80
      setScale(Math.min(1, w / 1080, h / 660))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const playSound = useCallback((effect: SoundEffect) => {
    if (soundEnabled) playSynthSound(effect)
  }, [soundEnabled])

  useEffect(() => {
    if (soundEnabled) {
      const timer = window.setTimeout(() => playSynthSound('birthday'), 420)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [soundEnabled])

  const goNext = () => {
    playSound('nav')
    if (slide === 0) playSound('birthday')
    setSlide(s => Math.min(s + 1, 9))
  }
  const goPrev = () => {
    playSound('nav')
    setSlide(s => Math.max(s - 1, 0))
  }

  const sp = (i: number): SlideProps => ({
    photos: photos[i],
    onPhotoClick: () => undefined,
    playSound,
  })

  const SLIDES = [
    <Slide1  key={0} {...sp(0)} onNext={goNext} />,
    <Slide2  key={1} {...sp(1)} />,
    <Slide3  key={2} {...sp(2)} />,
    <Slide4  key={3} {...sp(3)} />,
    <Slide5  key={4} {...sp(4)} />,
    <Slide6  key={5} {...sp(5)} />,
    <Slide7  key={6} {...sp(6)} />,
    <Slide8  key={7} {...sp(7)} />,
    <Slide9  key={8} {...sp(8)} />,
    <Slide10 key={9} {...sp(9)}
      confettiActive={confetti}
      onConfetti={() => {
        playSound('confetti')
        setConfetti(true)
        setTimeout(() => setConfetti(false), 4200)
      }}
    />,
  ]

  return (
    <div className="app-shell" style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      backgroundImage: `linear-gradient(135deg, rgba(31,24,29,0.34), rgba(71,49,55,0.16)), url("https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=2000&q=85")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex', flexDirection: 'column',
      padding: 20,
    }}>
      <div className="ambient-orb ambient-orb-top" style={{
        position: 'absolute', width: 420, height: 420, borderRadius: '50%',
        top: -170, right: -110,
        background: 'radial-gradient(circle, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(8px)', pointerEvents: 'none',
      }} />
      <div className="ambient-orb ambient-orb-bottom" style={{
        position: 'absolute', width: 520, height: 520, borderRadius: '50%',
        bottom: -260, left: -150,
        background: 'radial-gradient(circle, rgba(255,218,165,0.2) 0%, rgba(255,255,255,0) 72%)',
        filter: 'blur(12px)', pointerEvents: 'none',
      }} />
      {/* Deck wrapper — handles scale */}
      <div className="deck-stage" style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center', zIndex: 1,
      }}>
        <div className="deck-shell" style={{
          width: 1080, height: 640,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.42), rgba(255,255,255,0.2))',
          backdropFilter: 'blur(30px) saturate(1.18)', WebkitBackdropFilter: 'blur(30px) saturate(1.18)',
          border: '1.5px solid rgba(255,255,255,0.58)',
          borderRadius: 32,
          boxShadow: '0 36px 110px rgba(24,16,20,0.28), 0 10px 36px rgba(24,16,20,0.14), inset 0 1px 0 rgba(255,255,255,0.72)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <button
            className={`btn-ghost sound-toggle ${soundEnabled ? 'is-on' : 'is-off'}`}
            type="button"
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            onClick={() => {
              if (!soundEnabled) playSynthSound('gift')
              setSoundEnabled(enabled => !enabled)
            }}
            style={{
              position: 'absolute', top: 16, right: 18,
              width: 34, height: 34, padding: 0, borderRadius: '50%',
              background: 'rgba(255,255,255,0.78)',
              border: '1.5px solid rgba(183,110,121,0.2)',
              color: ROSE_GOLD, cursor: 'pointer', zIndex: 30,
              display: 'grid', placeItems: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 6.2h2.3L8 3.5v9L4.8 9.8H2.5V6.2Z" fill="currentColor" />
              {soundEnabled ? (
                <>
                  <path d="M10.2 5.5c.8.7.8 4.3 0 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M12.2 3.8c2.1 2 2.1 6.4 0 8.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </>
              ) : (
                <path d="m10.2 6 3.3 4M13.5 6l-3.3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              )}
            </svg>
          </button>

          {/* Slide viewport */}
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
            {SLIDES.map((s, i) => (
              <div key={i} className={`slide-layer ${i === slide ? 'active' : 'inactive'}`}>
                {s}
              </div>
            ))}
            {/* Global confetti overlay */}
            <ConfettiOverlay active={confetti} />
          </div>

          {/* Nav bar */}
          <NavBar current={slide} total={10} onPrev={goPrev} onNext={goNext} />
        </div>
      </div>
    </div>
  )
}
