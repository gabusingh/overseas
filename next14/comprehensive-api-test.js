const axios = require('axios');

const BASE_URL = 'https://backend.overseas.ai/api/';

// All API endpoints categorized by service
const apiEndpoints = {
  'Info Service APIs': [
    { name: 'Get Occupations', url: BASE_URL + 'get-occupations', method: 'GET' },
    { name: 'Get Countries for Jobs', url: BASE_URL + 'country-list-for-jobs', method: 'GET' },
    { name: 'Get Countries', url: BASE_URL + 'country-list', method: 'GET' },
    { name: 'Get States', url: BASE_URL + 'state-list', method: 'GET' },
    { name: 'Get Home Page Data', url: BASE_URL + 'home-page-data', method: 'GET' },
    { name: 'Get News Feed', url: BASE_URL + 'get-news-feed', method: 'GET' },
    { name: 'Get Success Notification', url: BASE_URL + 'show-success-notification', method: 'GET' },
    { name: 'Get Country Codes', url: BASE_URL + 'country-code-list', method: 'GET' },
    { name: 'Check Version', url: BASE_URL + 'check-version', method: 'GET' },
    { name: 'Get Trade Test Centers', url: BASE_URL + 'get-trade-test-centers', method: 'GET' }
  ],
  
  'Institute Service APIs': [
    { name: 'Get Training Institutes', url: BASE_URL + 'list-training-institute', method: 'GET' }
  ],
  
  'Job Service APIs (Public)': [
    { name: 'Get Companies', url: BASE_URL + 'get-companies', method: 'GET' },
    { name: 'Get Latest Jobs', url: BASE_URL + 'get-latest-jobs', method: 'GET' },
    { name: 'Get Job Statistics', url: BASE_URL + 'job-statistics', method: 'GET' }
  ],
  
  'User Service APIs (Public)': [
    { name: 'Contact Us', url: BASE_URL + 'contact-us', method: 'POST', requiresAuth: false, testData: true }
  ],
  
  'Authentication Required APIs': [
    { name: 'User Dashboard', url: BASE_URL + 'get-user-dashboard', method: 'GET', requiresAuth: true },
    { name: 'User Applied Jobs', url: BASE_URL + 'user-applied-job-list', method: 'GET', requiresAuth: true },
    { name: 'User Saved Jobs', url: BASE_URL + 'user-saved-jobs-list', method: 'GET', requiresAuth: true },
    { name: 'User Notifications', url: BASE_URL + 'user-all-notification', method: 'GET', requiresAuth: true }
  ]
};

async function testAPI(endpoint) {
  try {
    if (endpoint.requiresAuth) {
      // Skip auth-required APIs for now
      return {
        name: endpoint.name,
        status: 'SKIPPED',
        statusCode: 'N/A',
        dataLength: 'N/A',
        message: 'Requires authentication (skipped)'
      };
    }
    
    let response;
    if (endpoint.method === 'POST' && endpoint.testData) {
      // For POST endpoints that don't require auth, send minimal test data
      const formData = new FormData();
      formData.append('test', 'true');
      response = await axios.post(endpoint.url, formData, { 
        timeout: 10000,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await axios.get(endpoint.url, { timeout: 10000 });
    }
    
    return {
      name: endpoint.name,
      status: 'SUCCESS',
      statusCode: response.status,
      dataLength: getDataLength(response.data),
      message: 'Connected successfully'
    };
  } catch (error) {
    return {
      name: endpoint.name,
      status: 'FAILED',
      statusCode: error.response?.status || 'TIMEOUT/ERROR',
      dataLength: 'N/A',
      message: getErrorMessage(error)
    };
  }
}

function getDataLength(data) {
  if (!data) return 'N/A';
  if (Array.isArray(data.data)) return data.data.length;
  if (data.data && typeof data.data === 'object') return 'Object';
  if (Array.isArray(data)) return data.length;
  return 'N/A';
}

function getErrorMessage(error) {
  if (error.response?.status === 404) return 'Endpoint not found';
  if (error.response?.status === 401) return 'Unauthorized (requires auth)';
  if (error.response?.status === 500) return 'Server error';
  if (error.code === 'ECONNABORTED') return 'Request timeout';
  return error.message || 'Connection failed';
}

async function testAllAPIs() {
  console.log('🔍 Comprehensive API Testing for Overseas.ai Platform...\n');
  console.log('Base URL:', BASE_URL);
  console.log('=' .repeat(90));
  
  let totalAPIs = 0;
  let totalSuccess = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  
  for (const [category, endpoints] of Object.entries(apiEndpoints)) {
    console.log(`\n📂 ${category}:`);
    console.log('-' .repeat(90));
    
    for (const endpoint of endpoints) {
      const result = await testAPI(endpoint);
      totalAPIs++;
      
      let statusEmoji;
      if (result.status === 'SUCCESS') {
        statusEmoji = '✅';
        totalSuccess++;
      } else if (result.status === 'SKIPPED') {
        statusEmoji = '⏭️';
        totalSkipped++;
      } else {
        statusEmoji = '❌';
        totalFailed++;
      }
      
      console.log(`${statusEmoji} ${result.name.padEnd(35)} | ${result.statusCode.toString().padEnd(12)} | Data: ${result.dataLength.toString().padEnd(8)} | ${result.message}`);
    }
  }
  
  console.log('=' .repeat(90));
  console.log(`\n📊 COMPREHENSIVE SUMMARY:`);
  console.log(`   ✅ Working APIs: ${totalSuccess}/${totalAPIs}`);
  console.log(`   ❌ Failed APIs: ${totalFailed}/${totalAPIs}`);
  console.log(`   ⏭️  Skipped APIs: ${totalSkipped}/${totalAPIs}`);
  console.log(`   📈 Success Rate: ${((totalSuccess/(totalAPIs-totalSkipped)) * 100).toFixed(1)}% (excluding auth-required)`);
  
  // Specific analysis for homepage
  console.log(`\n🏠 HOMEPAGE SPECIFIC ANALYSIS:`);
  const homepageAPIs = ['Get Occupations', 'Get Countries for Jobs', 'Get Training Institutes'];
  const homepageResults = [];
  
  for (const [category, endpoints] of Object.entries(apiEndpoints)) {
    for (const endpoint of endpoints) {
      if (homepageAPIs.includes(endpoint.name)) {
        const result = await testAPI(endpoint);
        homepageResults.push(result);
      }
    }
  }
  
  const homepageSuccess = homepageResults.filter(r => r.status === 'SUCCESS').length;
  console.log(`   📍 Core Homepage APIs: ${homepageSuccess}/${homepageAPIs.length} working`);
  
  if (homepageSuccess === homepageAPIs.length) {
    console.log(`   🎉 All core homepage APIs are working!`);
  } else {
    console.log(`   ⚠️  Some homepage APIs have issues`);
  }
  
  // Recommendations
  console.log(`\n💡 RECOMMENDATIONS:`);
  if (totalFailed > 0) {
    console.log(`   🔧 Fix ${totalFailed} failed API endpoints`);
    console.log(`   📋 Check server logs for 404 and 500 errors`);
    console.log(`   🔑 Implement proper authentication for protected endpoints`);
  }
  
  if (homepageSuccess < homepageAPIs.length) {
    console.log(`   🏠 Homepage may not load properly due to API failures`);
    console.log(`   💻 Check browser console for API errors`);
  } else {
    console.log(`   ✨ Homepage should load correctly with all required data`);
  }
}

// Run the comprehensive test
testAllAPIs().catch(console.error);
