class Api::V1::StatsController < ApplicationController
    def index
        @stats = params[:player].blank? ? RushStat.order(:id) : RushStat.search(params[:player])
        render json: @stats
    end

    private

    def stat_params
        params.require(:rush_stat).permit(:player)
    end
    
end
