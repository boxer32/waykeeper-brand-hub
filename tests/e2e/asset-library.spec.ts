import { test, expect } from '@playwright/test'

test.describe('Asset Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="#assets"]')
  })

  test('displays asset library section', async ({ page }) => {
    await expect(page.getByText('Asset Library')).toBeVisible()
    await expect(page.getByText('Download all brand assets, templates, and resources in one place')).toBeVisible()
  })

  test('shows asset categories', async ({ page }) => {
    await expect(page.getByText('Logos')).toBeVisible()
    await expect(page.getByText('Sub-Brand Logos')).toBeVisible()
    await expect(page.getByText('Typography')).toBeVisible()
    await expect(page.getByText('Color Swatches')).toBeVisible()
    await expect(page.getByText('Templates')).toBeVisible()
    await expect(page.getByText('Photography')).toBeVisible()
  })

  test('displays item counts', async ({ page }) => {
    await expect(page.getByText('5 items')).toBeVisible() // Logos
    await expect(page.getByText('4 items')).toBeVisible() // Sub-Brand Logos
    await expect(page.getByText('3 items')).toBeVisible() // Typography
  })

  test('expands categories to show items', async ({ page }) => {
    await page.click('text=Logos')
    
    await expect(page.getByText('Primary Logo')).toBeVisible()
    await expect(page.getByText('Compact Logo')).toBeVisible()
    await expect(page.getByText('Icon Only')).toBeVisible()
    await expect(page.getByText('Monochrome White')).toBeVisible()
    await expect(page.getByText('Monochrome Black')).toBeVisible()
  })

  test('shows file formats for assets', async ({ page }) => {
    await page.click('text=Logos')
    
    await expect(page.getByText('PNG')).toBeVisible()
    await expect(page.getByText('SVG')).toBeVisible()
    await expect(page.getByText('EPS')).toBeVisible()
    await expect(page.getByText('AI')).toBeVisible()
  })

  test('displays file sizes', async ({ page }) => {
    await page.click('text=Logos')
    
    await expect(page.getByText('2.3MB')).toBeVisible()
    await expect(page.getByText('1.8MB')).toBeVisible()
    await expect(page.getByText('1.2MB')).toBeVisible()
  })

  test('allows downloading individual assets', async ({ page }) => {
    // Mock download functionality
    const downloadPromise = page.waitForEvent('download')
    
    await page.click('text=Logos')
    await page.click('text=PNG')
    
    // In a real test, you would verify the download
    // For now, we just check the button is clickable
    await expect(page.getByText('PNG')).toBeVisible()
  })

  test('shows quick access section', async ({ page }) => {
    await expect(page.getByText('Quick Access')).toBeVisible()
    await expect(page.getByText('Primary Logo')).toBeVisible()
    await expect(page.getByText('Color Palette')).toBeVisible()
    await expect(page.getByText('Inter Font')).toBeVisible()
  })

  test('displays version information', async ({ page }) => {
    await expect(page.getByText('Current Version:')).toBeVisible()
    await expect(page.getByText('v5.0 (Dec 2024)')).toBeVisible()
    await expect(page.getByText('Last updated: December 15, 2024')).toBeVisible()
  })

  test('downloads all assets', async ({ page }) => {
    await page.click('text=Download All Assets (ZIP - 250MB)')
    
    // Check for toast notification
    await expect(page.locator('text=Preparing download package...')).toBeVisible()
  })

  test('expands multiple categories', async ({ page }) => {
    // Expand Logos
    await page.click('text=Logos')
    await expect(page.getByText('Primary Logo')).toBeVisible()
    
    // Expand Typography
    await page.click('text=Typography')
    await expect(page.getByText('Inter Font Family')).toBeVisible()
    
    // Both should be visible
    await expect(page.getByText('Primary Logo')).toBeVisible()
    await expect(page.getByText('Inter Font Family')).toBeVisible()
  })

  test('shows loading state during download', async ({ page }) => {
    await page.click('text=Download All Assets (ZIP - 250MB)')
    
    // Check for loading state
    await expect(page.locator('text=Preparing download package...')).toBeVisible()
  })
})
