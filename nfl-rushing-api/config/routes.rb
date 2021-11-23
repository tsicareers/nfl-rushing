Rails.application.routes.draw do
  namespace 'api' do
    namespace 'v1' do
      resources :stats do
        collection do
          get 'export_csv', action: :export_csv    
        end
      end
    end
  end
end
