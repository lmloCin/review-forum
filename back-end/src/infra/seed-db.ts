// src/infra/seed-db.ts

import { AppDataSource } from "./setup_db";
import { Movie } from "../models/Movie";
import { Review } from "../models/Review";

// Array com os dados dos filmes e reviews para popular a base de dados
const moviesData = [
  {
    name: "Parasita",
    description: "Uma família pobre de quatro pessoas que vive num porão húmido e escuro, lutando para sobreviver. A vida deles muda quando o filho mais velho consegue um emprego como tutor de inglês na casa de uma família rica.",
    year: 2019,
    director: "Bong Joon Ho",
    tags: ["suspense", "drama", "comédia"],
    bannerURL: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg",
    availability: { streaming: ["Netflix", "Max"] },
    reviews: [
      { text: "Uma obra-prima do cinema moderno. Absolutamente genial.", rating: 5 },
      { text: "Um soco no estômago. Necessário e brilhante.", rating: 5 },
    ],
  },
  {
    name: "Matrix",
    description: "Um jovem programador é atormentado por estranhos pesadelos nos quais se encontra conectado por cabos a um sistema de computadores do futuro.",
    year: 1999,
    director: "Wachowskis",
    tags: ["ação", "ficção científica", "cyberpunk"],
    bannerURL: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
    availability: { streaming: ["Max"], rent: ["Apple TV", "Google Play"] },
    reviews: [
      { text: "Revolucionou o cinema de ação.", rating: 5 },
    ],
  },
  {
    name: "Interestelar",
    description: "As reservas naturais da Terra estão a chegar ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receber a população mundial, possibilitando a continuação da espécie.",
    year: 2014,
    director: "Christopher Nolan",
    tags: ["ficção científica", "drama", "aventura"],
    bannerURL: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
    availability: { streaming: ["Max", "Prime Video"] },
    reviews: [
        { text: "Uma jornada visual e emocionalmente avassaladora.", rating: 5 }
    ]
  },
  {
    name: "Toy Story",
    description: "Woody, um boneco cowboy, torna-se ciumento quando um novo brinquedo, o patrulheiro espacial Buzz Lightyear, o substitui como o brinquedo favorito de Andy.",
    year: 1995,
    director: "John Lasseter",
    tags: ["animação", "aventura", "comédia"],
    bannerURL: "https://static.wikia.nocookie.net/disneypixar/images/6/68/Toy_Story_Poster.jpg/revision/latest?cb=20130405154259&path-prefix=pt-br",
    availability: { streaming: ["Disney+"] },
    reviews: []
  },
  {
    name: "O Poderoso Chefão",
    description: "O patriarca de uma poderosa família da máfia de Nova Iorque transfere o controlo do seu império clandestino para o seu relutante filho.",
    year: 1972,
    director: "Francis Ford Coppola",
    tags: ["crime", "drama"],
    bannerURL: "https://upload.wikimedia.org/wikipedia/pt/a/af/The_Godfather%2C_The_Game.jpg",
    availability: { streaming: ["Star+", "Paramount+"] },
    reviews: [{ text: "Um dos maiores filmes já feitos.", rating: 5 }]
  },
  {
    name: "Pulp Fiction",
    description: "As vidas de dois assassinos de aluguer, um pugilista, a mulher de um gangster e um par de bandidos de restaurante entrelaçam-se em quatro contos de violência e redenção.",
    year: 1994,
    director: "Quentin Tarantino",
    tags: ["crime", "drama"],
    bannerURL: "https://upload.wikimedia.org/wikipedia/pt/8/82/Pulp_Fiction_cover.jpg",
    availability: { streaming: ["Netflix", "Star+"] },
    reviews: [{ text: "Narrativa não-linear genial e diálogos inesquecíveis.", rating: 5 }]
  },
  {
    name: "O Senhor dos Anéis: A Sociedade do Anel",
    description: "Um humilde Hobbit da Comarca e oito companheiros partem numa jornada para destruir o poderoso Um Anel e salvar a Terra Média do Lorde das Trevas Sauron.",
    year: 2001,
    director: "Peter Jackson",
    tags: ["aventura", "drama", "fantasia"],
    bannerURL: "https://upload.wikimedia.org/wikipedia/pt/3/38/Lord_of_the_Rings_Fellowship_of_the_Ring.jpg",
    availability: { streaming: ["Max"] },
    reviews: [{ text: "Uma adaptação épica e fiel.", rating: 5 }]
  },
  {
    name: "Forrest Gump",
    description: "As presidências de Kennedy e Johnson, a Guerra do Vietname, o escândalo de Watergate e outros eventos históricos desenrolam-se através da perspetiva de um homem do Alabama com um QI de 75.",
    year: 1994,
    director: "Robert Zemeckis",
    tags: ["drama", "romance"],
    bannerURL: "https://upload.wikimedia.org/wikipedia/pt/c/c0/ForrestGumpPoster.jpg",
    availability: { streaming: ["Netflix", "Paramount+"] },
    reviews: [{ text: "Emocionante e inesquecível.", rating: 5 }]
  },
  {
    name: "A Origem",
    description: "Um ladrão que rouba segredos corporativos através do uso da tecnologia de partilha de sonhos recebe a tarefa inversa de plantar uma ideia na mente de um C.E.O.",
    year: 2010,
    director: "Christopher Nolan",
    tags: ["ação", "aventura", "ficção científica"],
    bannerURL: "https://images.adsttc.com/media/images/53b5/d563/c07a/80a3/4300/016c/medium/inception_ver12_xlg.png?1404425564",
    availability: { streaming: ["Max"] },
    reviews: [{ text: "Complexo, inteligente e visualmente deslumbrante.", rating: 5 }]
  },
  {
    name: "Clube da Luta",
    description: "Um empregado de escritório insone e um fabricante de sabão despreocupado formam um clube de luta clandestino que evolui para algo muito, muito maior.",
    year: 1999,
    director: "David Fincher",
    tags: ["drama"],
    bannerURL: "https://br.web.img3.acsta.net/medias/nmedia/18/90/95/96/20122166.jpg",
    availability: { streaming: ["Star+", "Netflix"] },
    reviews: [{ text: "A primeira regra é não falar sobre o Clube da Luta.", rating: 5 }]
  },
  {
    name: "O Silêncio dos Inocentes",
    description: "Uma jovem estagiária do F.B.I. deve procurar a ajuda de um assassino canibal manipulador e preso para ajudar a apanhar outro assassino em série.",
    year: 1991,
    director: "Jonathan Demme",
    tags: ["crime", "drama", "suspense"],
    bannerURL: "https://m.media-amazon.com/images/I/51iUTsAbgbL._UF1000,1000_QL80_.jpg",
    availability: { streaming: ["Prime Video"] },
    reviews: [{ text: "Atuações icónicas e um suspense de roer as unhas.", rating: 5 }]
  },
  {
    name: "Cidade de Deus",
    description: "Nas favelas do Rio de Janeiro, dois rapazes que crescem no mesmo ambiente seguem caminhos muito diferentes: um torna-se fotógrafo, o outro, traficante de droga.",
    year: 2002,
    director: "Fernando Meirelles, Kátia Lund",
    tags: ["crime", "drama"],
    bannerURL: "https://upload.wikimedia.org/wikipedia/pt/1/10/CidadedeDeus.jpg",
    availability: { streaming: ["Globoplay"] },
    reviews: [{ text: "Um retrato cru e poderoso da realidade brasileira.", rating: 5 }]
  },
  {
    name: "A Viagem de Chihiro",
    description: "Durante a mudança da sua família para os subúrbios, uma menina de 10 anos vagueia por um mundo governado por deuses, bruxas e espíritos, e onde os humanos são transformados em bestas.",
    year: 2001,
    director: "Hayao Miyazaki",
    tags: ["animação", "aventura", "família"],
    bannerURL: "https://br.web.img3.acsta.net/pictures/210/527/21052756_20131024195513383.jpg",
    availability: { streaming: ["Netflix"] },
    reviews: [{ text: "Uma obra-prima da animação.", rating: 5 }]
  },
  {
    name: "O Iluminado",
    description: "Uma família dirige-se para um hotel isolado para o inverno, onde uma presença sinistra influencia o pai para a violência, enquanto o seu filho psíquico vê presságios horríveis do passado e do futuro.",
    year: 1980,
    director: "Stanley Kubrick",
    tags: ["drama", "terror"],
    bannerURL: "https://cinemateca.org.br/wp-content/uploads/2024/09/cbs_o_iluminado.jpg",
    availability: { streaming: ["Max"] },
    reviews: [{ text: "Aterrorizante e icónico.", rating: 5 }]
  }
];

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Conexão com a base de dados estabelecida para o seeding...");

    const movieRepository = AppDataSource.getRepository(Movie);

    // Itera sobre os dados e cria os filmes e reviews
    for (const movieData of moviesData) {
      const movie = new Movie(
        movieData.name,
        movieData.description,
        movieData.year,
        movieData.director,
        movieData.tags,
        movieData.availability, // Passamos os dados de disponibilidade
        movieData.bannerURL
      );

      // Cria as reviews associadas
      movie.reviews = movieData.reviews.map(reviewData => {
        const review = new Review();
        review.text = reviewData.text;
        review.rating = reviewData.rating;
        review.movie = movie;
        return review;
      });

      await movieRepository.save(movie);
      console.log(`Filme "${movieData.name}" e as suas reviews foram guardados.`);
    }

    console.log("Base de dados populada com sucesso!");

  } catch (error) {
    console.error("Erro ao popular a base de dados:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Conexão com a base de dados fechada.");
    }
  }
}

seedDatabase();
