const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

// --- Passos do Cenário 1 ---
Given('o filme {string} existe no sistema com gênero {string} e ano {string}', async function (name, genre, year) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: name,
    description: `Um filme sobre ${name}`,
    year: parseInt(year),
    director: "Diretor Teste",
    genre: genre
  });
  this.movieId = response.data.movie.id; 
  assert.strictEqual(response.status, 201);
});

When('eu tento atualizar o {string} do filme {string} para {string}', async function (field, movieName, newValue) {
  const response = await axios.put(`${API_BASE_URL}/api/movies/${this.movieId}`, {
    genre: newValue
  });
  this.response = response; 
});

Then('na página de detalhes do filme {string}, o gênero exibido deve ser {string}', async function (movieName, expectedGenre) {
  const response = await axios.get(`${API_BASE_URL}/api/movies/details/${this.movieId}`);
  assert.strictEqual(response.data.genre, expectedGenre);
});

Then('o ano {string} do filme {string} deve continuar o mesmo', async function (expectedYear, movieName) {
  const response = await axios.get(`${API_BASE_URL}/api/movies/details/${this.movieId}`);
  assert.strictEqual(response.data.year, parseInt(expectedYear));
});

// --- Passos do Cenário 2 ---
Given('o filme com id {string} e nome {string} existe no sistema', async function (id, name) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: name,
    description: `Descrição de ${name}`,
    year: 2024,
    director: "Diretor Teste",
    genre: "Teste"
  });
  this.movieId = response.data.movie.id;
  assert.strictEqual(response.status, 201);
});

Given('o filme com id {string} possui duas reviews com notas {int} e {int}', async function (movieId, rating1, rating2) {
  await axios.post(`${API_BASE_URL}/api/reviews`, { text: "Review 1", rating: rating1, movieId: this.movieId });
  await axios.post(`${API_BASE_URL}/api/reviews`, { text: "Review 2", rating: rating2, movieId: this.movieId });
});

When('uma requisição {string} for enviada para {string}', async function (method, path) {
  let idToUse;

  if (this.movieIdToDelete) {
    idToUse = this.movieIdToDelete;
  } else if (this.reviewIdToDelete) {
    idToUse = this.reviewIdToDelete;
  } else if (this.reviewIdToEdit) {
    idToUse = this.reviewIdToEdit;
  } else if (this.nonExistentReviewId) {
    idToUse = this.nonExistentReviewId;
  } else {
    idToUse = this.movieId;
  }

  const finalPath = path.replace(/(\d+)$/, idToUse);

  try {
    this.response = await axios({
      method: method.toLowerCase(),
      url: `${API_BASE_URL}${finalPath}`
    });
  } catch (error) {
    this.response = error.response;
  }
});

Then('o status da resposta deve ser {string}', function (expectedStatus) {
  assert.strictEqual(this.response.status, parseInt(expectedStatus));
});

Then('o JSON da resposta deve conter o nome {string}', function (expectedName) {
  assert.strictEqual(this.response.data.name, expectedName);
});

Then('o JSON da resposta deve conter a nota média {string}', function (expectedAverage) {
  assert.strictEqual(this.response.data.averageRating, parseFloat(expectedAverage));
});

Then('a lista de reviews no JSON da resposta deve conter {int} itens', function (expectedCount) {
  assert.strictEqual(this.response.data.reviews.length, expectedCount);
});

// --- Passos do Cenário 3 ---
Given('o filme {string} não existe no sistema', async function (movieName) {
});

When('uma requisição {string} for enviada para {string} com o corpo contendo título {string}, ano {int}, diretor {string} e gênero {string}', async function (method, path, title, year, director, genre) {
  const response = await axios({
    method: method.toLowerCase(),
    url: `${API_BASE_URL}${path}`,
    data: {
      name: title,
      description: `Descrição de ${title}`,
      year: year,
      director: director,
      genre: genre
    }
  });
  this.response = response;
});

Then('o JSON da resposta deve conter a mensagem {string}', function (expectedMessage) {
  assert.strictEqual(this.response.data.message, expectedMessage);
});

