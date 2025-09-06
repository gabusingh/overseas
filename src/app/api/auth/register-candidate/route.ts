import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpForSignUp } from '@/services/user.service';
import { setStoredUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { empName, empPhone, password, otp } = body;

    // Validate required fields
    if (!empName || !empPhone || !password || !otp) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(empPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit OTP' },
        { status: 400 }
      );
    }

    // Create FormData for the external API
    const formData = new FormData();
    formData.append('empName', empName);
    formData.append('empPhone', empPhone);
    formData.append('empPassword', password);
    formData.append('otp', otp);
    formData.append('empType', 'person'); // Default type for candidate registration

    // Call the external registration service
    const response = await verifyOtpForSignUp(formData);

    if (response?.data?.access_token) {
      // Successful registration
      const userData = {
        id: response.data.user?.id || response.data.userId,
        type: response.data.user?.type || 'person',
        email: response.data.user?.email || response.data.empEmail || '',
        phone: response.data.user?.phone || empPhone,
        name: response.data.user?.name || empName
      };

      // Return the complete response for frontend storage
      return NextResponse.json({
        success: true,
        access_token: response.data.access_token,
        user: userData,
        message: 'Registration successful! Welcome to Overseas.ai'
      });
    } else if (response?.data?.error) {
      return NextResponse.json(
        { error: response.data.error },
        { status: 400 }
      );
    } else if (response?.data?.msg && response.data.msg.includes('Invalid')) {
      return NextResponse.json(
        { error: response.data.msg },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: 'Registration failed. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration API error:', error);
    
    // Handle specific error responses from the external API
    if (error?.response?.data?.error) {
      const statusCode = error?.response?.status || 400;
      return NextResponse.json(
        { error: error.response.data.error },
        { status: statusCode }
      );
    } else if (error?.response?.data?.msg) {
      const statusCode = error?.response?.status || 400;
      return NextResponse.json(
        { error: error.response.data.msg },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
