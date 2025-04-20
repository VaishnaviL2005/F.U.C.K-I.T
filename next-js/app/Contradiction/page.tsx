'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'

// ✅ Set PDF worker from public folder
GlobalWorkerOptions.workerSrc = '/pdfWorker.js'

export default function ContradictionPage() {
  const [textInput, setTextInput] = useState('')
  const [fileName, setFileName] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    if (file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const typedArray = new Uint8Array(reader.result as ArrayBuffer)
          const pdf = await getDocument({ data: typedArray }).promise
          let text = ''
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            const strings = content.items.map((item: any) => item.str)
            text += strings.join(' ') + '\n\n'
          }
          setTextInput(text)
        } catch (err) {
          console.error('Error reading PDF:', err)
          setTextInput('Error reading PDF file.')
        }
      }
      reader.readAsArrayBuffer(file)
    } else if (file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = () => {
        setTextInput(reader.result as string)
      }
      reader.readAsText(file)
    } else {
      setTextInput('Unsupported file type. Please upload a TXT or PDF file.')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://f-u-c-k-i-t.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textInput }),
      })

      const data = await res.json()
      console.log('Response from Flask:', data.response)
      setOutput(data.response)
    } catch (err) {
      console.error('Error calling Flask API:', err)
      setOutput('An error occurred while fetching the result.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-900 to-black bg-[url('/contradictionbg.png')] bg-cover bg-center bg-no-repeat text-white py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold text-center bg-gradient-to-r from-white-400 via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          Contradiction Detector
        </motion.h1>

        <textarea
          placeholder="Enter your text here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows={6}
        />

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

        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 transition-all px-6 py-3 rounded-lg text-lg font-semibold shadow-lg"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Detect Contradictions'}
        </button>

        {loading && (
          <p className="text-zinc-400 italic text-center">Analyzing for contradictions...</p>
        )}

        {output && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-800 p-6 rounded-xl border border-zinc-600 shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2 text-purple-400">Result:</h2>
            <p className="text-gray-200 whitespace-pre-line">{output}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