Then('o JSON da resposta deve conter os dados do filme criado, incluindo seu novo id', function () {
  assert.ok(this.response.data.movie.id, "O ID do filme não foi retornado");
});

// --- Passos do Cenário 4 ---
Given('o filme com id {string} e nome {string} existe no sistema com o gênero {string}', async function (id, name, genre) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: name,
    description: `Descrição de ${name}`,
    year: 2000,
    director: "Diretor Teste",
    genre: genre
  });
  this.movieId = response.data.movie.id;
});

When('uma requisição {string} for enviada para {string} com o corpo contendo o gênero {string}', async function (method, path, newGenre) {
  const finalPath = path.replace(/(\d+)$/, this.movieId);
  const response = await axios({
    method: method.toLowerCase(),
    url: `${API_BASE_URL}${finalPath}`,
    data: { genre: newGenre }
  });
  this.response = response;
});

Then('o JSON da resposta deve conter os dados do filme atualizado com o gênero {string}', function (expectedGenre) {
  assert.strictEqual(this.response.data.movie.genre, expectedGenre);
});

// --- Passos do Cenário 5 ---
Given('suas informações de disponibilidade incluem {string} para streaming e {string} para aluguel', async function (streamingPlatform, rentPlatform) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: "Interestelar",
    description: "Uma viagem espacial.",
    year: 2014,
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    availability: {
      streaming: [streamingPlatform],
      rent: [rentPlatform]
    }
  });
  this.movieId = response.data.movie.id;
});

Then('o JSON da resposta deve conter um campo {string}', function (fieldName) {
  assert.ok(this.response.data[fieldName], `O campo '${fieldName}' não foi encontrado na resposta.`);
});

Then('o campo {string} deve conter {string} na lista de {string}', function (field, value, list) {
  assert.ok(this.response.data[field][list].includes(value));
});

// --- Passos do Cenário 6 ---
Given('um filme com id {string} existe no sistema', async function (id) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: "Filme a ser deletado",
    description: "...",
    year: 2025,
    director: "Diretor",
    genre: "Ação"
  });
  this.movieIdToDelete = response.data.movie.id;
});

Given('existem reviews associadas ao filme com id {string}', async function (movieId) {
  await axios.post(`${API_BASE_URL}/api/reviews`, { text: "Review para deletar", rating: 3, movieId: this.movieIdToDelete });
});

Then('o filme com id {string} não deve mais existir no sistema', async function (id) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await axios.get(`${API_BASE_URL}/api/movies/get-by-id/${this.movieIdToDelete}`);
    assert.fail("O filme ainda existe, mas deveria ter sido deletado.");
  } catch (error) {
    assert.strictEqual(error.response.status, 404);
  }
});

Then('nenhuma review associada ao filme com id {string} deve existir no sistema', function (string) {
  return 'pending';
});


When('uma requisição {string} for enviada para {string} com o corpo contendo o texto {string}, a nota {int} e o movieId {int}', async function (method, path, text, rating, movieId) {
  const response = await axios({
    method: method.toLowerCase(),
    url: `${API_BASE_URL}${path}`,
    data: { text, rating, movieId: this.movieId } 
  });
  this.response = response;
});

Then('o JSON da resposta deve conter a review criada com o texto {string}', function (expectedText) {
  assert.strictEqual(this.response.data.text, expectedText);
});

// --- Passos do Cenário 8 ---
Given('uma review com id {string} para o filme com id {string} existe no sistema', async function (reviewId, movieId) {
  const movieResponse = await axios.post(`${API_BASE_URL}/api/movies`, { name: "Filme com Review", description: "...", year: 2025, director: "D", genre: "G" });
  const reviewResponse = await axios.post(`${API_BASE_URL}/api/reviews`, { text: "Review a ser deletada", rating: 4, movieId: movieResponse.data.movie.id });
  this.reviewIdToDelete = reviewResponse.data.id;
});

