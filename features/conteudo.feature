Feature: Filmes API

Scenario: Obter detalhes de um filme por ID
  Given o filme com id "2" e nome "Parasita" existe no sistema
  And o filme com id "2" possui duas reviews com notas 5 e 4
  When uma requisição "GET" for enviada para "/api/movies/details/2"
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter o nome "Parasita"
  And o JSON da resposta deve conter a nota média "4.5"
  And a lista de reviews no JSON da resposta deve conter 2 itens

Scenario: Adicionar uma nova review a um filme
  Given o filme com id "3" e nome "Retrato de uma Jovem em Chamas" existe no sistema
  When uma requisição "POST" for enviada para "/api/reviews" com o corpo contendo o texto "Fotografia belíssima e uma história tocante.", a nota 5 e o movieId 2
  Then o status da resposta deve ser "201"
  And o JSON da resposta deve conter a review criada com o texto "Fotografia belíssima e uma história tocante."

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

Feature: Gerenciamento de Conteúdo
 Como um participante da plataforma Eu quero interagir com informações e reviews de filmes Para descobrir, avaliar e discutir obras cinematográficas

Scenario: Visualizar reviews e notas de um filme
Given o filme "Parasita" com nota média "4.5" existe no sistema 
And o filme "Parasita" possui as reviews: "Incrível!" por "cinefilo_1" e "Uma crítica social afiada." por "critica_social_user" 
When eu acesso a página de detalhes do filme "Parasita" 
Then eu devo ver "Parasita" como título principal 
And eu devo ver a nota média "4.5" associada ao filme 
And eu devo ver a review "Incrível!" de "cinefilo_1" 
And eu devo ver a review "Uma crítica social afiada." de "critica_social_user"

Scenario: Usuário comum adiciona sua review e nota a um filme 
Given eu estou logado como o usuário "joana_silva" 
And o filme "Retrato de uma Jovem em Chamas" está disponível para avaliação no sistema 
And eu acesso a funcionalidade de adicionar review para o filme "Retrato de uma Jovem em Chamas" 
When eu submeto uma review com o texto "Fotografia belíssima e uma história tocante." e uma nota de "5 de 5 estrelas" 
Then eu devo visualizar a mensagem "Sua review para 'Retrato de uma Jovem em Chamas' foi publicada com sucesso!" 
And minha avaliação, contendo o texto "Fotografia belíssima e uma história tocante." e a nota "5 de 5 estrelas", deve estar visível na página do filme 
And a nota média geral do filme "Retrato de uma Jovem em Chamas" deve ser recalculada considerando minha nova nota

Scenario:Administrador cadastra novo filme no catálogo  	
Given eu estou logado como um usuário "admin_sistema" com permissões de administrador 
And eu estou na funcionalidade para adicionar um novo filme 
When eu tento cadastrar um filme com as seguintes informações: 
| Título | Ano | Diretor | Gênero Principal | 
| Mad Max: Estrada da Fúria | 2015 | George Miller | Ação | 
Then eu devo visualizar a mensagem de confirmação "Filme 'Mad Max: Estrada da Fúria' cadastrado com sucesso." 
And o filme "Mad Max: Estrada da Fúria" deve constar no sistema com os dados fornecidos: ano "2015", diretor "George Miller" e gênero "Ação"

Scenario: Visualizar onde um filme está disponível para assistir 
Given o filme "Interestelar" está cadastrado no sistema 
And as informações de disponibilidade para "Interestelar" são: "Streaming em 'Max' e Aluguel em 'Amazon Prime Video'" 
When eu consulto a seção "Onde Assistir" na página de detalhes do filme "Interestelar" 
Then eu devo ser informado que o filme está disponível para streaming em "Max" 

Scenario: Administrador edita o gênero de um filme existente 
Given eu estou logado como um usuário "admin_sistema" com permissões de administrador 
And o filme "O Poderoso Chefão" existe no sistema com gênero "Drama" e ano "1972" 
When eu tento atualizar o "Gênero Principal" do filme "O Poderoso Chefão" para "Crime" 
Then eu devo visualizar a mensagem "Informações do filme 'O Poderoso Chefão' atualizadas com sucesso." 
And na página de detalhes do filme "O Poderoso Chefão", o gênero exibido deve ser "Crime" 
And o ano "1972" do filme "O Poderoso Chefão" deve continuar o mesmo
