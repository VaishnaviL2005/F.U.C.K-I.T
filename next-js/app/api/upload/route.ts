import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { IncomingMessage } from 'http';
import csv from 'papaparse'; // Install this via npm if you haven't already

export async function POST(req: Request) {
  // Ensure the Characters.csv file exists
  const charactersFilePath = path.resolve('./public/Characters.csv');

  try {
    const query = new URL(req.url).searchParams.get('query'); // Get the query from the URL
    
    if (!query) {
      return NextResponse.json(
        { message: 'Query parameter is missing.' },
        { status: 400 }
      );
    }

    // Read the CSV file
    const csvFile = await fs.readFile(charactersFilePath, 'utf-8');

    // Parse CSV file content
    const { data } = csv.parse(csvFile, { header: true });

    // Filter the data based on the query
    const result = data.filter((row: any) =>
      row.Name.toLowerCase().includes(query.toLowerCase())
    );

    if (result.length === 0) {
      return NextResponse.json(
        { message: 'No characters found matching the query.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Search successful', data: result });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Error reading or processing CSV', error: error.message },
      { status: 500 }
    );
  }
}
