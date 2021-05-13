Rails.application.routes.draw do
  root 'pages#home'
  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      get 'players', to: 'players#index'
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
