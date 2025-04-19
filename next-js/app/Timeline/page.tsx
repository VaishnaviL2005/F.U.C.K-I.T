'use client'

import { motion, useScroll } from 'framer-motion'
import { useRef } from 'react'
import timelineData from '@/app/data/timeline.json'

type TimelineEvent = {
  event: string
  characters: string[]
  location: string
  date: string
  image?: string
}

export default function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.2", "end 0.8"] })

  return (
    <div className="min-h-screen overflow-auto"> {/* Parent container to allow scrolling */}

      <section
        ref={ref}
        className="relative bg-cover bg-center bg-no-repeat text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/timelinebg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Keeps background fixed during scroll
        }}
      >
        {/* Scroll-reactive Vertical Line */}
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-1/2 transform -translate-x-1/2 top-0 w-1 origin-top bg-purple-600 h-full"
        />
        <div className="text-center py-12">
        <h1 className="text-8xl font-bold bg-gradient-to-b from-gray-200 to-purple-800 bg-clip-text text-transparent drop-shadow-lg">Explore Timeline</h1>
        </div>

        <div className="space-y-24 max-w-4xl mx-auto">
          {(timelineData as TimelineEvent[]).map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative"
            >
              {/* Dot (Positioned over the line) */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-4 h-4 rounded-full bg-purple-500 z-10 group-hover:scale-125 transition-transform" />

              {/* Content Card */}
              <motion.div
  whileHover={{ scale: 1.03, y: -5 }}
  className="bg-[#1f1f1f]/60 backdrop-blur-md p-6 rounded-2xl border border-purple-600/30 shadow-lg hover:shadow-purple-700/50 transition-all duration-300"
>
  <h3 className="text-2xl font-semibold mb-2 text-white drop-shadow-md">{event.event}</h3>
  <p className="text-sm text-purple-300">
    {event.date} — {event.location}
  </p>
  <p className="mt-2 text-sm text-gray-300">
    Characters: <span className="italic text-gray-200">{event.characters.join(', ')}</span>
  </p>
  {event.image && (
    <img
      src={event.image}
      alt={event.event}
      className="mt-4 rounded-lg max-h-56 object-cover w-full border border-purple-800/20"
    />
  )}
</motion.div>

            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
