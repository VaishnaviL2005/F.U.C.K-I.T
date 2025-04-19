import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'characters_by_house.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const houseDataJson = JSON.parse(jsonData);

    const chartData = {
      labels: Object.keys(houseDataJson),
      datasets: [
        {
          label: 'Number of Characters',
          data: Object.values(houseDataJson).map((names) => names.length),
          names: Object.values(houseDataJson),
        },
      ],
    };

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error reading JSON:', error);
    return NextResponse.json({ error: 'Failed to process JSON' }, { status: 500 });
  }
}
