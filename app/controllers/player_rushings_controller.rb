class PlayerRushingsController < ApplicationController
  include PaginationConcern
  SORTABLE_ATTRIBUTES = %w[total_rushing_yards longest_rush total_touchdowns]

  def index
    player_rushings = PlayerRushing.all
    if has_search?
      player_rushings = player_rushings.search(index_params[:search])
    end

    if has_allowed_sorting_param?
      if sorting_by_longest_rush?
        player_rushings = player_rushings.order_by_numeric_longest_rush(order_by_param)
      else
        player_rushings = player_rushings.order(sort_by_param => order_by_param, id: :asc)
      end      
    end
    
    respond_to do |format|
      format.json do
          render json: {
          data: paginate(player_rushings),
          pagination: pagination_metadata_for(player_rushings)
        }.to_json, status: 200
      end

      format.csv do
        send_data player_rushings.to_csv,
          type: "text/csv; charset=UTF-8; header=present",
          disposition: "attachment;filename=teste.csv" 
      end
    end
  end

  private

  def index_params
    params.permit(:search, :sort_by, :order_by, :page, :format)
  end

  def has_allowed_sorting_param?
    sort_by_param && SORTABLE_ATTRIBUTES.include?(sort_by_param)
  end

  def has_search?
    index_params[:search].present?
  end

  def sorting_by_longest_rush?
    sort_by_param == "longest_rush"
  end

  def sort_by_param
    index_params[:sort_by]
  end

  def order_by_param
    (index_params[:order_by] || "asc").to_sym
  end
end
