import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import csv from 'papaparse'; // Install this via npm if you haven't already

export async function POST(req: Request) {
  // Get the query and type parameters from the URL
  const url = new URL(req.url);
  const query = url.searchParams.get('query'); // Get the name to search
  const type = url.searchParams.get('type'); // Get the type (characters, spells, or potions)

  if (!query || !type) {
    return NextResponse.json(
      { message: 'Query and type parameters are required.' },
      { status: 400 }
    );
  }

  // Define the path for each type of CSV file
  let filePath = '';
  let filterColumn = '';
  switch (type.toLowerCase()) {
    case 'characters':
      filePath = path.resolve('./public/Characters.csv');
      filterColumn = 'Name'; // Use 'Name' for filtering characters
      break;
    case 'spells':
      filePath = path.resolve('./public/Spells.csv');
      filterColumn = 'Name'; // Use 'Name' for filtering spells
      break;
    case 'potions':
      filePath = path.resolve('./public/Potions.csv');
      filterColumn = 'Name'; // Use 'Name' for filtering potions
      break;
    default:
      return NextResponse.json(
        { message: 'Invalid type parameter. Valid types are: characters, spells, potions.' },
        { status: 400 }
      );
  }

  try {
    // Read the CSV file for the selected type
    const csvFile = await fs.readFile(filePath, 'utf-8');

    // Parse CSV file content
    const { data } = csv.parse(csvFile, { header: true });

    // Filter the data based on the query and type (exact match)
    const result = data.filter((row: any) =>
      row[filterColumn] && row[filterColumn].toLowerCase() === query.toLowerCase() // Exact match for name
    );

    // If no data matches, return an empty result for that type
    if (result.length === 0) {
      return NextResponse.json(
        { message: `No ${type} found matching the query.` },
        { status: 404 }
      );
    }

    // Construct the response with the data for the specified type
    const responseData: any = {};

    // Return only the relevant data for the specified type
    if (type === 'characters') {
      responseData.characters = result;
    } else if (type === 'spells') {
      responseData.spells = result;
    } else if (type === 'potions') {
      responseData.potions = result;
    }

    // Return the filtered result, ensuring no other data is included
    return NextResponse.json({
      message: 'Search successful',
      data: responseData,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Error reading or processing CSV', error: error.message },
      { status: 500 }
    );
  }
}
