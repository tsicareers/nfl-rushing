class PlayerRushingsController < ApplicationController
  def index
    render json: PlayerRushing.all.to_json, status: 200
  end
end
