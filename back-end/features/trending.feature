Feature: Trending

Scenario: Aba trending
Given the Film "Matri" exists with reviews_today 1
Given the Film "Matri 2" exists with reviews_today 2
Given the Film "Matri 3" exists with reviews_today 3
Given the Film "Matri 4" exists with reviews_today 4
Given the Film "Matri 5" exists with reviews_today 5
Given the Film "Matri 6" exists with reviews_today 6
Given the Film "Matri 7" exists with reviews_today 7
Given the Film "Matri 8" exists with reviews_today 8
Given the Film "Matri 9" exists with reviews_today 9
Given the Film "Matri 10" exists with reviews_today 10
Given the Film "Matri 11" exists with reviews_today 11
Given the Film "Matri 12" exists with reviews_today 12
When i visit the trending tab
Then i can see 10 movies
And the movie list should include "Matri 12"
And the movie list should include "Matri 11"
And the movie list should include "Matri 10"
And the movie list should include "Matri 9"
And the movie list should include "Matri 8"
And the movie list should include "Matri 7"
And the movie list should include "Matri 6"
And the movie list should include "Matri 5"
And the movie list should include "Matri 4"
And the movie list should include "Matri 3"

