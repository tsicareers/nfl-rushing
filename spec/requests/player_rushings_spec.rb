require 'rails_helper'

RSpec.describe "PlayerRushings", type: :request do
  describe "GET /player_rushings" do
    let!(:player_rushings) { create_list(:player_rushing, 5) }

    it "returns all current player rushings" do
      get "/player_rushings"

      expect(response).to have_http_status(:ok)
      expect(response.body).to eq(PlayerRushing.all.to_json)
    end

    context "when receives a search string" do
      let!(:player_with_matching_name) do
        create(:player_rushing, player_name: 'Mathew Silva')
      end
      let!(:player_rushings) { create_list(:player_rushing, 5) }

      it "searches player rushings by player name" do
        get "/player_rushings?search=thew"

        expect(response).to have_http_status(:ok)
        expect(response.body).to eq([player_with_matching_name].to_json)
      end

      context "with capital letters" do
        it "searches player rushings by lowercase player name" do
          get "/player_rushings?search=ThEw"
  
          expect(response).to have_http_status(:ok)
          expect(response.body).to eq([player_with_matching_name].to_json)
        end
      end

      context "an empty search string" do
        it "returns all player rushings" do
          get "/player_rushings?search="
  
          expect(response).to have_http_status(:ok)
          expect(response.body).to eq(PlayerRushing.all.to_json)
        end
      end
    end
  end
end
