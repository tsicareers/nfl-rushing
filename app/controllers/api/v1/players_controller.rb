module Api
  module V1
    class PlayersController < ApplicationController
      def index
        sortable = params[:sort].present? ? "#{params[:sort]} #{sort_direction}" : 'created_at desc'
        @page = params[:page] || 1
        @per = params[:per] || 10
        @players = Player.order(sortable)
        @players = @players.search(params[:name]) if params[:name].present?
        @total_items = @players.count
        @players = @players.page(@page).per(@per)
      end

      private

      def sort_direction
        %w[asc desc].include?(params[:sort_dir]) ? params[:sort_dir] : 'asc'
      end
    end
  end
end
