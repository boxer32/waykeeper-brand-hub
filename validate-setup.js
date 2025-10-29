// Simple validation script for Waykeeper Brand Hub
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Waykeeper Brand Hub Setup...\n');

// Check critical files
const criticalFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'tsconfig.json',
    'app/layout.tsx',
    'app/page.tsx',
    'app/globals.css',
    'lib/utils.ts'
];

let allGood = true;

criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allGood = false;
    }
});

// Check components
console.log('\n📦 Components:');
const components = [
    'components/Header.tsx',
    'components/ColorPalette.tsx',
    'components/Typography.tsx',
    'components/LogoVariations.tsx',
    'components/AssetLibrary.tsx',
    'components/VoiceTonePlayground.tsx',
    'components/PhotographyGuide.tsx',
    'components/SubBrandSelector.tsx',
    'components/CopyPasteComponents.tsx',
    'components/BrandComplianceChecker.tsx'
];

components.forEach(comp => {
    if (fs.existsSync(comp)) {
        console.log(`✅ ${comp}`);
    } else {
        console.log(`❌ ${comp} - MISSING`);
        allGood = false;
    }
});

// Check test files
console.log('\n🧪 Test Files:');
const testFiles = [
    '__tests__/lib/utils.test.ts',
    '__tests__/components/ColorPalette.test.tsx',
    '__tests__/components/Header.test.tsx',
    '__tests__/components/VoiceTonePlayground.test.tsx',
    '__tests__/components/AssetLibrary.test.tsx',
    '__tests__/components/BrandComplianceChecker.test.tsx',
    'tests/e2e/homepage.spec.ts',
    'tests/e2e/navigation.spec.ts',
    'tests/e2e/color-palette.spec.ts',
    'tests/e2e/voice-tone-playground.spec.ts',
    'tests/e2e/asset-library.spec.ts',
    'tests/e2e/brand-compliance-checker.spec.ts',
    'tests/e2e/accessibility.spec.ts'
];

testFiles.forEach(test => {
    if (fs.existsSync(test)) {
        console.log(`✅ ${test}`);
    } else {
        console.log(`❌ ${test} - MISSING`);
        allGood = false;
    }
});

// Check configuration files
console.log('\n⚙️  Configuration:');
const configFiles = [
    'jest.config.js',
    'jest.setup.js',
    'playwright.config.ts',
    'lighthouse.config.js',
    'postcss.config.js'
];

configFiles.forEach(config => {
    if (fs.existsSync(config)) {
        console.log(`✅ ${config}`);
    } else {
        console.log(`❌ ${config} - MISSING`);
        allGood = false;
    }
});

// Check documentation
console.log('\n📚 Documentation:');
const docs = [
    'README.md',
    'TESTING.md',
    'test-runner.html'
];

docs.forEach(doc => {
    if (fs.existsSync(doc)) {
        console.log(`✅ ${doc}`);
    } else {
        console.log(`❌ ${doc} - MISSING`);
        allGood = false;
    }
});

// Check for TypeScript errors
console.log('\n🔍 Checking for TypeScript errors...');
try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    console.log('✅ TypeScript configuration is valid');
} catch (error) {
    console.log(`❌ TypeScript configuration error: ${error.message}`);
    allGood = false;
}

// Check package.json scripts
console.log('\n📜 Package.json Scripts:');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = ['dev', 'build', 'test', 'test:e2e'];
    
    requiredScripts.forEach(script => {
        if (pkg.scripts && pkg.scripts[script]) {
            console.log(`✅ ${script}: ${pkg.scripts[script]}`);
        } else {
            console.log(`❌ ${script} - MISSING`);
            allGood = false;
        }
    });
} catch (error) {
    console.log(`❌ Package.json error: ${error.message}`);
    allGood = false;
}

// Summary
console.log('\n📊 Validation Summary:');
if (allGood) {
    console.log('🎉 All critical files and configurations are present!');
    console.log('✅ The Waykeeper Brand Hub setup is complete and ready for testing.');
    console.log('\n🚀 Next steps:');
    console.log('1. Run "npm install" to install dependencies');
    console.log('2. Run "npm run dev" to start the development server');
    console.log('3. Run "npm test" to run unit tests');
    console.log('4. Run "npm run test:e2e" to run E2E tests');
    console.log('5. Open test-runner.html in a browser for manual testing');
} else {
    console.log('⚠️  Some files or configurations are missing.');
    console.log('Please check the errors above and fix them before proceeding.');
}

console.log('\n🔗 Manual Test Runner:');
console.log('Open test-runner.html in your browser to run manual component tests.');
