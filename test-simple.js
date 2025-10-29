#!/usr/bin/env node

/**
 * Simple test runner for Waykeeper Brand Hub
 * This script tests basic functionality without requiring Jest or complex setup
 */

const fs = require('fs');
const path = require('path');

// Test results
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function addTest(testName, passed, message) {
    results.tests.push({ testName, passed, message });
    if (passed) {
        results.passed++;
        console.log(`✅ ${testName}: PASS - ${message}`);
    } else {
        results.failed++;
        console.log(`❌ ${testName}: FAIL - ${message}`);
    }
}

function testFileExists(filePath, description) {
    try {
        const exists = fs.existsSync(filePath);
        addTest(description, exists, exists ? 'File exists' : 'File not found');
        return exists;
    } catch (error) {
        addTest(description, false, `Error: ${error.message}`);
        return false;
    }
}

function testFileContent(filePath, searchText, description) {
    try {
        if (!fs.existsSync(filePath)) {
            addTest(description, false, 'File not found');
            return false;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const contains = content.includes(searchText);
        addTest(description, contains, contains ? 'Content found' : 'Content not found');
        return contains;
    } catch (error) {
        addTest(description, false, `Error: ${error.message}`);
        return false;
    }
}

function testJSONStructure(filePath, description) {
    try {
        if (!fs.existsSync(filePath)) {
            addTest(description, false, 'File not found');
            return false;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        const hasScripts = parsed.scripts && typeof parsed.scripts === 'object';
        const hasDependencies = parsed.dependencies && typeof parsed.dependencies === 'object';
        
        addTest(description, hasScripts && hasDependencies, 'Valid package.json structure');
        return hasScripts && hasDependencies;
    } catch (error) {
        addTest(description, false, `Error: ${error.message}`);
        return false;
    }
}

function testComponentStructure(componentPath, componentName) {
    try {
        if (!fs.existsSync(componentPath)) {
            addTest(`${componentName} Component`, false, 'File not found');
            return false;
        }
        
        const content = fs.readFileSync(componentPath, 'utf8');
        const hasExport = content.includes('export default');
        const hasReact = content.includes('react');
        const hasJSX = content.includes('<') && content.includes('>');
        
        const passed = hasExport && hasReact && hasJSX;
        addTest(`${componentName} Component`, passed, 
            passed ? 'Valid React component structure' : 'Missing React component elements');
        return passed;
    } catch (error) {
        addTest(`${componentName} Component`, false, `Error: ${error.message}`);
        return false;
    }
}

function main() {
    console.log('🧪 Waykeeper Brand Hub - Simple Test Runner\n');
    
    // Test package.json
    testJSONStructure('./package.json', 'Package.json Structure');
    testFileContent('./package.json', 'next', 'Next.js Dependency');
    testFileContent('./package.json', 'react', 'React Dependency');
    testFileContent('./package.json', 'typescript', 'TypeScript Dependency');
    testFileContent('./package.json', 'tailwindcss', 'Tailwind CSS Dependency');
    
    // Test configuration files
    testFileExists('./next.config.js', 'Next.js Config');
    testFileExists('./tailwind.config.js', 'Tailwind Config');
    testFileExists('./tsconfig.json', 'TypeScript Config');
    testFileExists('./jest.config.js', 'Jest Config');
    testFileExists('./playwright.config.ts', 'Playwright Config');
    
    // Test app structure
    testFileExists('./app/layout.tsx', 'App Layout');
    testFileExists('./app/page.tsx', 'App Page');
    testFileExists('./app/globals.css', 'Global CSS');
    
    // Test components
    const components = [
        { path: './components/Header.tsx', name: 'Header' },
        { path: './components/ColorPalette.tsx', name: 'ColorPalette' },
        { path: './components/Typography.tsx', name: 'Typography' },
        { path: './components/LogoVariations.tsx', name: 'LogoVariations' },
        { path: './components/AssetLibrary.tsx', name: 'AssetLibrary' },
        { path: './components/VoiceTonePlayground.tsx', name: 'VoiceTonePlayground' },
        { path: './components/PhotographyGuide.tsx', name: 'PhotographyGuide' },
        { path: './components/SubBrandSelector.tsx', name: 'SubBrandSelector' },
        { path: './components/CopyPasteComponents.tsx', name: 'CopyPasteComponents' },
        { path: './components/BrandComplianceChecker.tsx', name: 'BrandComplianceChecker' }
    ];
    
    components.forEach(comp => {
        testComponentStructure(comp.path, comp.name);
    });
    
    // Test utility files
    testFileExists('./lib/utils.ts', 'Utils Library');
    testFileContent('./lib/utils.ts', 'copyToClipboard', 'Copy to Clipboard Function');
    testFileContent('./lib/utils.ts', 'showToast', 'Show Toast Function');
    
    // Test test files
    testFileExists('./__tests__/lib/utils.test.ts', 'Utils Tests');
    testFileExists('./__tests__/components/ColorPalette.test.tsx', 'ColorPalette Tests');
    testFileExists('./__tests__/components/Header.test.tsx', 'Header Tests');
    
    // Test E2E files
    testFileExists('./tests/e2e/homepage.spec.ts', 'Homepage E2E Tests');
    testFileExists('./tests/e2e/navigation.spec.ts', 'Navigation E2E Tests');
    testFileExists('./tests/e2e/color-palette.spec.ts', 'Color Palette E2E Tests');
    
    // Test documentation
    testFileExists('./README.md', 'README Documentation');
    testFileExists('./TESTING.md', 'Testing Documentation');
    testFileExists('./test-runner.html', 'Manual Test Runner');
    
    // Test brand content
    testFileContent('./components/ColorPalette.tsx', '#77BEF0', 'Skypath Blue Color');
    testFileContent('./components/ColorPalette.tsx', '#F9D88C', 'Morning Gold Color');
    testFileContent('./components/ColorPalette.tsx', '#4A7C59', 'Earth Green Color');
    testFileContent('./components/ColorPalette.tsx', '#E5E1DC', 'Mist Grey Color');
    
    testFileContent('./components/Header.tsx', 'WAYKEEPER', 'Brand Name in Header');
    testFileContent('./components/Header.tsx', 'Simply. Fairly. Connected.', 'Brand Tagline in Header');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Total: ${results.passed + results.failed}`);
    console.log(`🎯 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
    
    if (results.failed === 0) {
        console.log('\n🎉 All tests passed! The Waykeeper Brand Hub is ready.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }
    
    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
}

// Run the tests
main();
