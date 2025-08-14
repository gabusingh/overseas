const axios = require('axios');

const BASE_URL = 'https://backend.overseas.ai/api/';

// Test API endpoints used in homepage
const apiEndpoints = [
  { name: 'Get Occupations', url: BASE_URL + 'get-occupations', method: 'GET' },
  { name: 'Get Countries for Jobs', url: BASE_URL + 'country-list-for-jobs', method: 'GET' },
  { name: 'Get Training Institutes', url: BASE_URL + 'list-training-institute', method: 'GET' },
  { name: 'Get Companies', url: BASE_URL + 'get-companies', method: 'GET' },
  { name: 'Get Latest Jobs', url: BASE_URL + 'get-latest-jobs', method: 'GET' },
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
      dataLength: response.data ? (Array.isArray(response.data.data) ? response.data.data.length : 'N/A') : 'N/A',
      message: 'Connected successfully'
    };
  } catch (error) {
    return {
      name: endpoint.name,
      status: 'FAILED',
      statusCode: error.response?.status || 'TIMEOUT/ERROR',
      dataLength: 'N/A',
      message: error.message || 'Connection failed'
    };
  }
}

async function testAllAPIs() {
  console.log('🔍 Testing API Connections for Overseas.ai Homepage...\n');
  console.log('Base URL:', BASE_URL);
  console.log('=' .repeat(80));
  
  const results = [];
  
  for (const endpoint of apiEndpoints) {
    const result = await testAPI(endpoint);
    results.push(result);
    
    const statusEmoji = result.status === 'SUCCESS' ? '✅' : '❌';
    console.log(`${statusEmoji} ${result.name.padEnd(30)} | Status: ${result.statusCode.toString().padEnd(10)} | Data Length: ${result.dataLength.toString().padEnd(10)} | ${result.message}`);
  }
  
  console.log('=' .repeat(80));
  
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const failCount = results.filter(r => r.status === 'FAILED').length;
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ Connected APIs: ${successCount}/${apiEndpoints.length}`);
  console.log(`   ❌ Failed APIs: ${failCount}/${apiEndpoints.length}`);
  console.log(`   📈 Connection Rate: ${((successCount/apiEndpoints.length) * 100).toFixed(1)}%`);
  
  if (failCount > 0) {
    console.log(`\n⚠️  ISSUES FOUND:`);
    results.filter(r => r.status === 'FAILED').forEach(result => {
      console.log(`   - ${result.name}: ${result.message} (Status: ${result.statusCode})`);
    });
  } else {
    console.log(`\n🎉 All APIs are working perfectly!`);
  }
}

// Run the test
testAllAPIs().catch(console.error);
