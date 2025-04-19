'use client';

import { useState, FormEvent } from 'react';

interface UploadResponse {
  message: string;
  filePath?: string;
  fileName?: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'] as const;
      if (!allowedTypes.includes(selectedFile.type as typeof allowedTypes[number])) {
        setMessage('Invalid file type. Only JPEG, PNG, and PDF are allowed.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage('File too large. Maximum size is 5MB.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text(); // Get raw response for debugging
        setMessage(`Server error: ${res.status} - ${text || 'Unknown error'}`);
        return;
      }

      const data: UploadResponse = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error uploading file: Network or parsing issue');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}