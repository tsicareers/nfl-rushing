module Api
  module V1
    class PlayersController < ApplicationController
      def index
        sortable = sort_params[:sort].present? ? "#{sort_params[:sort]} #{sort_direction}" : 'created_at desc'
        @players = Player.order(sortable)
        @players = @players.search(filter_params[:name]) if filter_params[:name].present?
        @total_items = @players.count

        respond_to do |format|
          format.csv do
            send_data @players.to_csv
          end
    
          format.all do
            @page = paging_params[:page] || 1
            @per = paging_params[:per] || 10
            @players = @players.page(@page).per(@per)
          end
        end
      end

      private

      def sort_params
        params.permit(:sort, :sort_direction)
      end

      def paging_params
        params.permit(:page, :per)
      end

      def filter_params
        params.permit(:name)
      end

      def sort_direction
        %w[asc desc].include?(params[:sort_dir]) ? params[:sort_dir] : 'asc'
      end
    end
  end
end
