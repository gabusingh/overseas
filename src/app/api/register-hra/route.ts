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
    // Using the existing register-person-step1 endpoint which works for candidates
    const externalFormData = new FormData();
    
    // Map employer fields to the generic registration fields
    const cmpOtp = formData.get('cmpOtp') as string;
    const cmpOfficialMob = formData.get('cmpOfficialMob') as string;
    const cmpName = formData.get('cmpName') as string;
    const cmpContPerson = formData.get('cmpContPerson') as string;
    const password = formData.get('password') as string;
    const cmpEmail = formData.get('cmpEmail') as string;
    const countryCode = formData.get('countryCode') as string;
    
    // Use the same fields as candidate registration
    externalFormData.append('otp', cmpOtp || '');
    externalFormData.append('empPhone', cmpOfficialMob || '');
    externalFormData.append('empName', cmpContPerson || cmpName || ''); // Use contact person or company name
    externalFormData.append('empPassword', password || '');
    externalFormData.append('password', password || ''); // Also send as password field for backend
    externalFormData.append('empType', 'company'); // Mark as company/employer type
    externalFormData.append('countryCode', countryCode || ''); // Country code is required
    if (cmpEmail) {
      externalFormData.append('empEmail', cmpEmail);
    }

    // Call the existing registration endpoint
    const response = await axios.post(`${BASE_URL}register-person-step1`, externalFormData, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check for errors first (even if there's a success message)
    if (response.data?.errors || response.data?.data?.errors) {
      const errorsData = response.data?.errors || response.data?.data?.errors;
      let duplicateError = null;
      
      if (Array.isArray(errorsData)) {
        for (const errorMsg of errorsData) {
          const duplicateInfo = detectDuplicateType(errorMsg);
          if (duplicateInfo.type && !duplicateError) {
            duplicateError = { type: duplicateInfo.type, message: duplicateInfo.message };
          }
        }
      } else {
        const emailError = errorsData.empEmail?.[0] || errorsData.email?.[0] || errorsData.cmpEmail?.[0];
        const phoneError = errorsData.empPhone?.[0] || errorsData.phone?.[0] || errorsData.mobile?.[0] || errorsData.cmpOfficialMob?.[0];
        
        if (emailError) {
          const duplicateInfo = detectDuplicateType(emailError);
          if (duplicateInfo.type === 'email') {
            duplicateError = { type: 'email', message: duplicateInfo.message };
          }
        } else if (phoneError) {
          const duplicateInfo = detectDuplicateType(phoneError);
          if (duplicateInfo.type === 'mobile') {
            duplicateError = { type: 'mobile', message: duplicateInfo.message };
          }
        }
      }
      
      if (duplicateError) {
        return NextResponse.json(
          { error: duplicateError.message, duplicateType: duplicateError.type },
          { status: 422 }
        );
      }
      
      return NextResponse.json({ errors: errorsData }, { status: 422 });
    }
    
    // Handle successful response
    if (response.data?.access_token) {
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
      const duplicateInfo = detectDuplicateType(errorMessage);
      
      return NextResponse.json(
        { error: duplicateInfo.message, duplicateType: duplicateInfo.type },
        { status: 422 }
      );
    } else if (response.data?.msg) {
      const msgText = response.data.msg;
      const duplicateInfo = detectDuplicateType(msgText);
      
      if (duplicateInfo.type) {
        return NextResponse.json(
          { error: duplicateInfo.message, duplicateType: duplicateInfo.type },
          { status: 400 }
        );
      }
      
      if (msgText.toLowerCase().includes('invalid') || 
          msgText.toLowerCase().includes('error') ||
          msgText.toLowerCase().includes('failed')) {
        return NextResponse.json({ error: msgText }, { status: 400 });
      }
      
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
        const errorsData = error.response.data.errors;
        let duplicateError = null;
        
        // Handle array format
        if (Array.isArray(errorsData)) {
          for (const errorMsg of errorsData) {
            const duplicateInfo = detectDuplicateType(errorMsg);
            if (duplicateInfo.type && !duplicateError) {
              duplicateError = { type: duplicateInfo.type, message: duplicateInfo.message };
            }
          }
        } else {
          // Handle object format
          const emailError = errorsData.empEmail?.[0] || errorsData.email?.[0] || errorsData.cmpEmail?.[0];
          const phoneError = errorsData.empPhone?.[0] || errorsData.phone?.[0] || errorsData.mobile?.[0] || errorsData.cmpOfficialMob?.[0];
          
          if (emailError) {
            const duplicateInfo = detectDuplicateType(emailError);
            if (duplicateInfo.type === 'email') {
              duplicateError = { type: 'email', message: duplicateInfo.message };
            }
          } else if (phoneError) {
            const duplicateInfo = detectDuplicateType(phoneError);
            if (duplicateInfo.type === 'mobile') {
              duplicateError = { type: 'mobile', message: duplicateInfo.message };
            }
          }
        }
        
        if (duplicateError) {
          return NextResponse.json(
            { error: duplicateError.message, duplicateType: duplicateError.type },
            { status: 422 }
          );
        }
        
        return NextResponse.json({ errors: errorsData }, { status: 422 });
      } else if (error.response.data?.error) {
        const errorMessage = error.response.data.error;
        const duplicateInfo = detectDuplicateType(errorMessage);
        
        return NextResponse.json(
          { 
            error: duplicateInfo.message,
            duplicateType: duplicateInfo.type
          },
          { status: 422 }
        );
      } else if (error.response.data?.msg) {
        const errorMessage = error.response.data.msg;
        const duplicateInfo = detectDuplicateType(errorMessage);
        
        return NextResponse.json(
          { 
            error: duplicateInfo.message,
            duplicateType: duplicateInfo.type
          },
          { status: 422 }
        );
      } else if (error.response.data?.message) {
        // Handle backend response with 'message' field (e.g., "Phone Number Already Exist")
        const errorMessage = error.response.data.message;
        const duplicateInfo = detectDuplicateType(errorMessage);
        
        return NextResponse.json(
          { 
            error: duplicateInfo.message,
            duplicateType: duplicateInfo.type
          },
          { status: 422 }
        );
      }
    }
    
    // Handle other error responses
    if (error?.response?.data) {
      const errorMessage = error.response.data?.error || error.response.data?.msg || error.response.data?.message || 'Registration failed';
      const duplicateInfo = detectDuplicateType(errorMessage);
      
      return NextResponse.json(
        { 
          error: duplicateInfo.message,
          duplicateType: duplicateInfo.type
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
