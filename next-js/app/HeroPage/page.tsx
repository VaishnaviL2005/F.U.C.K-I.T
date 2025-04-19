'use client'

import React, { useEffect } from 'react'
import ReactFullpage, { fullpageApi } from '@fullpage/react-fullpage'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SectionData {
  title: string
  bg: string
  textColor: string
}

const sections: SectionData[] = [
  { title: 'Unknown', bg: '#0a0a23', textColor: '#ffffff' },
  { title: 'Unseen', bg: '#1e1e2f', textColor: '#d1d1ff' },
  { title: 'Unfamiliar', bg: '#2b2b3c', textColor: '#ffd1d1' },
  { title: 'Mystery', bg: '#101020', textColor: '#aaffdd' }
]

const HeroPage: React.FC = () => {
  useEffect(() => {
    gsap.fromTo(
      '#section1',
      { scale: 1 },
      {
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 10
      }
    )
  }, [])

  return (
    <ReactFullpage
      scrollingSpeed={1000}
      navigation
      onLeave={(origin, destination, direction) => {
        const enteringText = destination.item.querySelector('h1') as HTMLElement
        const line = destination.item.querySelector('.line') as HTMLElement
        const newBg = destination.item.getAttribute('data-bg') || '#000'
        const newColor = destination.item.getAttribute('data-text-color') || '#fff'

        gsap.fromTo(
          enteringText,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            color: newColor,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.5
          }
        )

        gsap.to(line, { color: newColor, width: (destination.index + 1) * 150 + 'px', duration: 1.5 })
        destination.item.style.backgroundColor = newBg
      } }
      render={({ fullpageApi }) => {
        return (
          <div id="fullpage">
            {sections.map((sec, i) => (
              <div
                key={i}
                className="section flex flex-col items-center justify-center text-center"
                id={i === 0 ? 'section1' : undefined}
                data-bg={sec.bg}
                data-text-color={sec.textColor}
                style={{
                  height: '100vh',
                  backgroundColor: sec.bg,
                  color: sec.textColor
                }}
              >
                <h1 className="text-6xl font-bold">{sec.title}</h1>
                <div className="line mt-4 h-1 bg-white" style={{ width: (i + 1) * 150 + 'px' }}></div>
              </div>
            ))}

            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 space-x-4 z-50">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => fullpageApi?.moveTo(n)}
                  className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/30 transition"
                >
                  Go to {n}
                </button>
              ))}
            </div>
          </div>
        )
      } } credits={{
        enabled: undefined,
        label: undefined,
        position: undefined
      }}    />
  )
}

export default HeroPage
