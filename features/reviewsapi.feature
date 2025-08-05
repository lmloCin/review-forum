Feature: Reviews API

Scenario: Adicionar uma nova review a um filme
  Given o filme com id "3" e nome "Retrato de uma Jovem em Chamas" existe no sistema
  When uma requisição "POST" for enviada para "/api/reviews" com o corpo contendo o texto "Fotografia belíssima e uma história tocante.", a nota 5 e o movieId 2
  Then o status da resposta deve ser "201"
  And o JSON da resposta deve conter a review criada com o texto "Fotografia belíssima e uma história tocante."

Scenario: Deletar uma review existente
  Given uma review com id "5" para o filme com id "1" existe no sistema
  When uma requisição "DELETE" for enviada para "/api/reviews/5"
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter a mensagem "Review deletada com sucesso."
  And a review com id "5" não deve mais existir no sistema

Scenario: Editar o texto de uma review existente (Caminho Feliz)
  Given uma review com id "6" existe no sistema com o texto "Um bom filme."
  When uma requisição "PUT" for enviada para "/api/reviews/6" com o corpo contendo o texto "Um ótimo filme, na verdade."
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter o texto atualizado "Um ótimo filme, na verdade."
  And o JSON da resposta deve indicar que a review foi editada

Scenario: Tentar editar uma review que não existe (Caso de Erro)
  Given uma review com id "999" não existe no sistema
  When uma requisição "PUT" for enviada para "/api/reviews/999" com o corpo contendo qualquer texto
  Then o status da resposta deve ser "404"
  And o JSON da resposta deve conter a mensagem "Review com ID 999 não encontrada."

Scenario: Add a new review to a movie
  Given a user is on the details page for the movie "Portrait of a Lady on Fire"
  When they write a review with the text "Beautiful photography and a touching story." and a rating of 5
  And they submit the new review
  Then their review with the text "Beautiful photography and a touching story." should be visible on the page

Scenario: Delete an existing review
  Given a user has posted a review on the "The Matrix" movie page
  When they decide to delete their review
  And they confirm the action
  Then they should see the message "Review deletada com sucesso."
  And their review should no longer be visible on the page

Scenario: Edit the text of an existing review
  Given a user has posted a review with the text "A good movie."
  When they choose to edit their review
  And they change the text to "An amazing movie, actually."
  And they save the changes
  Then the updated text "An amazing movie, actually." should be visible in their review
  And the review should be marked as "edited"

Scenario: Attempt to edit a non-existent review
  Given a user attempts to perform an edit action on a review that has already been deleted
  When they submit the changes for review
  Then they should see an error message indicating "Review not found."