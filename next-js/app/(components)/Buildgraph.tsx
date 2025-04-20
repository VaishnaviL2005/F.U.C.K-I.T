'use client'

import { useEffect, useRef } from 'react'
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network'

// House colors
const houseColors: Record<string, string> = {
  Gryffindor: '#ae1c28',
  Slytherin: '#1a472a',
  Ravenclaw: '#0e1a40',
  Hufflepuff: '#ecb939',
  Unknown: '#888888',
}

// Character data
const houseData: Record<string, string[]> = {
  Gryffindor: [
    "Harry Potter", "Hermione Granger", "Ron Weasley", "Minerva McGonagall", "Rubeus Hagrid", "Neville Longbottom",
    "Ginny Weasley", "Sirius Black", "Remus Lupin", "Arthur Weasley", "Fred Weasley", "George Weasley",
    "Percy Weasley", "Seamus Finnigan", "Dean Thomas", "Lavender Brown", "Parvati Patil"
  ],
  Slytherin: [
    "Draco Malfoy", "Severus Snape", "Gregory Goyle", "Lord Voldemort", "Bellatrix Lestrange", "Dolores Umbridge",
    "Lucius Malfoy", "Vincent Crabbe", "Pansy Parkinson", "Blaise Zabini", "Millicent Bulstrode", "Theodore Nott",
    "Astoria Greengrass"
  ],
  Ravenclaw: [
    "Cho Chang", "Luna Lovegood", "Filius Flitwick", "Padma Patil", "Michael Corner", "Anthony Goldstein", "Terry Boot"
  ],
  Hufflepuff: [
    "Cedric Diggory", "Kingsley Shacklebolt", "Nymphadora Tonks", "Ernie Macmillan", "Hannah Abbott", "Susan Bones", "Justin Finch-Fletchley"
  ],
  Unknown: [
    "Mrs Norris", "Argus Filch", "Horace Slughorn", "Gregory Goyle", "Colin Creevey", "Dean Thomas", "Percival Weasley",
    "Rita Skeeter", "Ludo Bagman", "Madam Poppy Pomfrey"
  ]
}

export default function BuildGraph() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nodes = new DataSet<any>()
    const edges = new DataSet<any>()
    let id = 1
    const nodeMap: Record<string, number> = {}

    // Add nodes for each character
    Object.entries(houseData).forEach(([house, characters]) => {
      characters.forEach((char) => {
        if (!nodeMap[char]) {
          nodeMap[char] = id++
          nodes.add({
            id: nodeMap[char],
            label: char,
            color: houseColors[house],
            font: { color: '#fff', size: 16 }
          })
        }
      })
    })

    // Add edges between characters of the same house
    Object.entries(houseData).forEach(([_, characters]) => {
      for (let i = 0; i < characters.length; i++) {
        for (let j = i + 1; j < characters.length; j++) {
          edges.add({
            from: nodeMap[characters[i]],
            to: nodeMap[characters[j]],
            color: '#555',
            width: 1
          })
        }
      }
    })

    const data = { nodes, edges }
    const options = {
      layout: {
        improvedLayout: true,
      },
      physics: {
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -20000,
          springLength: 150,
          springConstant: 0.04,
        },
      },
      nodes: {
        shape: 'dot',
        size: 20,
      },
      edges: {
        smooth: true,
      },
    }

    if (containerRef.current) {
      new Network(containerRef.current, data, options)
    }
  }, [])

  return (
    <div className="h-screen bg-zinc-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
        🧙 Hogwarts House Network
      </h1>
      <div ref={containerRef} className="w-full h-[85vh] rounded-lg border border-zinc-700" />
    </div>
  )
}
