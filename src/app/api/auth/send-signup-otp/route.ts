import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/services/user.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { empPhone, empName } = body;

    // Validate required fields
    if (!empPhone || !empName) {
      return NextResponse.json(
        { success: false, message: 'Mobile number and name are required' },
        { status: 400 }
      );
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(empPhone)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    // Create FormData for the external API
    const formData = new FormData();
    formData.append('empPhone', empPhone);
    formData.append('empName', empName);

    // Call the external signup service
    const response = await signUp(formData);

    if (response?.data?.msg === 'OTP sent successfully') {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully to your mobile number'
      });
    } else if (response?.data?.msg) {
      return NextResponse.json({
        success: true,
        message: response.data.msg
      });
    } else if (response?.data?.error) {
      return NextResponse.json(
        { success: false, message: response.data.error },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Send OTP API error:', error);
    
    // Handle specific error responses from the external API
    if (error?.response?.data?.error) {
      const statusCode = error?.response?.status || 400;
      return NextResponse.json(
        { success: false, message: error.response.data.error },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
