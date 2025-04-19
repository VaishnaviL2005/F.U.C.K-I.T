'use client'

import { motion, useScroll } from 'framer-motion'
import { useRef } from 'react'

const timelineData = [
  {
    event: "Harry left at the Dursley's doorstep",
    characters: ["Harry Potter", "Albus Dumbledore", "Professor McGonagall", "Hagrid"],
    location: "4 Privet Drive, Little Whinging",
    date: "November 1st, 1981",
    image: "/events/harry-doorstep.jpg"
  },
  // Add more events...
]

export default function Page() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })

  return (
    <section ref={ref} className="relative px-6 py-16 bg-[#0a0a0a] text-white">
      {/* Vertical Line */}
      <motion.div
        style={{ scaleY: scrollYProgress }}
        className="absolute left-6 top-0 w-1 origin-top bg-purple-500 h-full"
      />

      <div className="pl-14 space-y-20 max-w-4xl mx-auto">
        {timelineData.map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="group relative"
          >
            {/* Dot */}
            <div className="absolute -left-[0.75rem] top-2 w-4 h-4 rounded-full bg-purple-500 z-10 group-hover:scale-125 transition-transform" />

            {/* Content */}
            <div className="bg-[#1a1a1a] p-5 rounded-xl shadow-md transform group-hover:scale-[1.02] transition-transform">
              <h3 className="text-xl font-bold">{event.event}</h3>
              <p className="text-sm text-gray-400">{event.date} — {event.location}</p>
              <p className="mt-2 text-sm">Characters: {event.characters.join(', ')}</p>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.event}
                  className="mt-4 rounded-md max-h-48 object-cover w-full"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