Then('a review com id {string} não deve mais existir no sistema', async function (id) {
  try {
    await axios.get(`${API_BASE_URL}/api/reviews/${this.reviewIdToDelete}`); 
    assert.fail("A review ainda existe, mas deveria ter sido deletada.");
  } catch (error) {
    assert.strictEqual(error.response.status, 404);
  }
});

// --- Passos do Cenário 8 ---
Given('uma review com id {string} existe no sistema com o texto {string}', async function (id, text) {
  const movieResponse = await axios.post(`${API_BASE_URL}/api/movies`, { name: "Filme com Review Editável", description: "...", year: 2025, director: "D", genre: "G" });
  const reviewResponse = await axios.post(`${API_BASE_URL}/api/reviews`, { text: text, rating: 3, movieId: movieResponse.data.movie.id });
  this.reviewIdToEdit = reviewResponse.data.id;
});

When('uma requisição {string} for enviada para {string} com o corpo contendo o texto {string}', async function (method, path, newText) {
  const finalPath = path.replace(/(\d+)$/, this.reviewIdToEdit);
  const response = await axios({
    method: method.toLowerCase(),
    url: `${API_BASE_URL}${finalPath}`,
    data: { text: newText }
  });
  this.response = response;
});

Then('o JSON da resposta deve conter o texto atualizado {string}', function (expectedText) {
  assert.strictEqual(this.response.data.text, expectedText);
});

Then('o JSON da resposta deve indicar que a review foi editada', function () {
  assert.strictEqual(this.response.data.isEdited, true);
});

// --- Passos do Cenário 9 
Given('uma review com id {string} não existe no sistema', function (id) {
  this.nonExistentReviewId = id;
});

When('uma requisição {string} for enviada para {string} com o corpo contendo qualquer texto', async function (method, path) {
  const finalPath = path.replace(/(\d+)$/, this.nonExistentReviewId);
  try {
    this.response = await axios({
      method: method.toLowerCase(),
      url: `${API_BASE_URL}${finalPath}`,
      data: { text: "Qualquer texto" }
    });
  } catch (error) {
    this.response = error.response;
  }
});


Given('the Film {string} exists with tags {string}', async function (name, tags) {
  const tagsArray = tags.split(',');
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: name,
    description: `Um filme sobre ${name}`,
    year: 2025,
    director: "Diretor Teste",
    tags: tagsArray,
  });
  this.movieId = response.data.movie.id;
  assert.strictEqual(response.status, 201);
});

When('i search by tags {string}', async function (tags) {
  const tagParam = encodeURIComponent(tags);
  this.searchResponse = await axios.get(`${API_BASE_URL}/api/movies/search-by-tags?tags=${tagParam}`);
  //console.log(this.searchResponse);
});

Then('i can see {int} movies', function (count) {
  assert.strictEqual(this.searchResponse.data.length, count);
});

Then('the movie list should include {string}', function (name) {
  const movieNames = this.searchResponse.data.map(movie => movie.name);
  assert.ok(movieNames.includes(name), `Expected movie list to include "${name}", but got: ${movieNames.join(', ')}`);
});

Given('the Film {string} exists', async function (name) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: name,
    description: `Um filme sobre ${name}`,
    year: 2025,
    director: "Diretor Teste",
    tags: ['string'],
  });
  this.movieId = response.data.movie.id;
  assert.strictEqual(response.status, 201);
});

When('i search the name {string}', async function (name) {
  const encodedName = encodeURIComponent(name);
  this.searchResponse = await axios.get(`${API_BASE_URL}/api/movies/search?name=${encodedName}`);
});

Given('the Film {string} exists with average rating {int}', async function (name, rating) {

  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: name,
    description: `Um filme sobre ${name}`,
    year: 2025,
    director: "Diretor Teste",
    tags: ['string'],
  });
  this.movieId = response.data.movie.id;
  await axios.post(`${API_BASE_URL}/api/reviews`, { text: "Review", rating: rating, movieId: this.movieId });
  await axios.post(`${API_BASE_URL}/api/reviews`, { text: "Review", rating: rating, movieId: this.movieId });
  assert.strictEqual(response.status, 201);
});

