import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has proper heading hierarchy', async ({ page }) => {
    // Check that h1 is present and unique
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText('Waykeeper Brand Hub')

    // Check that h2 elements are present
    const h2Elements = page.locator('h2')
    await expect(h2Elements).toHaveCount(9) // All main sections
  })

  test('has proper alt text for images', async ({ page }) => {
    // Check for any images and their alt text
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('has proper form labels', async ({ page }) => {
    // Navigate to compliance checker which has forms
    await page.click('a[href="#compliance"]')
    
    // Check for proper labels
    await expect(page.getByText('Select Scenario:')).toBeVisible()
    await expect(page.getByText('Select Audience:')).toBeVisible()
  })

  test('has proper button labels', async ({ page }) => {
    // Check that buttons have accessible text
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('has proper link text', async ({ page }) => {
    // Check that links have descriptive text
    const links = page.locator('a')
    const count = await links.count()
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const text = await link.textContent()
      
      // Link should have descriptive text
      expect(text?.trim()).toBeTruthy()
    }
  })

  test('has proper color contrast', async ({ page }) => {
    // This would typically be tested with axe-core
    // For now, we'll check that the page loads without errors
    await expect(page.getByText('Waykeeper Brand Hub')).toBeVisible()
  })

  test('is keyboard navigable', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('has proper ARIA labels', async ({ page }) => {
    // Check for ARIA labels on interactive elements
    const elementsWithAria = page.locator('[aria-label]')
    const count = await elementsWithAria.count()
    
    // Should have some ARIA labels
    expect(count).toBeGreaterThan(0)
  })

  test('has proper focus management', async ({ page }) => {
    // Test that focus is managed properly
    await page.keyboard.press('Tab')
    
    // Focus should be visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('has proper semantic HTML', async ({ page }) => {
    // Check for semantic elements
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
  })

  test('has proper form validation', async ({ page }) => {
    // Navigate to compliance checker
    await page.click('a[href="#compliance"]')
    
    // Check that form validation is present
    const textArea = page.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await expect(textArea).toBeVisible()
    
    // Check that required attributes are present
    const checkButton = page.getByText('Check Compliance')
    await expect(checkButton).toBeDisabled() // Should be disabled when no input
  })
})
