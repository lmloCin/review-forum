import { test, expect } from '@playwright/test';

test('creating a forum', async ({ page }) => {
  
  const forumTitle = `Teste Forum ${crypto.randomUUID()}`;

  await page.goto('http://localhost:3000/forum');

  await page.locator('.add-forum-btn').click();

  await page.getByPlaceholder('Digite o título do fórum').fill(forumTitle);
  await page.getByPlaceholder('Digite a descrição do fórum').fill('Teste');
  
  await page.selectOption('select[name="movieId"]', { index: 1 });
  
  await page.getByRole('button', { name: 'Criar Fórum' }).click();

  await expect(page.locator('a.forum-title-link').filter({ hasText: forumTitle })).toBeVisible();
});

test('Fail to create a forum without a title', async ({ page }) => {
  await page.goto('http://localhost:3000/forum');

  const dialogPromise = page.waitForEvent('dialog');
  
  await page.locator('.add-forum-btn').click();
  await page.getByPlaceholder('Digite a descrição do fórum').fill('Teste');
  await page.selectOption('select[name="movieId"]', { index: 1 });
  await page.getByRole('button', { name: 'Criar Fórum' }).click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toBe('O título do forum é obrigatório');
  await dialog.accept();
});


test('Fail to create a forum without a movie', async ({ page }) => {
  await page.goto('http://localhost:3000/forum');

  const dialogPromise = page.waitForEvent('dialog');
    
  await page.locator('.add-forum-btn').click();
  await page.getByPlaceholder('Digite o título do fórum').fill('Teste');
  await page.getByPlaceholder('Digite a descrição do fórum').fill('Teste');
  await page.getByRole('button', { name: 'Criar Fórum' }).click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toBe('O filme é um campo obrigatório');
  await dialog.accept();
});


test('creating a comment without content', async ({ page }) => {
  await page.goto('http://localhost:3000/forum');

  await page.locator('.forum-title-link').first().click();
  
  const dialogPromise = page.waitForEvent('dialog');

  await expect(page).toHaveURL(/\/forum\/\d+/);
  
  await page.getByRole('button', { name: 'Enviar' }).click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toBe('O conteúdo é um campo obrigatório');
  await dialog.accept();
});


test('creating a comment with content', async ({ page }) => {
  await page.goto('http://localhost:3000/forum');

  await page.locator('.forum-title-link').first().click();
  
  await page.getByPlaceholder('Digite seu comentário...').fill('Criando um comentário');
  await page.getByRole('button', { name: 'Enviar' }).click();

  await expect(page.locator('.content').filter({ hasText: 'Criando um comentário' })).toBeVisible();  
  await expect(page.getByPlaceholder('Digite seu comentário...')).toHaveValue('');
});


test('edit comment', async ({ page }) => {
  await page.goto('http://localhost:3000/forum');

  await page.locator('.forum-title-link').first().click();

  await expect(page.locator('.content').filter({ hasText: 'Criando um comentário' })).toBeVisible();
  
  await page.locator('.edit-comment-btn').first().click();
  
  await page.locator('.comment-edit-input').fill('Comentário editado');
  
  await page.locator('.save-comment-btn').click();
  
  await expect(page.locator('.content').filter({ hasText: 'Comentário editado' })).toBeVisible();
});