// src/infra/seed-db.ts

import { AppDataSource } from "./setup_db";
import { Movie } from "../models/Movie";
import { Review } from "../models/Review";
import ForumService from "../services/ForumService";
import CommentService from "../services/CommentService";

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

// Array com os dados dos fóruns para popular a base de dados
const forumsData = [
  {
    title: "Discussão sobre Parasita - O que vocês acharam?",
    description: "Acabei de assistir Parasita e fiquei impressionado com a crítica social. Queria discutir com vocês sobre os temas abordados no filme.",
    username: "cinema_lover",
    movieName: "Parasita"
  },
  {
    title: "Matrix - Revolução no cinema de ação",
    description: "Matrix mudou completamente a forma como vemos filmes de ação. Quem mais acha que foi revolucionário para a época?",
    username: "tech_geek",
    movieName: "Matrix"
  },
  {
    title: "Interestelar - A física por trás do filme",
    description: "Vamos discutir a precisão científica de Interestelar. O que vocês acham sobre a representação dos buracos negros?",
    username: "physics_student",
    movieName: "Interestelar"
  },
  {
    title: "Toy Story - Nostalgia da infância",
    description: "Quem mais cresceu assistindo Toy Story? Vamos relembrar os momentos mais marcantes da trilogia!",
    username: "pixar_fan",
    movieName: "Toy Story"
  },
  {
    title: "O Poderoso Chefão - Clássico absoluto",
    description: "Considerado um dos melhores filmes de todos os tempos. O que faz O Poderoso Chefão ser tão especial?",
    username: "classic_cinema",
    movieName: "O Poderoso Chefão"
  },
  {
    title: "Pulp Fiction - Diálogos inesquecíveis",
    description: "Os diálogos de Pulp Fiction são lendários. Qual é o seu favorito? 'Royale with cheese' sempre me faz rir!",
    username: "tarantino_fan",
    movieName: "Pulp Fiction"
  },
  {
    title: "Senhor dos Anéis - Adaptação perfeita?",
    description: "Peter Jackson fez um trabalho incrível adaptando os livros. O que vocês acham da fidelidade à obra original?",
    username: "tolkien_reader",
    movieName: "O Senhor dos Anéis: A Sociedade do Anel"
  },
  {
    title: "Forrest Gump - História da América",
    description: "O filme retrata décadas da história americana através dos olhos de Forrest. Qual momento histórico mais te marcou?",
    username: "history_buff",
    movieName: "Forrest Gump"
  },
  {
    title: "A Origem - Sonhos dentro de sonhos",
    description: "A Origem é complexo e genial. Quantas vezes vocês assistiram para entender completamente a trama?",
    username: "nolan_fan",
    movieName: "A Origem"
  },
  {
    title: "Clube da Luta - Crítica à sociedade de consumo",
    description: "O filme vai muito além da violência. É uma crítica feroz ao consumismo. O que vocês acham dessa interpretação?",
    username: "social_critic",
    movieName: "Clube da Luta"
  },
  {
    title: "O Silêncio dos Inocentes - Suspense psicológico",
    description: "Anthony Hopkins como Hannibal Lecter é assustadoramente perfeito. Qual cena mais te deixou com medo?",
    username: "horror_lover",
    movieName: "O Silêncio dos Inocentes"
  },
  {
    title: "Cidade de Deus - Realidade brasileira",
    description: "Um dos filmes brasileiros mais importantes. Como vocês acham que o filme retrata a realidade das favelas?",
    username: "brazilian_cinema",
    movieName: "Cidade de Deus"
  },
  {
    title: "A Viagem de Chihiro - Magia do Studio Ghibli",
    description: "Hayao Miyazaki criou um mundo mágico e único. Qual personagem mais te marcou?",
    username: "ghibli_fan",
    movieName: "A Viagem de Chihiro"
  },
  {
    title: "O Iluminado - Terror psicológico",
    description: "Kubrick criou um dos filmes de terror mais influentes. 'Here's Johnny!' ainda me assusta!",
    username: "kubrick_fan",
    movieName: "O Iluminado"
  }
];

