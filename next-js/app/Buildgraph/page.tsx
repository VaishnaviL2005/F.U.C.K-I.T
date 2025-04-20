'use client'

import { useEffect, useRef, useState } from 'react'
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

// Friendship data between characters (inter-house connections)
const friendships: [string, string][] = [
  ["Harry Potter", "Luna Lovegood"],
  ["Cedric Diggory", "Harry Potter"],
  ["Hermione Granger", "Padma Patil"],
  ["Ron Weasley", "Dean Thomas"],
  ["Ginny Weasley", "Luna Lovegood"],
  ["Neville Longbottom", "Cedric Diggory"],
  ["Sirius Black", "Remus Lupin"],
  ["Fred Weasley", "George Weasley"],
  ["Harry Potter", "Draco Malfoy"],
  ["Hermione Granger", "Cho Chang"],
  ["Ron Weasley", "Ernie Macmillan"],
  ["Neville Longbottom", "Pansy Parkinson"],
  ["Luna Lovegood", "Cedric Diggory"],
  ["Sirius Black", "Bellatrix Lestrange"],
]

// Family relation data
const familyRelations: [string, string][] = [
  ["Harry Potter", "Lily Potter"],
  ["Harry Potter", "James Potter"],
  ["Harry Potter", "Petunia Dursley"],
  ["Harry Potter", "Vernon Dursley"],
  ["Harry Potter", "Dudley Dursley"],
  ["Petunia Dursley", "Lily Potter"],
  ["James Potter", "Sirius Black"],
  ["Ron Weasley", "Fred Weasley"],
  ["Ron Weasley", "George Weasley"],
  ["Ron Weasley", "Percy Weasley"],
  ["Fred Weasley", "George Weasley"],
  ["Ron Weasley", "Ginny Weasley"],
  ["Fred Weasley", "Ginny Weasley"],
  ["George Weasley", "Ginny Weasley"],
  ["Percy Weasley", "Ginny Weasley"],
  ["Arthur Weasley", "Ron Weasley"],
  ["Arthur Weasley", "Fred Weasley"],
  ["Arthur Weasley", "George Weasley"],
  ["Arthur Weasley", "Percy Weasley"],
  ["Arthur Weasley", "Ginny Weasley"],
  ["Arthur Weasley", "Molly Weasley"],
  ["Molly Weasley", "Ron Weasley"],
  ["Molly Weasley", "Fred Weasley"],
  ["Molly Weasley", "George Weasley"],
  ["Molly Weasley", "Percy Weasley"],
  ["Molly Weasley", "Ginny Weasley"],
  ["Molly Weasley", "Arthur Weasley"],
  ["Draco Malfoy", ""],
]

export default function BuildGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

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

    // Add friendship edges
    friendships.forEach(([char1, char2]) => {
      if (nodeMap[char1] && nodeMap[char2]) {
        edges.add({
          from: nodeMap[char1],
          to: nodeMap[char2],
          color: '#FFD700', // gold
          width: 2,
          arrows: 'to',
        })
      }
    })

    // Add family relation edges
    familyRelations.forEach(([char1, char2]) => {
      if (nodeMap[char1] && nodeMap[char2]) {
        edges.add({
          from: nodeMap[char1],
          to: nodeMap[char2],
          color: '#00BFFF', // sky blue
          width: 1.5,
          dashes: true,
        })
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
      const network = new Network(containerRef.current, data, options)

      // Event listener for when a node is clicked
      network.on('click', (event) => {
        const { nodes: clickedNodes } = event
        if (clickedNodes.length > 0) {
          const nodeId = clickedNodes[0]
          const characterNodes = nodes.get(nodeId)

          if (Array.isArray(characterNodes) && characterNodes.length > 0) {
            const characterName = characterNodes[0].label
            setSelectedCharacter(characterName) // Set selected character name
          }
        }
      })
    }
  }, [])

  return (
    <div className="h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-4 py-6">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
        🧙 Hogwarts House Network
      </h1>

      <div className="flex flex-row gap-6 w-full h-[85vh]">
        {/* Graph container */}
        <div ref={containerRef} className="flex-1 rounded-lg border border-zinc-700" />

        {/* Legend */}
        <div className="w-64 p-4 rounded-lg border border-zinc-700 bg-zinc-800 text-sm space-y-4">
          <h2 className="text-lg font-semibold text-center text-white">Legend</h2>
          <div className="space-y-2">
            {Object.entries(houseColors).map(([house, color]) => (
              <div key={house} className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: color }} />
                <span>{house}</span>
              </div>
            ))}
          </div>
          <hr className="border-zinc-600" />
          <div className="flex items-center gap-3 mt-2">
            <span className="w-4 h-1 rounded-full bg-yellow-400 inline-block" />
            <span>Friendship edge</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="w-4 h-1 rounded-full bg-sky-400 inline-block" />
            <span>Family relation</span>
          </div>
          <p className="text-xs text-zinc-400 mt-4 leading-tight">
            Nodes = characters<br />
            Gray lines = Same house<br />
            Gold arrows = Friendships<br />
            Blue dashed = Family ties
          </p>
        </div>
      </div>

      {/* Selected Character Info */}
      {selectedCharacter && (
        <div className="mt-6 p-4 bg-zinc-800 rounded-lg text-center text-xl text-yellow-400">
          <h2>Selected Character: {selectedCharacter}</h2>
        </div>
      )}
    </div>
  )
}