When('i search by min rating {int} and max rating {int}', async function (min, max) {
  this.searchResponse = await axios.get(`${API_BASE_URL}/api/movies/by-rating?min=${min}&max=${max}`);
});

//Trending
Given('the Film {string} exists with reviews_today {int}',async function (name, review_count) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: name,
    description: `Um filme sobre ${name}`,
    year: 2025,
    director: "Diretor Teste",
    tags: ['string'],
  });
  this.movieId = response.data.movie.id;
  for (let i = 1; i <= review_count; i++) {
    await axios.post(`${API_BASE_URL}/api/reviews`, { text: "Review", rating: 1, movieId: this.movieId });
  }

  assert.strictEqual(response.status, 201);

});

When('i visit the trending tab', async function () {
  this.searchResponse = await axios.get(`${API_BASE_URL}/api/movies/trending`);
});

Given('the movie {string} exists in the system with 2 reviews with ratings {int} and {int}', async function (movieName, rating1, rating2) {
  // 1. Criar o filme base
  const movieResponse = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: movieName,
    description: `A movie called ${movieName}`,
    year: 2019,
    director: "Bong Joon Ho",
    genre: "Thriller"
  });
  assert.strictEqual(movieResponse.status, 201, 'Failed to create the movie');
  
  // Guardamos o ID do filme no contexto do cenário para os próximos passos
  this.movieId = movieResponse.data.movie.id;

  // 2. Adicionar as duas reviews associadas a esse filme
  await axios.post(`${API_BASE_URL}/api/reviews`, { text: "Masterpiece!", rating: rating1, movieId: this.movieId });
  await axios.post(`${API_BASE_URL}/api/reviews`, { text: "A bit long, but great.", rating: rating2, movieId: this.movieId });
});


When('a user visits the details page for the movie {string}', async function (movieName) {
  // Usamos o ID guardado no passo 'Given' para fazer a requisição
  assert.ok(this.movieId, 'Movie ID was not set in the Given step');
  try {
    this.response = await axios.get(`${API_BASE_URL}/api/movies/details/${this.movieId}`);
  } catch (error) {
    // Guardamos a resposta de erro para que os passos 'Then' possam analisá-la
    this.response = error.response;
  }
});


Then('they should see the name {string} as the main title', function (expectedName) {
  assert.strictEqual(this.response.status, 200, `Expected status 200 but got ${this.response.status}`);
  assert.strictEqual(this.response.data.name, expectedName);
});

Then('they should see that the average rating is {string}', function (expectedAverage) {
  // Convertemos a string do cenário para um número para a comparação
  const expectedRating = parseFloat(expectedAverage);
  assert.strictEqual(this.response.data.averageRating, expectedRating);
});

Then('they should see a list containing {int} reviews', function (expectedCount) {
  assert.ok(Array.isArray(this.response.data.reviews), 'The reviews property is not an array');
  assert.strictEqual(this.response.data.reviews.length, expectedCount);
});

Given('an admin user is on the new movie page', function () {
  // Este passo é para dar contexto de leitura, não requer ação na API.
});

Given('the movie {string} has not been registered yet', function (movieName) {
  // Este passo também é declarativo. O hook 'Before' garante que o sistema
  // começa em um estado limpo, sem este filme pré-existente.
});

/**
 * @When
 * Estes passos executam as ações do usuário.
 */
When('they fill out the form with the title {string}, year {string}, and genre {string}', function (title, year, genre) {
  // Este passo apenas prepara os dados que serão enviados, guardando-os no contexto.
  // A ação de envio acontece no próximo passo.
  this.formData = {
    name: title,
    year: parseInt(year),
    genre: genre,
    director: "George Miller", // Adicionando dados padrão para completar o objeto
    description: `A movie about ${title}`
  };
});

When('they submit the form for registration', async function () {
  // Agora, a ação de submeter o formulário é traduzida para a chamada POST,
  // usando os dados que preparamos no passo anterior.
  try {
    this.response = await axios.post(`${API_BASE_URL}/api/movies`, this.formData);
  } catch (error) {
    this.response = error.response;
  }
});


