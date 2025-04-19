import { NextRequest, NextResponse } from 'next/server';
import { searchData } from '@/app/routes/search-fetch';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { message: 'Missing search query' },
      { status: 400 }
    );
  }

  try {
    const result = await searchData(query);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown server error';
    console.error('Search error:', errorMessage);
    return NextResponse.json(
      { message: 'Error performing search', error: errorMessage },
      { status: 500 }
    );
  }
}
