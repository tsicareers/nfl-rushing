require 'csv'

class PlayerRushingsController < ApplicationController
  SORTABLE_ATTRIBUTES = %w[total_rushing_yards longest_rush total_touchdowns]
  PAGE_SIZE = 20

  def index
    player_rushings = PlayerRushing.all
    if has_search?
      player_rushings = player_rushings.where('lower(player_name) LIKE ?', "%#{index_params[:search].downcase}%")
    end

    if has_allowed_sorting_param?
      if sorting_by_longest_rush?
        player_rushings = player_rushings.order_by_numeric_longest_rush(ordering_param)
      else
        player_rushings = player_rushings.order(params[:sort_by] => ordering_param, id: :asc)
      end      
    end
    
    respond_to do |format|
      format.json do
          render json: {
          data: player_rushings.offset(offset_index*PAGE_SIZE).limit(PAGE_SIZE),
          pagination: {
            current_page: page_number,
            total_hits: player_rushings.count,
            total_pages: (player_rushings.count / PAGE_SIZE).ceil
          }
        }.to_json, status: 200
      end

      format.csv do
        send_data player_rushings.to_csv, type: "text/csv; charset=UTF-8; header=present", disposition: "attachment;filename=teste.csv" 
      end
    end
    
  end

  private

  def index_params
    params.permit(:search, :sort_by, :order_by, :page, :format)
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

  def offset_index
    page_number - 1
  end

  def page_number
    int_page = index_params[:page].to_i
    int_page.zero? ? 1 : int_page
  end
end
