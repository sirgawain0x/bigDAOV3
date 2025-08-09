import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://app.onbons.ai/api/clubs/get-trading-info?clubId=197&chain=base', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BigDAO/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Successfully fetched trading info from OnBons API'
    });
  } catch (error) {
    console.error('Error fetching trading info:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch trading info from OnBons API'
    }, { status: 500 });
  }
}
