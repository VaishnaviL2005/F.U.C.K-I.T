'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const ParallaxHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background slow parallax + fade and shrink
      gsap.to('.layer-bg', {
        y: '-10%',
        scale: 0.9,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // Mid layer parallax
      gsap.to('.layer-mid', {
        y: '-20%',
        scale: 0.6,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex justify-between items-center transition-all duration-500 ease-in-out text-black font-bold backdrop-blur-md bg-white/10">
        <div className="text-xl">VerseSync</div>
        <nav className="space-x-6">
          <a href="#features" className="hover:text-pink-500 transition-colors">Features</a>
          <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
          <a href="#contact" className="hover:text-violet-500 transition-colors">Contact</a>
        </nav>
      </div>

      {/* Parallax Hero Section */}
      <div
        ref={containerRef}
        className="relative h-[200vh] overflow-hidden bg-gradient-to-br from-pink-500 via-fuchsia-600 to-blue-700"
      >


        {/* Background */}
        <img
          src="/parallax/bg.png"
          alt="bg"
          className="layer-bg absolute inset-0 w-full h-full object-cover z-0 rounded-3xl"
        />

        {/* Midground */}
        <img
          src="/parallax/mid.png"
          alt="mid"
          className="layer-mid absolute inset-0 w-full h-full object-cover z-10 scale-40"
        />

        {/* Text Content */}
        <div className="absolute top-1/2 left-1/2 z-30 transform -translate-x-1/2 -translate-y-1/2 text-white text-center px-4">
          <h1 className="text-6xl md:text-7xl font-extrabold glow">
            Welcome to VerseSync
          </h1>
          <p className="text-xl md:text-2xl mt-4 opacity-80">
            Where secrets scroll into view...
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen bg-gradient-to-br from-pink-500 via-fuchsia-600 to-blue-700 text-white py-20 px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-10">Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Explore Your World',
                desc: 'Uncover every character, place, and plotline—across novels, scripts, or comics—in one view.'
              },
              {
                title: 'Build Universe',
                desc: 'We read your past books to suggest new plot twists, character arcs, and story ideas—so your next chapter feels fresh but still fits perfectly into your world.'
              },
              {
                title: 'Spot Contradictions',
                desc: 'Drop in a paragraph or scene, and instantly see if it clashes with your canon'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform"
              >
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/90">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ParallaxHero
