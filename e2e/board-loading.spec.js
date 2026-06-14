import { test, expect } from '@playwright/test';

test.describe('Board Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load page with correct title and header', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/trello-project-remade/i);
    
    // Check main header
    await expect(page.getByRole('heading', { name: 'Project Board' })).toBeVisible();
    await expect(page.getByText('Organize your tasks with drag & drop simplicity')).toBeVisible();
  });

  test('should display all four columns', async ({ page }) => {
    // Wait for columns to load
    await page.waitForSelector('[data-testid^="column-"]');
    
    // Check all columns are present with correct titles
    await expect(page.getByTestId('column-todo')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'To Do' })).toBeVisible();
    
    await expect(page.getByTestId('column-inProgress')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In Progress' })).toBeVisible();
    
    await expect(page.getByTestId('column-inReview')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In Review' })).toBeVisible();
    
    await expect(page.getByTestId('column-complete')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Complete' })).toBeVisible();
  });

  test('should have add task buttons in each column', async ({ page }) => {
    // Wait for columns to load
    await page.waitForSelector('[data-testid^="column-"]');
    
    // Check that each column has an "Add Task" button
    const columns = ['todo', 'inProgress', 'inReview', 'complete'];
    
    for (const columnKey of columns) {
      const addButton = page.getByTestId(`add-task-${columnKey}`);
      await expect(addButton).toBeVisible();
    }
  });

  test('should start with empty columns', async ({ page }) => {
    // Wait for columns to load
    await page.waitForSelector('[data-testid^="column-"]');
    
    // Check that no tasks are present initially
    const taskCards = page.locator('[data-testid^="task-"]');
    await expect(taskCards).toHaveCount(0);
  });
});