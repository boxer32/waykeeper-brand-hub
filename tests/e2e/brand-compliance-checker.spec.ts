import { test, expect } from '@playwright/test'

test.describe('Brand Compliance Checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="#compliance"]')
  })

  test('displays compliance checker section', async ({ page }) => {
    await expect(page.getByText('Brand Compliance Checker')).toBeVisible()
    await expect(page.getByText('Upload your design or paste text to check brand compliance automatically')).toBeVisible()
  })

  test('shows file upload area', async ({ page }) => {
    await expect(page.getByText('Upload Design')).toBeVisible()
    await expect(page.getByText('Drag & drop your design here or click to browse')).toBeVisible()
    await expect(page.getByText('Supports PNG, JPG, PDF, AI, PSD files')).toBeVisible()
  })

  test('shows text input area', async ({ page }) => {
    await expect(page.getByText('Or Paste Text')).toBeVisible()
    await expect(page.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')).toBeVisible()
  })

  test('displays check compliance button', async ({ page }) => {
    await expect(page.getByText('Check Compliance')).toBeVisible()
  })

  test('disables check button when no input provided', async ({ page }) => {
    const checkButton = page.getByText('Check Compliance')
    await expect(checkButton).toBeDisabled()
  })

  test('enables check button when text is provided', async ({ page }) => {
    const textArea = page.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await textArea.fill('Test text for compliance checking')
    
    const checkButton = page.getByText('Check Compliance')
    await expect(checkButton).toBeEnabled()
  })

  test('handles file upload', async ({ page }) => {
    // Create a test file
    const filePath = 'test-file.png'
    
    // Mock file upload
    await page.setInputFiles('input[type="file"]', filePath)
    
    // Check that file is displayed
    await expect(page.locator('text=test-file.png')).toBeVisible()
  })

  test('runs compliance check with text input', async ({ page }) => {
    const textArea = page.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await textArea.fill('Test text for compliance checking')
    
    await page.click('text=Check Compliance')
    
    // Check for loading state
    await expect(page.getByText('Checking Compliance...')).toBeVisible()
    
    // Wait for results (simulated delay)
    await page.waitForTimeout(3000)
    
    // Check for results
    await expect(page.getByText('Compliance Summary')).toBeVisible()
  })

  test('displays compliance guidelines', async ({ page }) => {
    await expect(page.getByText('What We Check')).toBeVisible()
    await expect(page.getByText('Logo Usage')).toBeVisible()
    await expect(page.getByText('Colors')).toBeVisible()
    await expect(page.getByText('Typography')).toBeVisible()
    await expect(page.getByText('Voice & Tone')).toBeVisible()
    await expect(page.getByText('Accessibility')).toBeVisible()
    await expect(page.getByText('File Quality')).toBeVisible()
  })

  test('shows empty state initially', async ({ page }) => {
    await expect(page.getByText('Ready to Check')).toBeVisible()
    await expect(page.getByText('Upload a design or paste text to start the compliance check')).toBeVisible()
  })

  test('displays compliance results after check', async ({ page }) => {
    const textArea = page.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await textArea.fill('Test text for compliance checking')
    
    await page.click('text=Check Compliance')
    
    // Wait for results
    await page.waitForTimeout(3000)
    
    // Check for summary
    await expect(page.getByText('Compliance Summary')).toBeVisible()
    await expect(page.getByText('Passed')).toBeVisible()
    await expect(page.getByText('Warnings')).toBeVisible()
    await expect(page.getByText('Failed')).toBeVisible()
  })

  test('shows detailed results', async ({ page }) => {
    const textArea = page.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await textArea.fill('Test text for compliance checking')
    
    await page.click('text=Check Compliance')
    
    // Wait for results
    await page.waitForTimeout(3000)
    
    // Check for detailed results
    await expect(page.getByText('Detailed Results')).toBeVisible()
    await expect(page.getByText('Logo Usage')).toBeVisible()
    await expect(page.getByText('Colors')).toBeVisible()
    await expect(page.getByText('Typography')).toBeVisible()
  })

  test('allows downloading report', async ({ page }) => {
    const textArea = page.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await textArea.fill('Test text for compliance checking')
    
    await page.click('text=Check Compliance')
    
    // Wait for results
    await page.waitForTimeout(3000)
    
    // Check for download button
    await expect(page.getByText('Download Report')).toBeVisible()
  })

  test('allows requesting review', async ({ page }) => {
    const textArea = page.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await textArea.fill('Test text for compliance checking')
    
    await page.click('text=Check Compliance')
    
    // Wait for results
    await page.waitForTimeout(3000)
    
    // Check for request review button
    await expect(page.getByText('Request Review')).toBeVisible()
  })
})
