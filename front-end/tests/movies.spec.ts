import { test, expect } from '@playwright/test';

// --- Teste para o Cenário: Successfully register a new movie ---
test('Successfully register a new movie', async ({ page }) => {
  const newMovieTitle = `Filme de Teste ${crypto.randomUUID()}`;

  page.on('dialog', dialog => dialog.accept());

  // 1. Navegar e fazer login
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();

  // 2. Ir para a página de adicionar filme
  await page.getByRole('link', { name: '+ Adicionar Filme' }).click();
  
  // 3. Preencher o formulário
  await page.getByLabel('Título*').fill(newMovieTitle);
  await page.getByLabel('Ano de Lançamento*').fill('2025');
  await page.getByLabel('Diretor(es)*').fill('Diretor de Teste');
  await page.getByLabel('Tags (separadas por vírgula)*').fill('teste, playwright, e2e');
  await page.getByLabel('Sinopse').fill('Esta é uma descrição de teste para o filme.');
  await page.getByLabel('Banner (URL)').fill('https://placehold.co/400x600/1f2937/ffffff?text=Teste');
  
  // 4. Submeter o formulário e esperar pela navegação
  await Promise.all([
    page.waitForURL('http://localhost:3000/'),
    page.getByRole('button', { name: 'Adicionar Filme' }).click(),
  ]);

  // 5. Verificar se o filme aparece na página principal
  await expect(page.getByRole('link', { name: newMovieTitle })).toBeVisible();

  // 6. Limpeza
  await page.getByRole('link', { name: newMovieTitle }).click();
  await page.getByRole('button', { name: 'Delete Movie' }).click();
});


// --- Teste para o Cenário: Edit the tags of an existing movie ---
test('Edit the tags of an existing movie', async ({ page }) => {
  const movieToEditTitle = `Filme para Editar ${crypto.randomUUID()}`;
  
  page.on('dialog', dialog => dialog.accept());

  // Passo de Setup: Criar o filme
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '+ Adicionar Filme' }).click();
  
  await page.getByLabel('Título*').fill(movieToEditTitle);
  await page.getByLabel('Ano de Lançamento*').fill('2024');
  await page.getByLabel('Diretor(es)*').fill('Diretor Original');
  await page.getByLabel('Tags (separadas por vírgula)*').fill('original, tag');
  
  await Promise.all([
    page.waitForURL('http://localhost:3000/'),
    page.getByRole('button', { name: 'Adicionar Filme' }).click(),
  ]);

  // 1. Navegar para a página de detalhes
  await page.getByRole('link', { name: movieToEditTitle }).click();
  
  // 2. Clicar no botão para editar
  await page.getByRole('link', { name: 'Edit Movie' }).click();

  // 3. Alterar o campo de tags
  const tagsInput = page.getByLabel('Tags (separadas por vírgula)*');
  await tagsInput.fill('tag, editada, sucesso');
  
  // 4. Submeter as alterações e esperar pela navegação de volta
  await Promise.all([
      page.waitForURL(/\/movie\/\d+/), // Espera por uma URL como /movie/123
      page.getByRole('button', { name: 'Editar Filme' }).click(),
  ]);

  // 5. Verificar se as tags foram atualizadas
  // CORREÇÃO: Usamos um seletor mais específico para encontrar as tags
  await expect(page.locator('div[class*="tagsContainer"] >> text=editada')).toBeVisible();
  await expect(page.locator('div[class*="tagsContainer"] >> text=sucesso')).toBeVisible();

  // 6. Limpeza
  await page.getByRole('button', { name: 'Delete Movie' }).click();
});


