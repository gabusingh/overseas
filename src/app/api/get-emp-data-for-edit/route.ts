import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Try to call the main backend endpoint first
    const backendUrl = 'https://backend.overseas.ai/api/get-emp-data-for-edit';
    const timestamp = Date.now();
    const urlWithTimestamp = `${backendUrl}?_t=${timestamp}`;

    try {
      // Attempt to call the external API
      const backendResponse = await fetch(urlWithTimestamp, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 seconds
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json(data);
      }
      
      // If backend returns 404 or other error, fall back to empty data
      if (backendResponse.status === 404) {
        console.log('Backend endpoint /get-emp-data-for-edit not found, returning empty profile data (this is expected for new users)');
        return NextResponse.json({
          empName: '',
          empDob: '',
          empGender: '',
          empWhatsapp: '',
          empMS: '',
          empEmail: '',
          empEdu: '',
          empTechEdu: '',
          empPassportQ: '',
          empSkill: '',
          empOccuId: '',
          empInternationMigrationExp: '',
          empDailyWage: '',
          empExpectedMonthlyIncome: '',
          empRelocationIntQ: '',
          empState: '',
          empDistrict: '',
          empPin: '',
          empRefName: '',
          empRefPhone: '',
          empRefDistance: ''
        });
      }
      
      // For other backend errors, return the error
      return NextResponse.json(
        { error: 'Backend service unavailable' },
        { status: backendResponse.status }
      );

    } catch (fetchError: any) {
      // Network error or timeout - try fallback to get-emp-data endpoint
      console.log('Primary endpoint /get-emp-data-for-edit unavailable, trying fallback to /get-emp-data:', fetchError.message);
      
      try {
        // Try fallback endpoint
        const fallbackUrl = 'https://backend.overseas.ai/api/get-emp-data';
        const fallbackResponse = await fetch(`${fallbackUrl}?_t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000)
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('Successfully retrieved data from fallback endpoint');
          return NextResponse.json(fallbackData);
        }
      } catch (fallbackError: any) {
        console.log('Fallback endpoint also failed:', fallbackError.message);
      }
      
      // If both endpoints fail, return empty data to allow form to work
      console.log('Both endpoints failed, returning empty profile data (this allows new users to fill the form)');
      return NextResponse.json({
        empName: '',
        empDob: '',
        empGender: '',
        empWhatsapp: '',
        empMS: '',
        empEmail: '',
        empEdu: '',
        empTechEdu: '',
        empPassportQ: '',
        empSkill: '',
        empOccuId: '',
        empInternationMigrationExp: '',
        empDailyWage: '',
        empExpectedMonthlyIncome: '',
        empRelocationIntQ: '',
        empState: '',
        empDistrict: '',
        empPin: '',
        empRefName: '',
        empRefPhone: '',
        empRefDistance: ''
      });
    }

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
