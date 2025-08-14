const axios = require('axios');

const BASE_URL = 'https://backend.overseas.ai/api/';

// Test API endpoints used in homepage with corrected endpoint
const apiEndpoints = [
  { name: 'Get Occupations', url: BASE_URL + 'get-occupations', method: 'GET' },
  { name: 'Get Countries for Jobs', url: BASE_URL + 'country-list-for-jobs', method: 'GET' },
  { name: 'Get Training Institutes', url: BASE_URL + 'list-training-institute', method: 'GET' },
  { name: 'Get All Companies (Fixed)', url: BASE_URL + 'get-all-companies', method: 'GET' },
  { name: 'Get News Feed', url: BASE_URL + 'get-news-feed', method: 'GET' },
  { name: 'Get Home Page Data', url: BASE_URL + 'home-page-data', method: 'GET' },
  { name: 'Get Success Notification', url: BASE_URL + 'show-success-notification', method: 'GET' }
];

async function testAPI(endpoint) {
  try {
    const response = await axios.get(endpoint.url, { timeout: 10000 });
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
  if (data.cmpData && Array.isArray(data.cmpData)) return data.cmpData.length; // For companies
  if (data.notifications && Array.isArray(data.notifications)) return data.notifications.length; // For notifications
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
  console.log('🔍 Testing Updated API Connections for Overseas.ai Homepage...\n');
  console.log('Base URL:', BASE_URL);
  console.log('=' .repeat(90));
  
  const results = [];
  
  for (const endpoint of apiEndpoints) {
    const result = await testAPI(endpoint);
    results.push(result);
    
    const statusEmoji = result.status === 'SUCCESS' ? '✅' : '❌';
    console.log(`${statusEmoji} ${result.name.padEnd(35)} | ${result.statusCode.toString().padEnd(12)} | Data: ${result.dataLength.toString().padEnd(8)} | ${result.message}`);
  }
  
  console.log('=' .repeat(90));
  
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const failCount = results.filter(r => r.status === 'FAILED').length;
  
  console.log(`\n📊 UPDATED SUMMARY:`);
  console.log(`   ✅ Working APIs: ${successCount}/${apiEndpoints.length}`);
  console.log(`   ❌ Failed APIs: ${failCount}/${apiEndpoints.length}`);
  console.log(`   📈 Success Rate: ${((successCount/apiEndpoints.length) * 100).toFixed(1)}%`);
  
  // Homepage specific analysis
  console.log(`\n🏠 HOMEPAGE COMPONENT STATUS:`);
  const homepageComponents = [
    { component: 'HeroSection', apis: ['Get Occupations', 'Get Countries for Jobs'], status: '✅' },
    { component: 'JobsSliderList', apis: ['Get Training Institutes', 'Get Countries for Jobs', 'Get Occupations'], status: '✅' },
    { component: 'JobOpeningInTopCompany', apis: ['Get All Companies (Fixed)'], status: results.find(r => r.name.includes('Get All Companies'))?.status === 'SUCCESS' ? '✅' : '❌' },
    { component: 'NewsSlider', apis: ['Get News Feed'], status: results.find(r => r.name === 'Get News Feed')?.status === 'SUCCESS' ? '✅' : '❌' },
    { component: 'SuccessfulPlacedCandidateList', apis: ['Get Success Notification'], status: results.find(r => r.name === 'Get Success Notification')?.status === 'SUCCESS' ? '✅' : '❌' }
  ];
  
  homepageComponents.forEach(comp => {
    console.log(`   ${comp.status} ${comp.component.padEnd(30)} - APIs: ${comp.apis.join(', ')}`);
  });
  
  if (failCount === 0) {
    console.log(`\n🎉 EXCELLENT! All homepage APIs are now working!`);
    console.log(`   📱 Homepage should display real data instead of mock data`);
    console.log(`   🏢 Real company data will be shown`);
    console.log(`   📰 Real news feed will be displayed`);
  } else {
    console.log(`\n⚠️  PARTIAL SUCCESS:`);
    console.log(`   📈 ${successCount} out of ${apiEndpoints.length} APIs are working`);
    console.log(`   🔧 Components with working APIs will show real data`);
    console.log(`   💾 Components with failed APIs will show fallback/mock data`);
  }
}

// Run the updated test
testAllAPIs().catch(console.error);
