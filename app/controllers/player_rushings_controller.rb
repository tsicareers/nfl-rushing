class PlayerRushingsController < ApplicationController
  def index
    player_rushings = PlayerRushing.all
    if params[:search].present?
      player_rushings = player_rushings.where('lower(player_name) LIKE ?', "%#{index_params[:search].downcase}%")
    end
    
    render json: player_rushings.to_json, status: 200
  end

  private

  def index_params
    params.permit(:search)
  end
end
