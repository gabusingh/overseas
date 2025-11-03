import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data from the request
    const formData = await request.formData();
    
    // Create new FormData for the external API call
    // Using the existing register-person-step1 endpoint which works for candidates
    const externalFormData = new FormData();
    
    // Map employer fields to the generic registration fields
    const cmpOtp = formData.get('cmpOtp') as string;
    const cmpOfficialMob = formData.get('cmpOfficialMob') as string;
    const cmpName = formData.get('cmpName') as string;
    const cmpContPerson = formData.get('cmpContPerson') as string;
    const password = formData.get('password') as string;
    const cmpEmail = formData.get('cmpEmail') as string;
    
    // Use the same fields as candidate registration
    externalFormData.append('otp', cmpOtp || '');
    externalFormData.append('empPhone', cmpOfficialMob || '');
    externalFormData.append('empName', cmpContPerson || cmpName || ''); // Use contact person or company name
    externalFormData.append('empPassword', password || '');
    externalFormData.append('empType', 'company'); // Mark as company/employer type
    if (cmpEmail) {
      externalFormData.append('empEmail', cmpEmail);
    }

    // Call the existing registration endpoint
    const response = await axios.post(`${BASE_URL}register-person-step1`, externalFormData, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Handle successful response
    if (response.data?.access_token) {
      // Store additional company data if needed
      const responseData: any = {
        message: 'Company registered successfully',
        access_token: response.data.access_token,
        user: {
          ...(response.data.user || {}),
          type: 'company',
          companyName: cmpName,
          contactPerson: cmpContPerson
        }
      };
      
      return NextResponse.json(responseData, { status: 201 });
    } else if (response.data?.error) {
      const errorMessage = response.data.error;
      // Check if user is already registered
      const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(errorMessage.toLowerCase());
      
      return NextResponse.json(
        { 
          error: isAlreadyRegistered 
            ? 'This mobile number is already registered. Please use the login page instead.' 
            : errorMessage 
        },
        { status: 422 }
      );
    } else if (response.data?.msg) {
      const msgText = response.data.msg;
      // Check if user is already registered
      const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(msgText.toLowerCase());
      
      if (isAlreadyRegistered) {
        return NextResponse.json(
          { error: 'This mobile number is already registered. Please use the login page instead.' },
          { status: 400 }
        );
      }
      
      // Check if it's an error message
      if (msgText.toLowerCase().includes('invalid') || 
          msgText.toLowerCase().includes('error') ||
          msgText.toLowerCase().includes('failed')) {
        return NextResponse.json(
          { error: msgText },
          { status: 400 }
        );
      }
      // Otherwise treat as success message
      return NextResponse.json({
        message: msgText,
        data: response.data
      }, { status: 201 });
    } else {
      return NextResponse.json({
        message: 'Registration completed successfully',
        data: response.data
      }, { status: 201 });
    }
    
  } catch (error: any) {
    console.error('Register HRA API error:', error);
    
    // Handle validation errors
    if (error?.response?.status === 422 || error?.response?.status === 400) {
      if (error.response.data?.errors) {
        return NextResponse.json(
          { errors: error.response.data.errors },
          { status: 422 }
        );
      } else if (error.response.data?.error) {
        const errorMessage = error.response.data.error;
        // Check if user is already registered
        const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(errorMessage.toLowerCase());
        
        return NextResponse.json(
          { 
            error: isAlreadyRegistered 
              ? 'This mobile number is already registered. Please use the login page instead.' 
              : errorMessage 
          },
          { status: 422 }
        );
      } else if (error.response.data?.msg) {
        const errorMessage = error.response.data.msg;
        // Check if user is already registered
        const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(errorMessage.toLowerCase());
        
        return NextResponse.json(
          { 
            error: isAlreadyRegistered 
              ? 'This mobile number is already registered. Please use the login page instead.' 
              : errorMessage 
          },
          { status: 422 }
        );
      }
    }
    
    // Handle other error responses
    if (error?.response?.data) {
      const errorMessage = error.response.data?.error || error.response.data?.msg || 'Registration failed';
      // Check if user is already registered
      const isAlreadyRegistered = /already\s*registered|exists?|duplicate/i.test(errorMessage.toLowerCase());
      
      return NextResponse.json(
        { 
          error: isAlreadyRegistered 
            ? 'This mobile number is already registered. Please use the login page instead.' 
            : errorMessage 
        },
        { status: error.response?.status || 500 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
