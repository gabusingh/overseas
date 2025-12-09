import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

// Helper function to detect duplicate error type from error message
function detectDuplicateType(errorMessage: string): {
  type: 'email' | 'mobile' | 'generic' | null;
  message: string;
} {
  const lowerMessage = errorMessage.toLowerCase();
  
  if (/email.*already.*registered|email.*already.*exists|email.*already.*taken/i.test(lowerMessage)) {
    return {
      type: 'email',
      message: 'This email address is already registered. Please use a different email or login with your existing account.'
    };
  }
  
  if (/phone.*already.*registered|phone.*already.*exists|mobile.*already.*registered|already.*registered/i.test(lowerMessage)) {
    return {
      type: 'mobile',
      message: 'This mobile number is already registered. Please use the login page instead.'
    };
  }
  
  if (/duplicate|already.*exists|already.*taken/i.test(lowerMessage)) {
    return {
      type: 'generic',
      message: 'This information is already registered. Please check your details and try again.'
    };
  }
  
  return { type: null, message: errorMessage };
}

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data from the request
    const formData = await request.formData();
    
    // Create new FormData for the external API call
    // Forward all fields directly to the register-hra endpoint
    const externalFormData = new FormData();
    
    // Extract all fields from the request
    const cmpOtp = formData.get('cmpOtp') as string;
    const cmpOfficialMob = formData.get('cmpOfficialMob') as string;
    const cmpName = formData.get('cmpName') as string;
    const cmpContPerson = formData.get('cmpContPerson') as string;
    const password = formData.get('password') as string;
    const password_confirmation = formData.get('password_confirmation') as string;
    const cmpEmail = formData.get('cmpEmail') as string;
    const countryCode = formData.get('countryCode') as string;
    const source = formData.get('source') as string;
    const RaLicenseNumber = formData.get('RaLicenseNumber') as string;
    const cmpOfficialAddress = formData.get('cmpOfficialAddress') as string;
    const cmpDescription = formData.get('cmpDescription') as string;
    const cmpPin = formData.get('cmpPin') as string;
    const cmpLogo = formData.get('cmpLogo') as File | null;
    
    // Forward all fields to the backend register-hra endpoint
    if (cmpOtp) externalFormData.append('cmpOtp', cmpOtp);
    if (countryCode) externalFormData.append('countryCode', countryCode);
    if (cmpOfficialMob) externalFormData.append('cmpOfficialMob', cmpOfficialMob);
    if (cmpName) externalFormData.append('cmpName', cmpName);
    if (source) externalFormData.append('source', source);
    if (cmpEmail) externalFormData.append('cmpEmail', cmpEmail);
    if (cmpContPerson) externalFormData.append('cmpContPerson', cmpContPerson);
    if (RaLicenseNumber) externalFormData.append('RaLicenseNumber', RaLicenseNumber);
    if (cmpOfficialAddress) externalFormData.append('cmpOfficialAddress', cmpOfficialAddress);
    if (cmpDescription) externalFormData.append('cmpDescription', cmpDescription);
    if (cmpPin) externalFormData.append('cmpPin', cmpPin);
    if (password) externalFormData.append('password', password);
    if (password_confirmation) externalFormData.append('password_confirmation', password_confirmation);
    if (cmpLogo && cmpLogo instanceof File) {
      externalFormData.append('cmpLogo', cmpLogo);
    }

    // Call the register-hra endpoint on the backend
    const response = await axios.post(`${BASE_URL}register-hra`, externalFormData, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check for OTP errors first (specific error format)
    const errorMessage = response.data?.error || response.data?.msg || response.data?.message || '';
    const lowerErrorMessage = errorMessage.toLowerCase();
    
    if (lowerErrorMessage.includes('mobile number not found') || 
        lowerErrorMessage.includes('invalid otp') ||
        (lowerErrorMessage.includes('otp') && (lowerErrorMessage.includes('invalid') || lowerErrorMessage.includes('not found')))) {
      return NextResponse.json(
        { error: 'Mobile Number Not Found or Invalid OTP.' },
        { status: 422 }
      );
    }
    
    // Check for validation errors
    if (response.data?.errors || response.data?.data?.errors) {
      const errorsData = response.data?.errors || response.data?.data?.errors;
      return NextResponse.json({ errors: errorsData }, { status: 422 });
    }
    
    // Handle successful response
    // Backend returns: {status: 201, data: {data: {...company data...}, message: "Company registered successfully"}}
    // Or: {data: {access_token, user, ...}, message: "..."}
    const accessToken = response.data?.access_token || response.data?.data?.access_token;
    const user = response.data?.user || response.data?.data?.user;
    // Backend may nest data in response.data.data
    const backendData = response.data?.data || response.data;
    const isSuccessStatus = response.status === 200 || response.status === 201;
    const hasSuccessMessage = response.data?.message === 'Company registered successfully' || 
                             response.data?.message?.toLowerCase().includes('success');
    
    // If we have a success message or success status, return success (even without access_token)
    // Registration can succeed without auto-login - user will need to login separately
    if (hasSuccessMessage || (isSuccessStatus && !response.data?.error && !response.data?.errors)) {
      const responseData = {
        message: response.data?.message || 'Company registered successfully',
        data: {
          // Include access_token if it exists
          ...(accessToken ? { access_token: accessToken } : {}),
          // Include user data if it exists
          ...(user ? { user } : {}),
          // Include all other backend data (company info, etc.)
          ...(backendData && typeof backendData === 'object' ? backendData : {})
        }
      };
      
      return NextResponse.json(responseData, { status: 201 });
    }
    
    // Handle other error responses
    if (response.data?.error) {
      return NextResponse.json(
        { error: response.data.error },
        { status: 422 }
      );
    }
    
    // If response doesn't match expected format, return as-is with 201 if it looks successful
    if (response.status === 200 || response.status === 201) {
      return NextResponse.json({
        message: 'Company registered successfully',
        data: response.data
      }, { status: 201 });
    }
    
    // Default error response
    return NextResponse.json({
      error: 'Registration failed. Please try again.',
      data: response.data
    }, { status: 400 });
    
  } catch (error: any) {
    
    // Handle validation errors (422)
    if (error?.response?.status === 422) {
      // Check for OTP errors
      const errorMessage = error.response.data?.error || error.response.data?.msg || error.response.data?.message || '';
      const lowerErrorMessage = errorMessage.toLowerCase();
      
      if (lowerErrorMessage.includes('mobile number not found') || 
          lowerErrorMessage.includes('invalid otp') ||
          (lowerErrorMessage.includes('otp') && (lowerErrorMessage.includes('invalid') || lowerErrorMessage.includes('not found')))) {
        return NextResponse.json(
          { error: 'Mobile Number Not Found or Invalid OTP.' },
          { status: 422 }
        );
      }
      
      // Handle validation errors array/object
      if (error.response.data?.errors) {
        return NextResponse.json(
          { errors: error.response.data.errors },
          { status: 422 }
        );
      }
      
      // Handle single error message
      if (error.response.data?.error) {
        return NextResponse.json(
          { error: error.response.data.error },
          { status: 422 }
        );
      }
      
      // Default 422 response
      return NextResponse.json(
        { error: error.response.data?.msg || error.response.data?.message || 'Validation failed' },
        { status: 422 }
      );
    }
    
    // Handle other error responses
    if (error?.response?.data) {
      const status = error.response?.status || 500;
      
      // Check for OTP errors in any status
      const errorMessage = error.response.data?.error || error.response.data?.msg || error.response.data?.message || '';
      const lowerErrorMessage = errorMessage.toLowerCase();
      
      if (lowerErrorMessage.includes('mobile number not found') || 
          lowerErrorMessage.includes('invalid otp') ||
          (lowerErrorMessage.includes('otp') && (lowerErrorMessage.includes('invalid') || lowerErrorMessage.includes('not found')))) {
        return NextResponse.json(
          { error: 'Mobile Number Not Found or Invalid OTP.' },
          { status: 422 }
        );
      }
      
      if (error.response.data?.errors) {
        return NextResponse.json(
          { errors: error.response.data.errors },
          { status: status }
        );
      }
      
      return NextResponse.json(
        { 
          error: error.response.data?.error || error.response.data?.msg || error.response.data?.message || 'Registration failed'
        },
        { status: status }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