// Array com os dados dos comentários para popular a base de dados
const commentsData = [
  {
    content: "Concordo totalmente! A crítica social é muito bem feita. A cena da festa de aniversário é incrível.",
    username: "film_critic",
    forumTitle: "Discussão sobre Parasita - O que vocês acharam?"
  },
  {
    content: "O filme mostra muito bem a desigualdade social. A casa da família rica vs a casa da família pobre é muito simbólico.",
    username: "social_studies",
    forumTitle: "Discussão sobre Parasita - O que vocês acharam?"
  },
  {
    content: "Matrix realmente revolucionou tudo! Os efeitos especiais na época eram impressionantes.",
    username: "vfx_lover",
    forumTitle: "Matrix - Revolução no cinema de ação"
  },
  {
    content: "A cena do bullet time mudou para sempre como fazemos filmes de ação. Genial!",
    username: "action_fan",
    forumTitle: "Matrix - Revolução no cinema de ação"
  },
  {
    content: "A física dos buracos negros foi bem representada, mas alguns aspectos foram dramatizados para o cinema.",
    username: "physics_professor",
    forumTitle: "Interestelar - A física por trás do filme"
  },
  {
    content: "A cena do Gargantua é visualmente deslumbrante. Nolan fez um trabalho incrível!",
    username: "space_enthusiast",
    forumTitle: "Interestelar - A física por trás do filme"
  },
  {
    content: "Cresci assistindo Toy Story! Woody e Buzz são personagens inesquecíveis.",
    username: "90s_kid",
    forumTitle: "Toy Story - Nostalgia da infância"
  },
  {
    content: "A mensagem sobre amizade e aceitação é atemporal. Pixar acertou em cheio!",
    username: "animation_lover",
    forumTitle: "Toy Story - Nostalgia da infância"
  },
  {
    content: "O Poderoso Chefão é perfeito em todos os aspectos. Marlon Brando é incrível como Don Corleone.",
    username: "classic_movie_buff",
    forumTitle: "O Poderoso Chefão - Clássico absoluto"
  },
  {
    content: "A fotografia, a trilha sonora, os diálogos... tudo é perfeito neste filme.",
    username: "cinema_student",
    forumTitle: "O Poderoso Chefão - Clássico absoluto"
  },
  {
    content: "'Royale with cheese' é hilário! Tarantino tem um talento único para diálogos.",
    username: "tarantino_fanatic",
    forumTitle: "Pulp Fiction - Diálogos inesquecíveis"
  },
  {
    content: "A cena do restaurante com Samuel L. Jackson é uma das melhores da história do cinema.",
    username: "dialogue_lover",
    forumTitle: "Pulp Fiction - Diálogos inesquecíveis"
  },
  {
    content: "Como fã dos livros, posso dizer que Jackson fez uma adaptação muito fiel ao espírito da obra.",
    username: "tolkien_expert",
    forumTitle: "Senhor dos Anéis - Adaptação perfeita?"
  },
  {
    content: "A trilogia é uma obra-prima. Cada filme é melhor que o anterior!",
    username: "fantasy_fan",
    forumTitle: "Senhor dos Anéis - Adaptação perfeita?"
  },
  {
    content: "A cena do 'Life is like a box of chocolates' é tão icônica. Tom Hanks é perfeito!",
    username: "hanks_fan",
    forumTitle: "Forrest Gump - História da América"
  },
  {
    content: "O filme retrata tão bem a história americana através dos olhos inocentes do Forrest.",
    username: "history_teacher",
    forumTitle: "Forrest Gump - História da América"
  },
  {
    content: "Assisti 3 vezes e ainda encontro novos detalhes. É genial como tudo se conecta!",
    username: "nolan_enthusiast",
    forumTitle: "A Origem - Sonhos dentro de sonhos"
  },
  {
    content: "A cena do totem no final ainda me deixa confuso. É real ou sonho?",
    username: "mind_bender",
    forumTitle: "A Origem - Sonhos dentro de sonhos"
  },
  {
    content: "O filme é muito mais que violência. É uma crítica feroz ao consumismo moderno.",
    username: "social_commentator",
    forumTitle: "Clube da Luta - Crítica à sociedade de consumo"
  },
  {
    content: "A primeira regra é não falar sobre o Clube da Luta! Mas vamos falar mesmo assim haha",
    username: "fight_clubber",
    forumTitle: "Clube da Luta - Crítica à sociedade de consumo"
  },
  {
    content: "Anthony Hopkins como Hannibal é assustadoramente perfeito. Cada palavra dele é calculada.",
    username: "horror_expert",
    forumTitle: "O Silêncio dos Inocentes - Suspense psicológico"
  },
  {
    content: "A cena do interrogatório é uma das mais tensas que já vi no cinema.",
    username: "thriller_lover",
    forumTitle: "O Silêncio dos Inocentes - Suspense psicológico"
  },
  {
    content: "Como brasileiro, posso dizer que o filme retrata uma realidade muito dura mas necessária.",
    username: "brazilian_viewer",
    forumTitle: "Cidade de Deus - Realidade brasileira"
  },
  {
    content: "A fotografia e a edição são incríveis. Meirelles fez um trabalho excepcional.",
    username: "cinema_aficionado",
    forumTitle: "Cidade de Deus - Realidade brasileira"
  },
  {
    content: "Chihiro é uma protagonista incrível. Sua jornada de crescimento é emocionante.",
    username: "ghibli_expert",
    forumTitle: "A Viagem de Chihiro - Magia do Studio Ghibli"
  },
  {
    content: "A trilha sonora de Joe Hisaishi é perfeita. Cada música combina perfeitamente com a cena.",
    username: "music_lover",
    forumTitle: "A Viagem de Chihiro - Magia do Studio Ghibli"
  },
  {
    content: "Jack Nicholson é aterrorizante! 'Here's Johnny!' ainda me dá calafrios.",
    username: "kubrick_fanatic",
    forumTitle: "O Iluminado - Terror psicológico"
  },
  {
    content: "O hotel Overlook é um personagem por si só. A atmosfera é sufocante.",
    username: "horror_master",
    forumTitle: "O Iluminado - Terror psicológico"
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

    // Cria os fóruns associados aos filmes
    for (const forumData of forumsData) {
      // Busca o filme correspondente
      const movie = await movieRepository.findOne({ where: { name: forumData.movieName } });
      
      if (movie) {
        const forumDataToSave = {
          title: forumData.title,
          description: forumData.description,
          username: forumData.username,
          movieId: movie.id
        };

        await ForumService.saveForum(forumDataToSave);
        console.log(`Fórum "${forumData.title}" foi guardado.`);
      } else {
        console.warn(`Filme "${forumData.movieName}" não encontrado para o fórum "${forumData.title}".`);
      }
    }

    // Cria os comentários associados aos fóruns
    for (const commentData of commentsData) {
      // Busca o fórum correspondente pelo título
      const forums = await ForumService.searchByTitle(commentData.forumTitle);
      
      if (forums.length > 0) {
        const forum = forums[0]; // Pega o primeiro fórum encontrado
        const commentDataToSave = {
          content: commentData.content,
          username: commentData.username,
          forumId: forum.id,
          replyToCommentId: null // Nenhum comentário é resposta de outro
        };

        await CommentService.add(commentDataToSave);
        console.log(`Comentário de "${commentData.username}" foi guardado no fórum "${commentData.forumTitle}".`);
      } else {
        console.warn(`Fórum "${commentData.forumTitle}" não encontrado para o comentário de "${commentData.username}".`);
      }
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
