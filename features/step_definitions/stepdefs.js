const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

// --- Passos do Cenário 5 ---
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

// --- Passos do Cenário 6 ---
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

// --- Passos do Cenário 7 ---
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

// --- Passos do Cenário 8 ---
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

// --- Passos do Cenário 9 ---
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

// --- Passos do Cenário 10 ---
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

// --- Passos do Cenário 14 ---
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

// --- Passos do Cenário 15 ---
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

// --- Passos do Cenário 16 ---
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

// --- Passos do Cenário 17 ---
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
