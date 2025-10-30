#!/usr/bin/env node

// Test script for the Brand Compliance Checker API
const fs = require('fs');
const FormData = require('form-data');

async function testAPI() {
  try {
    console.log('🧪 Testing Brand Compliance Checker API...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    // Add metadata
    const metadata = {
      width: 1,
      height: 1,
      dpi: 72,
      aspectRatio: 1,
      megapixels: 0.000001,
      colorSpace: 'sRGB'
    };
    formData.append('metadata', JSON.stringify(metadata));
    
    console.log('📤 Sending request to API...');
    
    // Make API call
    const response = await fetch('https://waykeeper-brand-oj65oo0q9-boxer32s-projects.vercel.app/api/check/design-image/', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ API Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPI();
