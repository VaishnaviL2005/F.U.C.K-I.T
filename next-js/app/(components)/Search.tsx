'use client'

import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [characters, setCharacters] = useState<any[]>([])
  const [spells, setSpells] = useState<any[]>([])
  const [potions, setPotions] = useState<any[]>([])

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 300], [0, -100]) // Background parallax
  const titleY = useTransform(scrollY, [0, 200], [0, -30]) // Section headers parallax

  useEffect(() => {
    const fetchCSV = async (path: string, setData: (data: any[]) => void) => {
      const res = await fetch(path)
      const text = await res.text()
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => setData(result.data),
      })
    }

    fetchCSV('/characters.csv', setCharacters)
    fetchCSV('/spells.csv', setSpells)
    fetchCSV('/potions.csv', setPotions)
  }, [])

  const filterCharacters = (data: any[]) =>
    data.filter(item => item.Name?.toLowerCase().includes(query.toLowerCase()))

  const filterData = (data: any[]) =>
    data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    )


    const renderCard = (item: any, type: 'character' | 'spell' | 'potion', i: number) => {
        const gradient =
          type === 'character'
            ? 'from-pink-500 via-fuchsia-600 to-blue-700'
            : type === 'spell'
            ? 'from-indigo-500 to-blue-500'
            : 'from-emerald-500 to-teal-500'
      
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`rounded-xl p-6 bg-gradient-to-br ${gradient} text-white shadow-lg space-y-1`}
            whileHover={{ scale: 1.03 }}
          >
            {Object.entries(item).map(([key, value], idx) => (
              <p key={idx} className="text-sm">
                <span className="font-semibold">{key}:</span> {value ? String(value) : '—'}
              </p>
            ))}
          </motion.div>
        )
      }

  return (
    <motion.div
      className="min-h-screen text-white px-6 py-12 relative overflow-hidden"
      style={{ backgroundColor: '#09090b' }}
    >
      {/* Background Parallax Overlay */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-[url('/magicbg.jpg')] bg-cover bg-center opacity-10 pointer-events-none"
        style={{ y: bgY }}
      />

      <div className="relative max-w-4xl mx-auto space-y-10 z-10">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search any detail..."
          className="w-full p-4 rounded-lg bg-zinc-800 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 animate-border"
        />

        <div className="space-y-12">
          {/* Characters */}
          {((query ? filterCharacters(characters) : characters.slice(0, 4))).length > 0 && (
            <>
              <motion.h2
                className="text-4xl font-bold text-fuchsia-400"
                style={{ y: titleY }}
              >
                Characters
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(query ? filterCharacters(characters) : characters.slice(0, 4)).map((char, i) =>
                  renderCard(char, 'character', i)
                )}
              </div>
            </>
          )}

          {/* Spells */}
          {((query ? filterData(spells) : spells.slice(0, 4))).length > 0 && (
            <>
              <motion.h2
                className="text-4xl font-bold text-indigo-400"
                style={{ y: titleY }}
              >
                Spells
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(query ? filterData(spells) : spells.slice(0, 4)).map((spell, i) =>
                  renderCard(spell, 'spell', i)
                )}
              </div>
            </>
          )}

          {/* Potions */}
          {((query ? filterData(potions) : potions.slice(0, 4))).length > 0 && (
            <>
              <motion.h2
                className="text-4xl font-bold text-emerald-400"
                style={{ y: titleY }}
              >
                Potions
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(query ? filterData(potions) : potions.slice(0, 4)).map((potion, i) =>
                  renderCard(potion, 'potion', i)
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
