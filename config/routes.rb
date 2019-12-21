Rails.application.routes.draw do
  resources :tournaments
  resources :matches
  resources :players
  resources :player_matches
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
