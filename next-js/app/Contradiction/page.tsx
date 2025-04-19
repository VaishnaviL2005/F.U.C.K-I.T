'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContradictionPage() {
  const [textInput, setTextInput] = useState('')
  const [fileName, setFileName] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textInput }),
      });
  
      const data = await res.json();
      console.log("Response from Flask:", data.response);
      // You can update a state variable like `setBotResponse(data.response)` to display it
    } catch (err) {
      console.error("Error calling Flask API:", err);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-900 to-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold text-center bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          Contradiction Detector
        </motion.h1>

        {/* Textarea Input */}
        <textarea
          placeholder="Enter your text here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows={6}
        />

        {/* OR File Upload */}
        <div className="flex flex-col items-start gap-2">
          <label className="text-sm text-zinc-400">Or upload a file (TXT/PDF):</label>
          <input
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileChange}
            className="text-white"
          />
          {fileName && <p className="text-sm text-zinc-300">Selected: {fileName}</p>}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 transition-all px-6 py-3 rounded-lg text-lg font-semibold shadow-lg"
        >
          {loading ? 'Checking...' : 'Detect Contradictions'}
        </button>

        {/* Output */}
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-800 p-6 rounded-xl border border-zinc-600 shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2 text-purple-400">Result:</h2>
            <p className="text-gray-200">{output}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
