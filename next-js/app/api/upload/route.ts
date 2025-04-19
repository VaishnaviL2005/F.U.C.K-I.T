import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';
import { IncomingMessage } from 'http';

export async function POST(req: Request) {
  // Check if IncomingForm is available
  if (typeof formidable.IncomingForm !== 'function') {
    return NextResponse.json(
      { message: 'Server error: Formidable not compatible with current bundler' },
      { status: 500 }
    );
  }

  const form = new formidable.IncomingForm({
    uploadDir: './public/uploads',
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
    filter: ({ mimetype }) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return mimetype ? allowedTypes.includes(mimetype) : false;
    },
  });

  try {
    await fs.mkdir('./public/uploads', { recursive: true });

    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req as unknown as IncomingMessage, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = files.file?.[0];
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const safeFileName = file.originalFilename?.replace(/[^a-zA-Z0-9.-]/g, '_');

    return NextResponse.json({
      message: 'File uploaded successfully',
      filePath: file.filepath,
      fileName: safeFileName,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Upload error:', errorMessage); // Log for debugging
    return NextResponse.json(
      { message: 'Error uploading file', error: errorMessage },
      { status: 500 }
    );
  }
}