Feature: Filmes API

Scenario: Obter detalhes de um filme por ID
  Given o filme com id "2" e nome "Parasita" existe no sistema
  And o filme com id "2" possui duas reviews com notas 5 e 4
  When uma requisição "GET" for enviada para "/api/movies/details/2"
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter o nome "Parasita"
  And o JSON da resposta deve conter a nota média "4.5"
  And a lista de reviews no JSON da resposta deve conter 2 itens

Scenario: Cadastrar um novo filme no catálogo
  Given o filme "Mad Max: Estrada da Fúria" não existe no sistema
  When uma requisição "POST" for enviada para "/api/movies" com o corpo contendo título "Mad Max: Estrada da Fúria", ano 2015, diretor "George Miller" e gênero "Ação"
  Then o status da resposta deve ser "201"
  And o JSON da resposta deve conter a mensagem "Filme 'Mad Max: Estrada da Fúria' cadastrado com sucesso."
  And o JSON da resposta deve conter os dados do filme criado, incluindo seu novo id

Scenario: Editar o gênero de um filme existente
  Given o filme com id "5" e nome "O Poderoso Chefão" existe no sistema com o gênero "Drama"
  When uma requisição "PUT" for enviada para "/api/movies/3" com o corpo contendo o gênero "Crime"
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter a mensagem "Informações do filme 'O Poderoso Chefão' atualizadas com sucesso."
  And o JSON da resposta deve conter os dados do filme atualizado com o gênero "Crime"

Scenario: Obter informações de disponibilidade de um filme
  Given o filme com id "6" e nome "Interestelar" existe no sistema
  And suas informações de disponibilidade incluem "Max" para streaming e "Amazon Prime Video" para aluguel
  When uma requisição "GET" for enviada para "/api/movies/details/4"
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter um campo "availability"
  And o campo "availability" deve conter "Max" na lista de "streaming"

Scenario: Deletar um filme e suas reviews associadas
  Given um filme com id "7" existe no sistema
  And existem reviews associadas ao filme com id "7"
  When uma requisição "DELETE" for enviada para "/api/movies/7"
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter a mensagem "Filme e todas as suas reviews foram deletados com sucesso."

Scenario: View a movie's details
  Given the movie "Parasite" exists in the system with 2 reviews with ratings 5 and 4
  When a user visits the details page for the movie "Parasite"
  Then they should see the name "Parasite" as the main title
  And they should see that the average rating is "4.5"
  And they should see a list containing 2 reviews

Scenario: Successfully register a new movie
  Given an admin user is on the new movie page
  And the movie "Mad Max: Fury Road" has not been registered yet
  When they fill out the form with the title "Mad Max: Fury Road", year "2015", and genre "Action"
  And they submit the form for registration
  Then they should see the message "Filme 'Mad Max: Fury Road' cadastrado com sucesso."
  And the movie "Mad Max: Fury Road" should appear in the general catalog list

Scenario: Edit the genre of an existing movie
  Given the movie "The Godfather" exists in the system with the genre "Drama"
  When a user goes to the edit page for the movie "The Godfather"
  And changes the "genre" field to "Crime"
  And they submit the changes
  Then they should see the message "Informações do filme 'The Godfather' atualizadas com sucesso."
  And on the movie's details page, the displayed genre should be "Crime"

Scenario: Check where a movie is available to watch
  Given the movie "Interstellar" is available for streaming on "Max"
  When a user visits the details page for the movie "Interstellar"
  Then they should see a section called "Where to Watch"
  And in that section, "Max" should be listed as an option

Scenario: Delete a movie from the catalog
  Given the movie "Joker" exists in the system
  When a user on the "Joker" movie page decides to delete it and confirms their intention
  Then they should see the message "Filme e todas as suas reviews foram deletados com sucesso."
  And the movie "Joker" should no longer be displayed in the list