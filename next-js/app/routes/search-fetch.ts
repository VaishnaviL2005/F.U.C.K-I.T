import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Define interfaces for each data type
interface Character {
  Id: string;
  Name: string;
  Gender: string;
  Job: string;
  House: string;
  Wand: string;
  Patronus: string;
  Species: string;
  'Blood status': string;
  'Hair colour': string;
  'Eye colour': string;
  Loyalty: string;
  Skills: string;
  Birth: string;
  Death: string;
}

interface Potion {
  Name: string;
  'Known ingredients': string;
  Effect: string;
  Characteristics: string;
  'Difficulty level': string;
}

interface Spell {
  Name: string;
  Incantation: string;
  Type: string;
  Effect: string;
  Light: string;
}

// Define the structure of the search result
interface SearchResult {
  characters: Array<{
    Name: string;
    'Birth-Death': string;
    Gender: string;
    Job: string;
    Skills: string;
  }>;
  potions: Array<{
    Name: string;
    'Known ingredients': string;
    Effect: string;
    Characteristics: string;
    'Difficulty level': string;
  }>;
  spells: Array<{
    Name: string;
    Incantation: string;
    Type: string;
    Effect: string;
    Light: string;
  }>;
}

// Function to read and parse CSV files
async function readCSV<T>(filePath: string): Promise<T[]> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    Papa.parse<T>(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (error: unknown) => reject(error),
    });
  });
}

// Search function
export async function searchData(query: string): Promise<SearchResult> {
  const publicDir = path.join(process.cwd(), 'public');
  const charactersPath = path.join(publicDir, 'Characters.csv');
  const potionsPath = path.join(publicDir, 'Potions.csv');
  const spellsPath = path.join(publicDir, 'Spells.csv');

  // Read CSV files
  const characters = await readCSV<Character>(charactersPath);
  const potions = await readCSV<Potion>(potionsPath);
  const spells = await readCSV<Spell>(spellsPath);

  // Normalize query for case-insensitive search
  const normalizedQuery = query.toLowerCase().trim();

  // Filter and map characters
  const characterResults = characters
    .filter((char) => char.Name.toLowerCase().includes(normalizedQuery))
    .map((char) => ({
      Name: char.Name,
      'Birth-Death': `${char.Birth}${char.Death ? ` - ${char.Death}` : ''}`,
      Gender: char.Gender,
      Job: char.Job,
      Skills: char.Skills,
    }));

  // Filter and map potions
  const potionResults = potions
    .filter((potion) => potion.Name.toLowerCase().includes(normalizedQuery))
    .map((potion) => ({
      Name: potion.Name,
      'Known ingredients': potion['Known ingredients'],
      Effect: potion.Effect,
      Characteristics: potion.Characteristics,
      'Difficulty level': potion['Difficulty level'],
    }));

  // Filter and map spells
  const spellResults = spells
    .filter((spell) => spell.Name.toLowerCase().includes(normalizedQuery))
    .map((spell) => ({
      Name: spell.Name,
      Incantation: spell.Incantation,
      Type: spell.Type,
      Effect: spell.Effect,
      Light: spell.Light,
    }));

  // Return the result
  return {
    characters: characterResults,
    potions: potionResults,
    spells: spellResults,
  };
}
