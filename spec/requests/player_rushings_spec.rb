require 'rails_helper'

RSpec.describe "PlayerRushings", type: :request do
  describe "GET /player_rushings" do
    let!(:player_rushings) { create_list(:player_rushing, 5) }

    it "returns all current player rushings" do
      get "/player_rushings"

      expect(response).to have_http_status(:ok)
      expect(response.body).to eq(player_rushings.to_json)
    end
  end
end
