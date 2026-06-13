import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid^="column-"]');
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // All columns should be visible horizontally
    const columns = page.locator('[data-testid^="column-"]');
    await expect(columns).toHaveCount(4);
    
    // Check that columns are arranged horizontally (not stacked)
    const firstColumn = page.getByTestId('column-todo');
    const lastColumn = page.getByTestId('column-complete');
    
    const firstColumnBox = await firstColumn.boundingBox();
    const lastColumnBox = await lastColumn.boundingBox();
    
    // Last column should be to the right of first column
    expect(lastColumnBox.x).toBeGreaterThan(firstColumnBox.x);
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // All columns should still be visible
    const columns = page.locator('[data-testid^="column-"]');
    await expect(columns).toHaveCount(4);
    
    // Header should still be visible
    await expect(page.getByRole('heading', { name: 'Project Board' })).toBeVisible();
  });

  test('should display correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // All columns should still be present
    const columns = page.locator('[data-testid^="column-"]');
    await expect(columns).toHaveCount(4);
    
    // Header should be responsive
    await expect(page.getByRole('heading', { name: 'Project Board' })).toBeVisible();
    
    // Columns might be stacked or scrollable
    // This test ensures the layout doesn't break on mobile
    for (const columnKey of ['todo', 'inProgress', 'inReview', 'complete']) {
      await expect(page.getByTestId(`column-${columnKey}`)).toBeVisible();
    }
  });

  test('should handle very narrow viewport', async ({ page }) => {
    // Set very narrow viewport
    await page.setViewportSize({ width: 320, height: 568 });
    
    // App should not break
    await expect(page.getByRole('heading', { name: 'Project Board' })).toBeVisible();
    
    // All columns should be accessible (might require scrolling)
    const columns = page.locator('[data-testid^="column-"]');
    await expect(columns).toHaveCount(4);
  });

  test('should handle window resize gracefully', async ({ page }) => {
    // Start with desktop size
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Add some tasks
    await page.getByTestId('add-task-todo').click();
    const input = page.getByTestId('task-input-todo');
    await input.fill('Resize test task');
    await input.press('Enter');
    
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Task should still be visible
    const taskCard = page.locator(`[data-testid^="task-"]`).filter({ hasText: 'Resize test task' });
    await expect(taskCard).toBeVisible();
    
    // Resize back to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Task should still be visible and functional
    await expect(taskCard).toBeVisible();
    
    // Should be able to add another task
    await page.getByTestId('add-task-inProgress').click();
    const input2 = page.getByTestId('task-input-inProgress');
    await input2.fill('After resize task');
    await input2.press('Enter');
    
    const taskCard2 = page.locator(`[data-testid^="task-"]`).filter({ hasText: 'After resize task' });
    await expect(taskCard2).toBeVisible();
  });
});