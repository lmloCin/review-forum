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

