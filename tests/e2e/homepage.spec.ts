import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays hero section', async ({ page }) => {
    await expect(page.getByText('Waykeeper Brand Hub')).toBeVisible()
    await expect(page.getByText('Simply. Fairly. Connected.')).toBeVisible()
    await expect(page.getByText('Everything you need to maintain consistent brand identity across all touchpoints.')).toBeVisible()
  })

  test('shows call-to-action buttons', async ({ page }) => {
    await expect(page.getByText('Start Exploring')).toBeVisible()
    await expect(page.getByText('Check Compliance')).toBeVisible()
  })

  test('displays quick stats', async ({ page }) => {
    await expect(page.getByText('7')).toBeVisible() // Brand Colors
    await expect(page.getByText('50+')).toBeVisible() // Assets Available
    await expect(page.getByText('5')).toBeVisible() // Sub-Brands
    await expect(page.getByText('100%')).toBeVisible() // Brand Compliant
  })

  test('shows all main sections', async ({ page }) => {
    // Scroll through the page to check all sections are present
    await expect(page.getByText('Color Palette')).toBeVisible()
    await expect(page.getByText('Typography')).toBeVisible()
    await expect(page.getByText('Logo Variations')).toBeVisible()
    await expect(page.getByText('Voice & Tone Playground')).toBeVisible()
    await expect(page.getByText('Photography Guide')).toBeVisible()
    await expect(page.getByText('Sub-Brand Selector')).toBeVisible()
    await expect(page.getByText('Asset Library')).toBeVisible()
    await expect(page.getByText('Copy-Paste Components')).toBeVisible()
    await expect(page.getByText('Brand Compliance Checker')).toBeVisible()
  })

  test('displays footer', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    await expect(page.getByText('Waykeeper Brand Hub')).toBeVisible()
    await expect(page.getByText('Version 5.0 • December 2024')).toBeVisible()
    await expect(page.getByText('© 2024 Waykeeper. All rights reserved. Simply. Fairly. Connected.')).toBeVisible()
  })

  test('shows footer links', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    await expect(page.getByText('Quick Links')).toBeVisible()
    await expect(page.getByText('Brand Resources')).toBeVisible()
  })

  test('navigates to sections from hero buttons', async ({ page }) => {
    await page.click('text=Start Exploring')
    
    // Should scroll to colors section
    await expect(page.getByText('Color Palette')).toBeVisible()
  })

  test('navigates to compliance from hero button', async ({ page }) => {
    await page.click('text=Check Compliance')
    
    // Should scroll to compliance section
    await expect(page.getByText('Brand Compliance Checker')).toBeVisible()
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that content is still visible and properly laid out
    await expect(page.getByText('Waykeeper Brand Hub')).toBeVisible()
    await expect(page.getByText('Simply. Fairly. Connected.')).toBeVisible()
  })

  test('is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Check that content is still visible and properly laid out
    await expect(page.getByText('Waykeeper Brand Hub')).toBeVisible()
    await expect(page.getByText('Color Palette')).toBeVisible()
  })

  test('loads all sections without errors', async ({ page }) => {
    // Check for any console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // Navigate through all sections
    const sections = ['#colors', '#typography', '#logos', '#voice', '#photography', '#subbrands', '#assets', '#copy-paste', '#compliance']
    
    for (const section of sections) {
      await page.click(`a[href="${section}"]`)
      await page.waitForTimeout(500) // Wait for section to load
    }
    
    // Check that no errors occurred
    expect(errors).toHaveLength(0)
  })

  test('has proper meta tags', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle('Waykeeper Brand Hub')
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', 'Internal brand guidelines and assets for Waykeeper - Simply. Fairly. Connected.')
  })
})
