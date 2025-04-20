'use client'

import { useEffect, useState } from 'react'
import Papa from 'papaparse'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [characters, setCharacters] = useState<any[]>([])
  const [spells, setSpells] = useState<any[]>([])
  const [potions, setPotions] = useState<any[]>([])

  useEffect(() => {
    const fetchCSV = async (path: string, setData: (data: any[]) => void) => {
      const res = await fetch(path)
      const text = await res.text()

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setData(result.data)
        }
      })
    }

    fetchCSV('/characters.csv', setCharacters)
    fetchCSV('/spells.csv', setSpells)
    fetchCSV('/potions.csv', setPotions)
  }, [])

  // Filter function for characters only by name
  const filterCharacters = (data: any[]) =>
    data.filter(item =>
      item.Name?.toLowerCase().includes(query.toLowerCase())
    )

  // Filter function for spells and potions (search across all fields)
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
      <div
        key={i}
        className={`rounded-xl p-6 bg-gradient-to-br ${gradient} text-white shadow-lg space-y-1`}
      >
        {Object.entries(item).map(([key, value], idx) => (
          <p key={idx} className="text-sm">
            <span className="font-semibold">{key}:</span> {value ? String(value) : '—'}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search any detail..."
          className="w-full p-4 rounded-lg bg-zinc-800 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 animate-border"
        />

        <div className="space-y-6">
          {/* Characters */}
          {((query ? filterCharacters(characters) : characters.slice(0, 4))).length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-fuchsia-400">Characters</h2>
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
              <h2 className="text-2xl font-bold text-indigo-400">Spells</h2>
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
              <h2 className="text-2xl font-bold text-emerald-400">Potions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(query ? filterData(potions) : potions.slice(0, 4)).map((potion, i) =>
                  renderCard(potion, 'potion', i)
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