// --- Teste para o Cenário: Delete a movie from the catalog ---
test('Delete a movie from the catalog', async ({ page }) => {
  const movieToDeleteTitle = `Filme para Apagar ${crypto.randomUUID()}`;

  page.on('dialog', dialog => dialog.accept());

  // Passo de Setup: Criar o filme
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '+ Adicionar Filme' }).click();

  await page.getByLabel('Título*').fill(movieToDeleteTitle);
  await page.getByLabel('Ano de Lançamento*').fill('2023');
  await page.getByLabel('Diretor(es)*').fill('Diretor a ser Apagado');
  await page.getByLabel('Tags (separadas por vírgula)*').fill('delete, test');

  await Promise.all([
    page.waitForURL('http://localhost:3000/'),
    page.getByRole('button', { name: 'Adicionar Filme' }).click(),
  ]);

  // 1. Navegar para a página de detalhes
  await page.getByRole('link', { name: movieToDeleteTitle }).click();

  // 2. Clicar no botão para apagar e esperar pela navegação
  await Promise.all([
      page.waitForURL('http://localhost:3000/'),
      page.getByRole('button', { name: 'Delete Movie' }).click(),
  ]);

  // 3. Verificar se o filme já não existe
  await expect(page.getByRole('link', { name: movieToDeleteTitle })).not.toBeVisible();
});


// --- Teste para o Cenário: Add a new review to a movie ---
test('Add a new review to a movie', async ({ page }) => {
    const movieTitle = `Filme para Review ${crypto.randomUUID()}`;
    const reviewText = "Este é um comentário de teste excelente!";

    page.on('dialog', dialog => dialog.accept());

    // Passo de Setup: Criar o filme
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: '+ Adicionar Filme' }).click();
    await page.getByLabel('Título*').fill(movieTitle);
    await page.getByLabel('Ano de Lançamento*').fill('2022');
    await page.getByLabel('Diretor(es)*').fill('Diretor de Review');
    await page.getByLabel('Tags (separadas por vírgula)*').fill('review, test');
    await Promise.all([
        page.waitForURL('http://localhost:3000/'),
        page.getByRole('button', { name: 'Adicionar Filme' }).click(),
    ]);

    // 1. Navegar para a página de detalhes
    await page.getByRole('link', { name: movieTitle }).click();

    // 2. Clicar para adicionar uma review
    await page.getByRole('link', { name: '+ Add Review' }).click();

    // 3. Preencher o formulário da review
    await page.locator('span:has-text("★")').nth(4).click();
    await page.getByPlaceholder('Fotografia belíssima e uma história tocante!').fill(reviewText);

    // 4. Submeter a review e esperar pela navegação de volta
    await Promise.all([
        page.waitForURL(/\/movie\/\d+/),
        page.getByRole('button', { name: 'Enviar Review' }).click(),
    ]);

    // 5. Verificar se a review aparece na página
    await expect(page.locator('p', { hasText: reviewText })).toBeVisible();

    // 6. Limpeza
    await page.getByRole('button', { name: 'Delete Movie' }).click();
});


// --- Teste para o Cenário: Verify movie details after creation ---
test('Verify movie details after creation', async ({ page }) => {
    const movieTitle = `Filme para Detalhes ${crypto.randomUUID()}`;
    const movieYear = '2021';
    const movieDirector = 'Diretor Detalhado';
    const movieTags = 'detalhes, teste';

    page.on('dialog', dialog => dialog.accept());

    // Passo de Setup: Criar o filme
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: '+ Adicionar Filme' }).click();
    await page.getByLabel('Título*').fill(movieTitle);
    await page.getByLabel('Ano de Lançamento*').fill(movieYear);
    await page.getByLabel('Diretor(es)*').fill(movieDirector);
    await page.getByLabel('Tags (separadas por vírgula)*').fill(movieTags);
    await Promise.all([
        page.waitForURL('http://localhost:3000/'),
        page.getByRole('button', { name: 'Adicionar Filme' }).click(),
    ]);

    // 1. Navegar para a página de detalhes
    await page.getByRole('link', { name: movieTitle }).click();

    // 2. Verificar se os detalhes estão corretos
    // CORREÇÃO: Esperamos explicitamente que a página de detalhes carregue antes de verificar
    await expect(page.getByRole('heading', { name: movieTitle, level: 1 })).toBeVisible();
    await expect(page.locator('p', { hasText: `Directed by ${movieDirector}` })).toBeVisible();
    await expect(page.locator('div[class*="tagsContainer"] >> text=detalhes')).toBeVisible();
    await expect(page.locator('div[class*="tagsContainer"] >> text=teste')).toBeVisible();

    // 3. Limpeza
    await page.getByRole('button', { name: 'Delete Movie' }).click();
});
