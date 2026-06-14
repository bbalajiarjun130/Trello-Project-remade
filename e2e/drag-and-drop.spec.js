import { test, expect } from '@playwright/test';

test.describe('Drag and Drop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid^="column-"]');
  });

  async function addTask(page, column, taskText) {
    await page.getByTestId(`add-task-${column}`).click();
    const input = page.getByTestId(`task-input-${column}`);
    await input.fill(taskText);
    await input.press('Enter');
    return page.locator(`[data-testid^="task-"]`).filter({ hasText: taskText });
  }

  async function dragAndDrop(page, sourceTask, targetColumn) {
    const targetDropZone = page.getByTestId(`column-${targetColumn}`);
    await sourceTask.dragTo(targetDropZone);
  }

  test('should allow valid move: To Do → In Progress', async ({ page }) => {
    const taskText = 'Task moving to In Progress';
    
    // Add task to To Do
    const taskCard = await addTask(page, 'todo', taskText);
    
    // Verify task is in To Do column
    const todoColumn = page.getByTestId('column-todo');
    await expect(todoColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).toBeVisible();
    
    // Drag task to In Progress
    await dragAndDrop(page, taskCard, 'inProgress');
    
    // Verify task moved to In Progress
    const inProgressColumn = page.getByTestId('column-inProgress');
    await expect(inProgressColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).toBeVisible();
    
    // Verify task is no longer in To Do
    await expect(todoColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).not.toBeVisible();
  });

  test('should allow valid move: In Progress → In Review', async ({ page }) => {
    const taskText = 'Task moving to Review';
    
    // Add task to In Progress
    const taskCard = await addTask(page, 'inProgress', taskText);
    
    // Drag task to In Review
    await dragAndDrop(page, taskCard, 'inReview');
    
    // Verify task moved to In Review
    const inReviewColumn = page.getByTestId('column-inReview');
    await expect(inReviewColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).toBeVisible();
    
    // Verify task is no longer in In Progress
    const inProgressColumn = page.getByTestId('column-inProgress');
    await expect(inProgressColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).not.toBeVisible();
  });

  test('should allow valid move: In Progress → Complete', async ({ page }) => {
    const taskText = 'Task completing directly';
    
    // Add task to In Progress
    const taskCard = await addTask(page, 'inProgress', taskText);
    
    // Drag task to Complete
    await dragAndDrop(page, taskCard, 'complete');
    
    // Verify task moved to Complete
    const completeColumn = page.getByTestId('column-complete');
    await expect(completeColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).toBeVisible();
    
    // Verify task is no longer in In Progress
    const inProgressColumn = page.getByTestId('column-inProgress');
    await expect(inProgressColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).not.toBeVisible();
  });

  test('should allow valid move: In Review → Complete', async ({ page }) => {
    const taskText = 'Task finishing review';
    
    // Add task to In Review
    const taskCard = await addTask(page, 'inReview', taskText);
    
    // Drag task to Complete
    await dragAndDrop(page, taskCard, 'complete');
    
    // Verify task moved to Complete
    const completeColumn = page.getByTestId('column-complete');
    await expect(completeColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).toBeVisible();
    
    // Verify task is no longer in In Review
    const inReviewColumn = page.getByTestId('column-inReview');
    await expect(inReviewColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).not.toBeVisible();
  });

  test('should show restriction message for invalid move: To Do → Complete', async ({ page }) => {
    const taskText = 'Task trying invalid move';
    
    // Add task to To Do
    const taskCard = await addTask(page, 'todo', taskText);
    
    // Try to drag task directly to Complete (invalid move)
    await dragAndDrop(page, taskCard, 'complete');
    
    // Verify restriction message appears
    const restrictionMessage = page.locator('.restrictionToast, [data-testid="restriction-message"]');
    await expect(restrictionMessage).toBeVisible();
    
    // Verify task remains in To Do
    const todoColumn = page.getByTestId('column-todo');
    await expect(todoColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).toBeVisible();
    
    // Verify task is not in Complete
    const completeColumn = page.getByTestId('column-complete');
    await expect(completeColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).not.toBeVisible();
  });

  test('should prevent move from Complete column', async ({ page }) => {
    const taskText = 'Completed task';
    
    // Add task to Complete
    const taskCard = await addTask(page, 'complete', taskText);
    
    // Try to drag task from Complete to To Do (invalid move)
    await dragAndDrop(page, taskCard, 'todo');
    
    // Verify task remains in Complete
    const completeColumn = page.getByTestId('column-complete');
    await expect(completeColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).toBeVisible();
    
    // Verify task is not in To Do
    const todoColumn = page.getByTestId('column-todo');
    await expect(todoColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).not.toBeVisible();
  });

  test('should allow same column drops (no-op)', async ({ page }) => {
    const taskText = 'Task staying in place';
    
    // Add task to To Do
    const taskCard = await addTask(page, 'todo', taskText);
    
    // Drag task within same column
    await dragAndDrop(page, taskCard, 'todo');
    
    // Verify task remains in To Do (no error should occur)
    const todoColumn = page.getByTestId('column-todo');
    await expect(todoColumn.locator(`[data-testid^="task-"]`).filter({ hasText: taskText })).toBeVisible();
  });

  test('should handle multiple tasks drag and drop', async ({ page }) => {
    // Add multiple tasks
    const task1 = await addTask(page, 'todo', 'First task');
    const task2 = await addTask(page, 'todo', 'Second task');
    
    // Move both tasks through workflow
    await dragAndDrop(page, task1, 'inProgress');
    await dragAndDrop(page, task2, 'inProgress');
    
    // Verify both tasks are in In Progress
    const inProgressColumn = page.getByTestId('column-inProgress');
    await expect(inProgressColumn.locator(`[data-testid^="task-"]`)).toHaveCount(2);
    await expect(inProgressColumn.locator(`[data-testid^="task-"]`).filter({ hasText: 'First task' })).toBeVisible();
    await expect(inProgressColumn.locator(`[data-testid^="task-"]`).filter({ hasText: 'Second task' })).toBeVisible();
    
    // Move first task to Complete
    const task1InProgress = inProgressColumn.locator(`[data-testid^="task-"]`).filter({ hasText: 'First task' });
    await dragAndDrop(page, task1InProgress, 'complete');
    
    // Verify task distribution
    await expect(inProgressColumn.locator(`[data-testid^="task-"]`)).toHaveCount(1);
    await expect(page.getByTestId('column-complete').locator(`[data-testid^="task-"]`)).toHaveCount(1);
  });
});