class Api::V1::StatsController < ApplicationController
    def index
        @stats = params[:player].blank? ? RushStat.order(:id) : RushStat.search(params[:player])
        paginated_stats = @stats.paginate(page: params[:page], per_page: 10).order(params[:sort_by])

        response = {stats: paginated_stats, current_page: paginated_stats.current_page, total_pages: paginated_stats.total_pages}
        render json: response, status: :ok
    end

    def export_csv
        @stats = params[:player].blank? ? RushStat.order(:id) : RushStat.search(params[:player])
        @stats = @stats.order(params[:sort_by])
        send_data RushStat.to_csv(@stats), filename: "stats-#{Date.current.to_s}-export.csv"
    end
    

    private

    def stat_params
        params.require(:rush_stat).permit(:player, :sort_by, :page)
    end
    
end