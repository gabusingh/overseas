#!/usr/bin/env node

/**
 * Migration Test Script
 * Automated verification of legacy component migration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function runCommand(command, description) {
  try {
    log(`${COLORS.blue}▶ ${description}${COLORS.reset}`);
    const result = execSync(command, { stdio: 'pipe', encoding: 'utf8' });
    log(`${COLORS.green}✅ ${description} - Success${COLORS.reset}`);
    return { success: true, output: result };
  } catch (error) {
    log(`${COLORS.red}❌ ${description} - Failed${COLORS.reset}`);
    log(`${COLORS.red}Error: ${error.message}${COLORS.reset}`);
    return { success: false, error: error.message };
  }
}

async function testMigration() {
  log(`${COLORS.bold}${COLORS.blue}🚀 Starting Migration Verification Tests${COLORS.reset}`);
  log('');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // Test 1: Check if new components exist
  log(`${COLORS.bold}📁 Checking Component Files${COLORS.reset}`);
  
  const requiredComponents = [
    'src/components/SearchComponent.tsx',
    'src/components/JobFilter.tsx',
    'src/components/HeroSection.tsx',
    'src/app/(site)/jobs/page.tsx'
  ];

  requiredComponents.forEach(component => {
    if (checkFileExists(component)) {
      log(`${COLORS.green}✅ ${component} exists${COLORS.reset}`);
      results.passed++;
    } else {
      log(`${COLORS.red}❌ ${component} missing${COLORS.reset}`);
      results.failed++;
    }
  });

  log('');

  // Test 2: TypeScript Compilation
  log(`${COLORS.bold}🔍 TypeScript Compilation Test${COLORS.reset}`);
  const tsCheck = runCommand('npx tsc --noEmit', 'TypeScript type checking');
  if (tsCheck.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  log('');

  // Test 3: ESLint Check
  log(`${COLORS.bold}🧹 ESLint Check${COLORS.reset}`);
  const lintCheck = runCommand('npx next lint', 'ESLint validation');
  if (lintCheck.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  log('');

  // Test 4: Build Test
  log(`${COLORS.bold}🏗️ Build Test${COLORS.reset}`);
  const buildTest = runCommand('npx next build', 'Next.js build');
  if (buildTest.success) {
    results.passed++;
    
    // Check for build warnings in output
    if (buildTest.output.includes('warning') || buildTest.output.includes('Warning')) {
      log(`${COLORS.yellow}⚠️ Build completed with warnings${COLORS.reset}`);
      results.warnings++;
    }
  } else {
    results.failed++;
  }
  log('');

  // Test 5: Check Legacy CSS Integration
  log(`${COLORS.bold}🎨 Legacy CSS Integration Check${COLORS.reset}`);
  const legacyCssPath = 'src/styles/legacy.css';
  if (checkFileExists(legacyCssPath)) {
    log(`${COLORS.green}✅ Legacy CSS file exists${COLORS.reset}`);
    
    // Check if it's imported in layout or globals.css
    const globalsCssContent = fs.readFileSync('src/app/globals.css', 'utf8');
    if (globalsCssContent.includes('legacy.css') || globalsCssContent.includes('@import')) {
      log(`${COLORS.green}✅ Legacy CSS properly imported${COLORS.reset}`);
      results.passed++;
    } else {
      log(`${COLORS.yellow}⚠️ Legacy CSS may not be imported in globals.css${COLORS.reset}`);
      results.warnings++;
    }
  } else {
    log(`${COLORS.red}❌ Legacy CSS file missing${COLORS.reset}`);
    results.failed++;
  }
  log('');

  // Test 6: Component Structure Validation
  log(`${COLORS.bold}🧩 Component Structure Validation${COLORS.reset}`);
  
  const componentChecks = [
    {
      file: 'src/components/SearchComponent.tsx',
      contains: ['useRouter', 'SpeechRecognition', 'voice search']
    },
    {
      file: 'src/components/JobFilter.tsx', 
      contains: ['getOccupations', 'getCountriesForJobs', 'filter']
    }
  ];

  componentChecks.forEach(check => {
    if (checkFileExists(check.file)) {
      const content = fs.readFileSync(check.file, 'utf8');
      let foundFeatures = 0;
      
      check.contains.forEach(feature => {
        if (content.toLowerCase().includes(feature.toLowerCase())) {
          foundFeatures++;
        }
      });
      
      if (foundFeatures === check.contains.length) {
        log(`${COLORS.green}✅ ${check.file} - All features present${COLORS.reset}`);
        results.passed++;
      } else {
        log(`${COLORS.yellow}⚠️ ${check.file} - Missing some features (${foundFeatures}/${check.contains.length})${COLORS.reset}`);
        results.warnings++;
      }
    }
  });
  log('');

  // Test 7: Service Integration Check
  log(`${COLORS.bold}🔗 Service Integration Check${COLORS.reset}`);
  const services = [
    'src/services/info.service.ts',
    'src/services/job.service.ts'
  ];

  services.forEach(service => {
    if (checkFileExists(service)) {
      const content = fs.readFileSync(service, 'utf8');
      if (content.includes('getOccupations') || content.includes('getCountriesForJobs') || content.includes('getJobListForSearch')) {
        log(`${COLORS.green}✅ ${service} - Required functions present${COLORS.reset}`);
        results.passed++;
      } else {
        log(`${COLORS.yellow}⚠️ ${service} - May be missing required functions${COLORS.reset}`);
        results.warnings++;
      }
    } else {
      log(`${COLORS.red}❌ ${service} - Service file missing${COLORS.reset}`);
      results.failed++;
    }
  });
  log('');

  // Final Results
  log(`${COLORS.bold}📊 Migration Test Results${COLORS.reset}`);
  log(`${COLORS.green}✅ Passed: ${results.passed}${COLORS.reset}`);
  log(`${COLORS.yellow}⚠️ Warnings: ${results.warnings}${COLORS.reset}`);
  log(`${COLORS.red}❌ Failed: ${results.failed}${COLORS.reset}`);
  log('');

  if (results.failed === 0) {
    log(`${COLORS.bold}${COLORS.green}🎉 Migration Verification PASSED!${COLORS.reset}`);
    log(`${COLORS.green}All critical components have been successfully migrated.${COLORS.reset}`);
    
    if (results.warnings > 0) {
      log(`${COLORS.yellow}Note: ${results.warnings} warnings detected - please review manually.${COLORS.reset}`);
    }
    
    log('');
    log(`${COLORS.bold}📋 Manual Testing Checklist:${COLORS.reset}`);
    log('1. Test voice search functionality in browser');
    log('2. Verify job filter interactions');
    log('3. Check mobile responsiveness');
    log('4. Test search navigation');
    log('5. Validate API integrations');
    
    return true;
  } else {
    log(`${COLORS.bold}${COLORS.red}❌ Migration Verification FAILED!${COLORS.reset}`);
    log(`${COLORS.red}${results.failed} critical issues need to be resolved.${COLORS.reset}`);
    return false;
  }
}

// Run the test
testMigration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`${COLORS.red}Fatal error: ${error.message}${COLORS.reset}`);
    process.exit(1);
  });
