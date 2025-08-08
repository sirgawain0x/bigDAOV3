import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const adminKeyConfigured = !!(process.env.THIRDWEB_ADMIN_PRIVATE_KEY && process.env.THIRDWEB_ADMIN_PRIVATE_KEY.length > 10);
    
    return NextResponse.json({
      adminKeyConfigured
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check environment configuration' },
      { status: 500 }
    );
  }
}
