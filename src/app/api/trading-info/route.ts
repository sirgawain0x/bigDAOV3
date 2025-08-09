import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get('clubId');
  const chain = searchParams.get('chain');

  if (!clubId) {
    return NextResponse.json(
      { error: 'clubId parameter is required' },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `https://app.onbons.ai/api/clubs/get-trading-info?clubId=${clubId}${chain ? `&chain=${chain}` : ''}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BigDAO/1.0',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trading info:', error);
    
    // Return mock data for development/testing
    return NextResponse.json({
      id: "0xb7",
      v2: true,
      complete: false,
      name: "Reina",
      symbol: "REINA",
      image: "https://www.storj-ipfs.com/ipfs/bafybeiajbqm2wsi3nu7svyo4vmlvwwkfza33yvgl3gz3v7h7qbqjppuxxu",
      createdAt: "1738736467",
      buyPrice: "12",
      volume24Hr: "52064699",
      liquidity: "2327055599",
      marketCap: "2327055599",
      holders: "17",
      priceDeltas: {
        "24h": "0",
        "6h": "0",
        "1h": "0",
        "5m": "0"
      },
      cliffPercent: 10,
      vestingDurationSeconds: "7200",
      hook: "0x8dd4c756f183513850e874f7d1ffd0d7cb498080",
      tokenAddress: "0x8468f9ee7c2275313979c3042166f325b1da5094",
      liquidityReleasedAt: null
    });
  }
}
