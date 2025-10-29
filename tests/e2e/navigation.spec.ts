import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays header with logo and navigation', async ({ page }) => {
    await expect(page.getByText('WAYKEEPER')).toBeVisible()
    await expect(page.getByText('Simply. Fairly. Connected.')).toBeVisible()
  })

  test('shows navigation links', async ({ page }) => {
    await expect(page.getByText('Colors')).toBeVisible()
    await expect(page.getByText('Typography')).toBeVisible()
    await expect(page.getByText('Logos')).toBeVisible()
    await expect(page.getByText('Voice & Tone')).toBeVisible()
    await expect(page.getByText('Photography')).toBeVisible()
    await expect(page.getByText('Assets')).toBeVisible()
    await expect(page.getByText('Compliance')).toBeVisible()
  })

  test('navigates to color palette section', async ({ page }) => {
    await page.click('a[href="#colors"]')
    await expect(page.getByText('Color Palette')).toBeVisible()
  })

  test('navigates to typography section', async ({ page }) => {
    await page.click('a[href="#typography"]')
    await expect(page.getByText('Typography')).toBeVisible()
  })

  test('navigates to logos section', async ({ page }) => {
    await page.click('a[href="#logos"]')
    await expect(page.getByText('Logo Variations')).toBeVisible()
  })

  test('navigates to voice & tone section', async ({ page }) => {
    await page.click('a[href="#voice"]')
    await expect(page.getByText('Voice & Tone Playground')).toBeVisible()
  })

  test('navigates to photography section', async ({ page }) => {
    await page.click('a[href="#photography"]')
    await expect(page.getByText('Photography Guide')).toBeVisible()
  })

  test('navigates to assets section', async ({ page }) => {
    await page.click('a[href="#assets"]')
    await expect(page.getByText('Asset Library')).toBeVisible()
  })

  test('navigates to compliance section', async ({ page }) => {
    await page.click('a[href="#compliance"]')
    await expect(page.getByText('Brand Compliance Checker')).toBeVisible()
  })

  test('shows mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const menuButton = page.locator('button[aria-label*="menu"], button:has(svg)').first()
    await expect(menuButton).toBeVisible()
    
    await menuButton.click()
    
    // Check that navigation links are visible in mobile menu
    await expect(page.getByText('Colors')).toBeVisible()
  })

  test('scrolls to sections smoothly', async ({ page }) => {
    // Test smooth scrolling behavior
    await page.click('a[href="#colors"]')
    
    // Wait for scroll to complete
    await page.waitForTimeout(500)
    
    // Check if we're in the colors section
    const colorsSection = page.locator('#colors')
    await expect(colorsSection).toBeInViewport()
  })
})
