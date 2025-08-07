import { test, expect } from '@playwright/test';

// --- Teste para o Cenário: Successfully register a new movie ---
test('Successfully register a new movie', async ({ page }) => {
  const newMovieTitle = `Filme de Teste ${crypto.randomUUID()}`;

  // Preparamos o teste para aceitar todos os pop-ups de confirmação
  page.on('dialog', dialog => dialog.accept());

  // 1. Navegar para a página principal e fazer login como admin
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();

  // 2. Clicar para adicionar um novo filme
  await page.locator('[href="/add-movie"]').click();
  
  // 3. Preencher o formulário com os dados do novo filme
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

  // 6. Limpeza: Apagar o filme criado para não interferir com outros testes
  await page.getByRole('link', { name: newMovieTitle }).click();
  await page.getByRole('button', { name: 'Delete Movie' }).click();
});


// --- Teste para o Cenário: Edit the tags of an existing movie ---
test('Edit the tags of an existing movie', async ({ page }) => {
  const movieToEditTitle = `Filme para Editar ${crypto.randomUUID()}`;
  
  page.on('dialog', dialog => dialog.accept());

  // Passo de Setup: Fazer login e criar o filme via UI
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('[href="/add-movie"]').click();
  
  await page.getByLabel('Título*').fill(movieToEditTitle);
  await page.getByLabel('Ano de Lançamento*').fill('2024');
  await page.getByLabel('Diretor(es)*').fill('Diretor Original');
  await page.getByLabel('Tags (separadas por vírgula)*').fill('original, tag');
  
  await Promise.all([
    page.waitForURL('http://localhost:3000/'),
    page.getByRole('button', { name: 'Adicionar Filme' }).click(),
  ]);

  // 1. Encontrar o filme na homepage e navegar para a sua página de detalhes
  await page.getByRole('link', { name: movieToEditTitle }).click();
  
  // 2. Na página de detalhes, clicar no botão para editar
  await page.getByRole('link', { name: 'Edit Movie' }).click();

  // 3. Na página de edição, alterar o campo de tags
  const tagsInput = page.getByLabel('Tags (separadas por vírgula)*');
  await tagsInput.fill('tag, editada, sucesso');
  
  // 4. Submeter as alterações
  await page.getByRole('button', { name: 'Editar Filme' }).click();

  // 5. Verificar se, na página de detalhes, as tags foram atualizadas
  await expect(page.locator('span').filter({ hasText: 'editada' })).toBeVisible();
  await expect(page.locator('span').filter({ hasText: 'sucesso' })).toBeVisible();

  // 6. Limpeza: Apagar o filme criado
  await page.getByRole('button', { name: 'Delete Movie' }).click();
});


// --- Teste para o Cenário: Delete a movie from the catalog ---
test('Delete a movie from the catalog', async ({ page }) => {
  const movieToDeleteTitle = `Filme para Apagar ${crypto.randomUUID()}`;

  page.on('dialog', dialog => dialog.accept());

  // Passo de Setup: Fazer login e criar o filme via UI
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('[href="/add-movie"]').click();

  await page.getByLabel('Título*').fill(movieToDeleteTitle);
  await page.getByLabel('Ano de Lançamento*').fill('2023');
  await page.getByLabel('Diretor(es)*').fill('Diretor a ser Apagado');
  await page.getByLabel('Tags (separadas por vírgula)*').fill('delete, test');

  await Promise.all([
    page.waitForURL('http://localhost:3000/'),
    page.getByRole('button', { name: 'Adicionar Filme' }).click(),
  ]);

  // 1. Encontrar o filme e navegar para a sua página de detalhes
  await page.getByRole('link', { name: movieToDeleteTitle }).click();

  // 2. Clicar no botão para apagar o filme
  await page.getByRole('button', { name: 'Delete Movie' }).click();

  // 3. Verificar se fomos redirecionados para a homepage e se o filme já não existe
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.getByRole('link', { name: movieToDeleteTitle })).not.toBeVisible();
});


// --- NOVO Teste para o Cenário: Add a new review to a movie ---
test('Add a new review to a movie', async ({ page }) => {
    const movieTitle = `Filme para Review ${crypto.randomUUID()}`;
    const reviewText = "Este é um comentário de teste excelente!";

    page.on('dialog', dialog => dialog.accept());

    // Passo de Setup: Criar o filme
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('[href="/add-movie"]').click();
    await page.getByLabel('Título*').fill(movieTitle);
    await page.getByLabel('Ano de Lançamento*').fill('2022');
    await page.getByLabel('Diretor(es)*').fill('Diretor de Review');
    await page.getByLabel('Tags (separadas por vírgula)*').fill('review, test');
    await Promise.all([
        page.waitForURL('http://localhost:3000/'),
        page.getByRole('button', { name: 'Adicionar Filme' }).click(),
    ]);

    // 1. Navegar para a página de detalhes do filme criado
    await page.getByRole('link', { name: movieTitle }).click();

    // 2. Clicar no botão para adicionar uma review
    await page.getByRole('link', { name: '+ Add Review' }).click();

    // 3. Preencher o formulário da review
    await page.locator('span').filter({ hasText: '★' }).nth(4).click(); // Clica na 5ª estrela
    await page.getByPlaceholder('Fotografia belíssima e uma história tocante!').fill(reviewText);

    // 4. Submeter a review
    await page.getByRole('button', { name: 'Enviar Review' }).click();

    // 5. Verificar se a review aparece na página de detalhes
    await expect(page.locator('p').filter({ hasText: reviewText })).toBeVisible();

    // 6. Limpeza: Apagar o filme criado
    await page.getByRole('button', { name: 'Delete Movie' }).click();
});


// --- NOVO Teste para o Cenário: Verify movie details after creation ---
test('Verify movie details after creation', async ({ page }) => {
    const movieTitle = `Filme para Detalhes ${crypto.randomUUID()}`;
    const movieYear = '2021';
    const movieDirector = 'Diretor Detalhado';
    const movieTags = 'detalhes, teste';

    page.on('dialog', dialog => dialog.accept());

    // Passo de Setup: Criar o filme com detalhes específicos
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('[href="/add-movie"]').click();
    await page.getByLabel('Título*').fill(movieTitle);
    await page.getByLabel('Ano de Lançamento*').fill(movieYear);
    await page.getByLabel('Diretor(es)*').fill(movieDirector);
    await page.getByLabel('Tags (separadas por vírgula)*').fill(movieTags);
    await Promise.all([
        page.waitForURL('http://localhost:3000/'),
        page.getByRole('button', { name: 'Adicionar Filme' }).click(),
    ]);

    // 1. Navegar para a página de detalhes do filme
    await page.getByRole('link', { name: movieTitle }).click();

    // 2. Verificar se todos os detalhes estão corretos
    await expect(page.getByRole('heading', { name: movieTitle })).toBeVisible();
    await expect(page.locator('span').filter({ hasText: movieYear })).toBeVisible();
    await expect(page.locator('p').filter({ hasText: `Directed by ${movieDirector}` })).toBeVisible();
    await expect(page.locator('span').filter({ hasText: 'detalhes' })).toBeVisible();
    await expect(page.locator('span').filter({ hasText: 'teste' })).toBeVisible();

    // 3. Limpeza: Apagar o filme criado
    await page.getByRole('button', { name: 'Delete Movie' }).click();
});
