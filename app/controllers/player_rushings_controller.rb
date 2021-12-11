class PlayerRushingsController < ApplicationController
  SORTABLE_ATTRIBUTES = %w[total_rushing_yards longest_rush total_touchdowns]

  def index
    player_rushings = PlayerRushing.all
    if has_search?
      player_rushings = player_rushings.where('lower(player_name) LIKE ?', "%#{index_params[:search].downcase}%")
    end

    if has_allowed_sorting_param?
      if sorting_by_longest_rush?
        player_rushings = player_rushings.order_by_numeric_longest_rush(ordering_param)
      else
        player_rushings = player_rushings.order(params[:sort_by] => ordering_param)
      end      
    end
    
    render json: player_rushings.to_json, status: 200
  end

  private

  def index_params
    params.permit(:search, :sort_by, :order_by)
  end

  def has_allowed_sorting_param?
    index_params[:sort_by] && SORTABLE_ATTRIBUTES.include?(index_params[:sort_by])
  end

  def has_search?
    index_params[:search].present?
  end

  def sorting_by_longest_rush?
    index_params[:sort_by] == "longest_rush"
  end

  def ordering_param
    (index_params[:order_by] || "asc").to_sym
  end
end
