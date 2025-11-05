import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/services/user.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Send OTP Request body:', body);
    const { empPhone, empName, countryCode } = body;

    // Validate required fields
    if (!empPhone || !empName) {
      return NextResponse.json(
        { success: false, message: 'Mobile number and name are required' },
        { status: 400 }
      );
    }

    // Validate mobile number format - must be exactly 10 digits for Indian numbers
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
    if (countryCode) {
      formData.append('countryCode', countryCode);
    }
    // Tag as HRA flow for backend analytics/routing if supported
    formData.append('type', 'hra');

    console.log('Calling signUp with:', { empPhone, empName });
    
    // Call the external signup service
    const response = await signUp(formData);
    
    console.log('SignUp full response:', response);
    console.log('SignUp response data:', response?.data);
    console.log('SignUp response status:', response?.status);

    // Check various possible response formats
    if (response?.data?.msg === 'OTP sent successfully' || 
        response?.data?.message === 'OTP sent successfully') {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully to your mobile number'
      });
    } else if (response?.data?.msg || response?.data?.message) {
      // If there's any message, consider it success unless it contains error keywords
      const message = response.data.msg || response.data.message;
      // Check if user is already registered
      const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(message.toLowerCase());
      const isError = message.toLowerCase().includes('error') || 
                      message.toLowerCase().includes('failed');
      
      if (isAlreadyRegistered) {
        return NextResponse.json({
          success: false,
          message: 'This mobile number is already registered. Please use the login page instead.'
        }, { status: 400 });
      }
      
      return NextResponse.json({
        success: !isError,
        message: message
      }, { status: isError ? 400 : 200 });
    } else if (response?.data?.error) {
      const errorMessage = response.data.error;
      // Check if user is already registered
      const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(errorMessage.toLowerCase());
      
      return NextResponse.json(
        { 
          success: false, 
          message: isAlreadyRegistered 
            ? 'This mobile number is already registered. Please use the login page instead.' 
            : errorMessage 
        },
        { status: 400 }
      );
    } else if (response?.status === 200 || response?.status === 201) {
      // If we got a successful status but no specific message, assume OTP was sent
      console.log('Assuming success due to status code:', response.status);
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      console.log('Unexpected response format, returning error');
      return NextResponse.json(
        { success: false, message: 'Unexpected response from OTP service' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Send OTP API error:', error.message || error);
    console.error('Error response:', error?.response?.data);
    
    // Handle specific error responses from the external API
    if (error?.response?.data?.error) {
      const errorMessage = error.response.data.error;
      const statusCode = error?.response?.status || 400;
      // Check if user is already registered
      const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(errorMessage.toLowerCase());
      
      return NextResponse.json(
        { 
          success: false, 
          message: isAlreadyRegistered 
            ? 'This mobile number is already registered. Please use the login page instead.' 
            : errorMessage 
        },
        { status: statusCode }
      );
    } else if (error?.response?.data?.msg || error?.response?.data?.message) {
      const errorMessage = error.response.data.msg || error.response.data.message;
      const statusCode = error?.response?.status || 400;
      // Check if user is already registered
      const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(errorMessage.toLowerCase());
      
      if (isAlreadyRegistered) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'This mobile number is already registered. Please use the login page instead.' 
          },
          { status: statusCode }
        );
      } else {
        return NextResponse.json(
          { 
            success: false, 
            message: errorMessage 
          },
          { status: statusCode }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