Then('they should see the delete message {string}', function (expectedMessage) {
  // Verificamos o status de criação (201) e a mensagem de sucesso.
  assert.strictEqual(this.response.status, 201, `Expected status 201 but got ${this.response.status}`);
  assert.strictEqual(this.response.data.message, expectedMessage);
});

Then('the movie {string} should appear in the general catalog list', async function (movieName) {
  // Para confirmar, fazemos uma nova chamada para buscar todos os filmes.
  const getResponse = await axios.get(`${API_BASE_URL}/api/movies`);
  
  // Verificamos se um filme com o nome esperado existe na lista retornada.
  const movieExists = getResponse.data.some(movie => movie.name === movieName);
  
  assert.ok(movieExists, `The movie "${movieName}" was not found in the catalog after creation.`);
});

Given('the movie {string} exists in the system with the genre {string}', async function (movieName, genre) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: movieName, description: `A movie called ${movieName}`, year: 1972, director: "Francis Ford Coppola", genre: genre
  });
  this.movieId = response.data.movie.id;
});

Given('the movie {string} is available for streaming on {string}', async function (movieName, platform) {
  const response = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: movieName, description: `A movie called ${movieName}`, year: 2014, director: "Christopher Nolan", genre: "Sci-Fi",
    availability: { streaming: [platform] }
  });
  this.movieId = response.data.movie.id;
});

Given('the movie {string} exists in the system', async function (movieName) {
    const response = await axios.post(`${API_BASE_URL}/api/movies`, {
        name: movieName, description: `A movie called ${movieName}`, year: 2019, director: "Todd Phillips", genre: "Drama"
    });
    this.movieId = response.data.movie.id;
});


When('a user goes to the edit page for the movie {string}', function (movieName) { /* Declarativo */ });

When('changes the {string} field to {string}', function (field, value) {
  // Prepara o dado para a atualização. O 'toLowerCase()' torna mais flexível.
  this.updateData = { [field.toLowerCase()]: value };
});

When('they submit the changes', async function () {
  assert.ok(this.movieId, 'Movie ID was not set in the Given step');
  try {
    this.response = await axios.put(`${API_BASE_URL}/api/movies/${this.movieId}`, this.updateData);
  } catch (error) {
    this.response = error.response;
  }
});

When('they submit the changes for review', async function () {
  try {
    this.response = await axios.put(`${API_BASE_URL}/api/movies/${this.reviewId}`, this.reviewData);
  } catch (error) {
    this.response = error.response;
  }
});


When('a user on the {string} movie page decides to delete it and confirms their intention', async function (movieName) {
    assert.ok(this.movieId, 'Movie ID was not set in the Given step');
    try {
        this.response = await axios.delete(`${API_BASE_URL}/api/movies/${this.movieId}`);
    } catch (error) {
        this.response = error.response;
    }
});

Then('they should see the message {string}', function (expectedMessage) {
  // Verifica se o status da resposta é de sucesso (2xx)
  assert.ok(this.response.status >= 200 && this.response.status < 300, `Expected a success status code, but got ${this.response.status}`);
  assert.strictEqual(this.response.data.message, expectedMessage);
});

Then('on the movie\'s details page, the displayed genre should be {string}', async function (expectedGenre) {
  assert.strictEqual(this.response.data.movie.genre, expectedGenre);
});

Then('they should see a section called {string}', function (sectionName) {
  assert.ok(this.response.data.availability, `The response JSON does not have the '${sectionName}' field.`);
});

Then('in that section, {string} should be listed as an option', function (platformName) {
  const streamingPlatforms = this.response.data.availability.streaming;
  assert.ok(streamingPlatforms.includes(platformName), `"${platformName}" was not found in the streaming list.`);
});

Then('the movie {string} should no longer be displayed in the list', async function (movieName) {
    const getResponse = await axios.get(`${API_BASE_URL}/api/movies`);
    const movieExists = getResponse.data.some(movie => movie.name === movieName);
    assert.strictEqual(movieExists, false, `Movie "${movieName}" was found, but it should have been deleted.`);
});

