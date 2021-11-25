class Api::V1::StatsController < ApplicationController
    def index
        @stats = params[:player].blank? ? RushStat.all : RushStat.search(params[:player])
        sort_order = params[:sort_order].present? ? params[:sort_order] : "asc"
        sort_by = params[:sort_by].present? ? params[:sort_by] : "id"
        paginated_stats = @stats.paginate(page: params[:page], per_page: params[:per_page]).order(sort_by => sort_order)

        response = {stats: paginated_stats, current_page: paginated_stats.current_page, next_page: paginated_stats.next_page, total_entries: paginated_stats.total_entries}
        render json: response, status: :ok
    end

    def export_csv
        @stats = params[:player].blank? ? RushStat.order(:id) : RushStat.search(params[:player])
        sort_order = params[:sort_order].present? ? params[:sort_order] : "asc"
        sort_by = params[:sort_by].present? ? params[:sort_by] : "id"
        @stats = @stats.order(sort_by => sort_order)
        send_data RushStat.to_csv(@stats), filename: "stats-#{Date.current.to_s}-export.csv"
    end
    

    private

    def stat_params
        params.require(:rush_stat).permit(:player, :sort_by, :page, :per_page, :sort_order)
    end
    
end