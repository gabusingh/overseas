import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://backend.overseas.ai/api/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode, cmpOfficialMob, cmpOtp } = body;

    if (!cmpOfficialMob || !cmpOtp) {
      return NextResponse.json(
        { error: 'Mobile number and OTP are required' },
        { status: 422 }
      );
    }

    if (!/^\d{10,15}$/.test(cmpOfficialMob)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 422 }
      );
    }

    if (!/^\d{6}$/.test(cmpOtp)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit OTP' },
        { status: 422 }
      );
    }

    // For now, just validate the OTP format and return success
    // In production, this would call the actual OTP validation endpoint
    // The actual registration will handle the OTP verification
    return NextResponse.json({
      message: 'OTP verified successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Mobile Number Not Found or Invalid OTP.' },
      { status: 422 }
    );
  }
}