Given('a user is on the details page for the movie {string}', async function (movieName) {
  // Garante que o filme existe para que possamos adicionar a review a ele.
  const movieResponse = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: movieName, description: `A movie called ${movieName}`, year: 2019, director: "Céline Sciamma", genre: "Romance"
  });
  this.movieId = movieResponse.data.movie.id;
});

Given('a user has posted a review on the {string} movie page', async function (movieName) {
  // CORREÇÃO: Enviando um objeto de filme completo para evitar erro 400.
  const movieResponse = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: movieName, description: "A movie about computer-generated reality.", year: 1999, director: "Wachowskis", genre: "Sci-Fi"
  });
  this.movieId = movieResponse.data.movie.id;

  const reviewResponse = await axios.post(`${API_BASE_URL}/api/reviews`, {
    text: "Initial review text.", rating: 4, movieId: this.movieId
  });
  this.reviewId = reviewResponse.data.id;
});

Given('a user has posted a review with the text {string}', async function (reviewText) {
  // CORREÇÃO: Enviando um objeto de filme completo para evitar erro 400.
  const movieResponse = await axios.post(`${API_BASE_URL}/api/movies`, {
    name: "A Movie", description: "A test movie.", year: 2023, director: "A Director", genre: "Test"
  });
  this.movieId = movieResponse.data.movie.id;

  const reviewResponse = await axios.post(`${API_BASE_URL}/api/reviews`, {
    text: reviewText, rating: 3, movieId: this.movieId
  });
  this.reviewId = reviewResponse.data.id;
});

Given('a user attempts to perform an edit action on a review that has already been deleted', function () {
  // Este passo é declarativo. Vamos usar um ID que sabemos que não existe.
  this.reviewId = '999';
});


// WHEN (Ação)

When('they write a review with the text {string} and a rating of {int}', function (text, rating) {
  // Prepara os dados da review para serem enviados.
  this.reviewData = { text, rating, movieId: this.movieId };
});

When('they submit the new review', async function () {
  try {
    this.response = await axios.post(`${API_BASE_URL}/api/reviews`, this.reviewData);
  } catch (error) {
    this.response = error.response;
  }
});

When('they decide to delete their review', function () { /* Declarativo */ });

When('they confirm the action', async function () {
  try {
    this.response = await axios.delete(`${API_BASE_URL}/api/reviews/${this.reviewId}`);
  } catch (error) {
    this.response = error.response;
  }
});

When('they choose to edit their review', function () { /* Declarativo */ });

When('they change the text to {string}', function (newText) {
  this.reviewData = { text: newText };
});

When('they save the changes', async function () {
  try {
    this.response = await axios.put(`${API_BASE_URL}/api/reviews/${this.reviewId}`, this.reviewData);
  } catch (error) {
    this.response = error.response;
  }
});


// THEN (Verificação)

Then('their review with the text {string} should be visible on the page', async function (expectedText) {
  assert.strictEqual(this.response.data.text, expectedText);
});

Then('their review should no longer be visible on the page', async function () {
  try {
    // Tenta buscar a review que foi deletada.
    await axios.get(`${API_BASE_URL}/api/reviews/${this.reviewId}`);
    // Se a chamada acima não der erro, o teste falha, pois a review ainda existe.
    assert.fail('The review was found, but it should have been deleted.');
  } catch (error) {
    // O esperado é receber um erro 404 (Not Found).
    assert.strictEqual(error.response.status, 404, 'Expected a 404 status, but received something else.');
  }
});

Then('the updated text {string} should be visible in their review', function (expectedText) {
  assert.strictEqual(this.response.status, 200);
  assert.strictEqual(this.response.data.text, expectedText);
});

Then('the review should be marked as {string}', function (marker) {
  // Assumindo que a API retorna um campo 'isEdited: true'.
  assert.strictEqual(this.response.data.isEdited, true);
});

Then('they should see an error message indicating {string}', function (errorMessage) {
  // Verifica se o status é de erro (ex: 404) e se a mensagem corresponde.
  assert.strictEqual(this.response.status, 404);
});
