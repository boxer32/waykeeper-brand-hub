import { test, expect } from '@playwright/test'

test.describe('Voice & Tone Playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="#voice"]')
  })

  test('displays voice and tone playground', async ({ page }) => {
    await expect(page.getByText('Voice & Tone Playground')).toBeVisible()
    await expect(page.getByText('Select Scenario:')).toBeVisible()
    await expect(page.getByText('Select Audience:')).toBeVisible()
  })

  test('shows scenario dropdown', async ({ page }) => {
    const scenarioSelect = page.locator('select').first()
    await expect(scenarioSelect).toBeVisible()
    await expect(scenarioSelect).toHaveValue('Booking Confirmation')
  })

  test('shows audience buttons', async ({ page }) => {
    await expect(page.getByText('Backpacker')).toBeVisible()
    await expect(page.getByText('Family')).toBeVisible()
    await expect(page.getByText('Nomad')).toBeVisible()
    await expect(page.getByText('Wellness Seeker')).toBeVisible()
  })

  test('allows changing scenario', async ({ page }) => {
    const scenarioSelect = page.locator('select').first()
    await scenarioSelect.selectOption('Social Media Post')
    await expect(scenarioSelect).toHaveValue('Social Media Post')
  })

  test('allows changing audience', async ({ page }) => {
    await page.click('text=Family')
    
    const familyButton = page.getByText('Family')
    await expect(familyButton).toHaveClass(/bg-skypath-blue/)
  })

  test('displays good and bad examples', async ({ page }) => {
    await expect(page.getByText('Good Example')).toBeVisible()
    await expect(page.getByText('Bad Example')).toBeVisible()
  })

  test('shows example content', async ({ page }) => {
    // Check that example content is displayed
    await expect(page.locator('text=Your Pai adventure is confirmed!')).toBeVisible()
    await expect(page.locator('text=Dear valued customer')).toBeVisible()
  })

  test('allows copying examples', async ({ page }) => {
    // Mock clipboard API
    await page.evaluate(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => Promise.resolve(),
        },
      })
    })

    const copyButtons = page.locator('button:has-text("Copy")')
    await copyButtons.first().click()

    // Check for toast notification
    await expect(page.locator('text=copied!')).toBeVisible()
  })

  test('generates random example', async ({ page }) => {
    await page.click('text=Generate Random Example')
    
    // Check for toast notification
    await expect(page.locator('text=New example generated!')).toBeVisible()
  })

  test('shows voice principles', async ({ page }) => {
    await expect(page.getByText('Voice Principles')).toBeVisible()
    await expect(page.getByText('Core Traits')).toBeVisible()
    await expect(page.getByText('Tone Guidelines')).toBeVisible()
  })

  test('displays core traits', async ({ page }) => {
    await expect(page.getByText('Authentic:')).toBeVisible()
    await expect(page.getByText('Friendly:')).toBeVisible()
    await expect(page.getByText('Local:')).toBeVisible()
    await expect(page.getByText('Genuine:')).toBeVisible()
  })

  test('shows tone guidelines', async ({ page }) => {
    await expect(page.getByText('Calm & Clear:')).toBeVisible()
    await expect(page.getByText('Natural Language:')).toBeVisible()
    await expect(page.getByText('Avoid:')).toBeVisible()
    await expect(page.getByText('Focus:')).toBeVisible()
  })

  test('downloads voice guide', async ({ page }) => {
    await page.click('text=Download Complete Voice Guide')
    
    // In a real test, you would verify the download
    // For now, we just check the button is clickable
    await expect(page.getByText('Download Complete Voice Guide')).toBeVisible()
  })
})
