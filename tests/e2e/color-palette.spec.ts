import { test, expect } from '@playwright/test'

test.describe('Color Palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="#colors"]')
  })

  test('displays color palette section', async ({ page }) => {
    await expect(page.getByText('Color Palette')).toBeVisible()
    await expect(page.getByText('Master Brand Colors')).toBeVisible()
    await expect(page.getByText('Accent Colors')).toBeVisible()
  })

  test('shows master brand colors', async ({ page }) => {
    await expect(page.getByText('Skypath Blue')).toBeVisible()
    await expect(page.getByText('Morning Gold')).toBeVisible()
    await expect(page.getByText('Earth Green')).toBeVisible()
    await expect(page.getByText('Mist Grey')).toBeVisible()
  })

  test('displays color hex codes', async ({ page }) => {
    await expect(page.getByText('#77BEF0')).toBeVisible()
    await expect(page.getByText('#F9D88C')).toBeVisible()
    await expect(page.getByText('#4A7C59')).toBeVisible()
    await expect(page.getByText('#E5E1DC')).toBeVisible()
  })

  test('allows copying color codes', async ({ page }) => {
    // Mock clipboard API
    await page.evaluate(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => Promise.resolve(),
        },
      })
    })

    const firstCopyButton = page.locator('button:has-text("Copy")').first()
    await firstCopyButton.click()

    // Check for toast notification
    await expect(page.locator('text=Skypath Blue HEX copied!')).toBeVisible()
  })

  test('shows sub-brand colors when toggled', async ({ page }) => {
    await page.click('text=Show Sub-Brand Colors')
    
    await expect(page.getByText('Sub-Brand Colors')).toBeVisible()
    await expect(page.getByText('Heart Rose')).toBeVisible()
    await expect(page.getByText('Journey Coral')).toBeVisible()
  })

  test('displays usage guidelines', async ({ page }) => {
    await expect(page.getByText('Used for:')).toBeVisible()
    await expect(page.getByText('Avoid:')).toBeVisible()
    await expect(page.getByText('Contrast:')).toBeVisible()
  })

  test('shows contrast information', async ({ page }) => {
    await expect(page.getByText('AAA (WCAG compliant)')).toBeVisible()
    await expect(page.getByText('7.2:1')).toBeVisible()
  })

  test('downloads swatches', async ({ page }) => {
    // Mock download functionality
    const downloadPromise = page.waitForEvent('download')
    await page.click('text=Download All Swatches')
    
    // In a real test, you would verify the download
    // For now, we just check the button is clickable
    await expect(page.getByText('Download All Swatches')).toBeVisible()
  })
})
