const express = require('express')
const PORT = process.env.PORT || 8080;
const app = express()
const bodyParser = require('body-parser')
import {AppDataSource} from './infra/setup_db'
import forumRouter from './api/ForumApi'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import MovieRouter from './api/MovieApi'
import ReviewRouter from './api/ReviewApi';
import endpointsRouter from './api/endpoints'


AppDataSource.initialize()
    .then(() => {
        console.log("Data Source inicializado com sucesso!");

        // Configura as rotas APÓS a conexão com o banco ser estabelecida
        app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
        app.use('/api/movies', MovieRouter);
        app.use('/api/reviews', ReviewRouter);
        // app.use('/api/forums', forumRouter);
        // app.use('/api', endpointsRouter);

        app.get('/', (req,res) => {
            res.send('Landing page is up!')
        });

        // Inicia o servidor Express
        app.listen(PORT, () => {
            console.log(`Servidor está rodando 🚀 na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Falha ao inicializar o Data Source:", err);
    });


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req,res) => {
    res.send('Landing page is up!')
})


const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'My Express.js API',
        version: '1.0.0',
        description: 'A sample Express.js API built with TypeScript and Swagger',
      },
    },
    apis: ['./src/api/*.ts'],
  }
  const swaggerDocs = swaggerJsdoc(swaggerOptions)
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/api', endpointsRouter)