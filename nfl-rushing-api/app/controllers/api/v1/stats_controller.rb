class Api::V1::StatsController < ApplicationController
    def index
        @stats = RushStat.all
        render json: @stats
    end    
end
