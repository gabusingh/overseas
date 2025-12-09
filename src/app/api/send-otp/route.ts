import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode, cmpOfficialMob, cmpName } = body;

    // Validate required fields
    if (!cmpOfficialMob) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 422 }
      );
    }

    // Validate mobile number format (10-15 digits)
    if (!/^\d{10,15}$/.test(cmpOfficialMob)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 422 }
      );
    }

    // Use the same endpoint as candidate registration (get-otp)
    // This is what actually works on the backend
    const formData = new FormData();
    formData.append('empPhone', cmpOfficialMob); // Using same field name as candidate
    formData.append('empName', cmpName || 'Employer'); // Name field required by API
    // If countryCode is provided and not +91, append it
    if (countryCode && countryCode !== '+91') {
      formData.append('countryCode', countryCode);
    }

    const response = await axios.post(`${BASE_URL}get-otp`, formData, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Handle response similar to candidate OTP
    if (response.data?.msg === 'OTP sent successfully' || response.data?.success) {
      return NextResponse.json({
        message: `OTP sent successfully to ${countryCode || '+91'}-${cmpOfficialMob}`
      });
    } else if (response.data?.msg) {
      return NextResponse.json({
        message: response.data.msg
      });
    } else if (response.data?.error) {
      return NextResponse.json(
        { error: response.data.error },
        { status: 422 }
      );
    } else {
      return NextResponse.json({
        message: 'OTP sent successfully'
      });
    }
  } catch (error: any) {
    
    // Handle specific error responses from the external API
    if (error?.response?.status === 422) {
      return NextResponse.json(
        { error: error.response.data?.error || 'Mobile number already registered' },
        { status: 422 }
      );
    }

    if (error?.response?.data?.error) {
      return NextResponse.json(
        { error: error.response.data.error },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
