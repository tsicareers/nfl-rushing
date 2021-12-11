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

    context "when receives a sort param" do
      context "for an forbidden sortable column" do
        it "returns the player rushings without any order" do
          get "/player_rushings?sort_by=anything"
  
          expect(response).to have_http_status(:ok)
          expect(response.body).to eq(PlayerRushing.all.to_json)
        end
      end

      context "when sorting by longest rush" do
        let!(:player_rushings_with_t) { create_list(:player_rushing, 5, :longest_rush_touchdown) }
        let!(:player_rushings_without_t) { create_list(:player_rushing, 5) }

        it "disconsiders the T and orders respectively by numeric longest rush, longest rush and then ID" do
          
        end

        context "without speficic ordering" do
          it "orders by asc" do
            get "/player_rushings?sort_by=longest_rush"

            all_player_rushings = PlayerRushing.all
            rushings_ordered_by_number_longest_rush = all_player_rushings.sort_by { |p| [p.longest_rush_distance, p.longest_rush, p.id] }
    
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(rushings_ordered_by_number_longest_rush.to_json)
          end
        end

        context "with order_by=asc" do 
          it "orders by asc" do
            get "/player_rushings?sort_by=longest_rush&order_by=asc"

            all_player_rushings = PlayerRushing.all
            rushings_ordered_by_number_longest_rush = all_player_rushings.sort_by { |p| [p.longest_rush_distance, p.longest_rush, p.id] }
    
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(rushings_ordered_by_number_longest_rush.to_json)
          end
        end

        context "with order_by=desc" do 
          it "orders by desc" do
            get "/player_rushings?sort_by=longest_rush&order_by=desc"

            all_player_rushings = PlayerRushing.all
            rushings_ordered_by_number_longest_rush = all_player_rushings.sort_by { |p| [p.longest_rush_distance, p.longest_rush, p.id] }
            
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(rushings_ordered_by_number_longest_rush.reverse.to_json)
          end
        end
      end

      context "when sorting by longest rush" do
        let!(:player_rushings_with_t) { create_list(:player_rushing, 5, :longest_rush_touchdown) }
        let!(:player_rushings_without_t) { create_list(:player_rushing, 5) }

        it "disconsiders the T and orders respectively by numeric longest rush, longest rush and then ID" do
          get "/player_rushings?sort_by=longest_rush"

          all_player_rushings = PlayerRushing.all
          rushings_ordered_by_number_longest_rush = all_player_rushings.sort_by { |p| [p.longest_rush_distance, p.longest_rush, p.id] }
  
          expect(response).to have_http_status(:ok)
          expect(response.body).to eq(rushings_ordered_by_number_longest_rush.to_json)
        end
      end

      context "when sorting by total rushing yards" do
        context "without speficic ordering" do
          it "orders by asc" do
            get "/player_rushings?sort_by=total_rushing_yards"
  
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(PlayerRushing.all.order(total_rushing_yards: :asc).to_json)
          end
        end

        context "with order_by=asc" do 
          it "orders by asc" do
            get "/player_rushings?sort_by=total_rushing_yards&order_by=asc"
    
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(PlayerRushing.all.order(total_rushing_yards: :asc).to_json)
          end
        end

        context "with order_by=desc" do 
          it "orders by desc" do
            get "/player_rushings?sort_by=total_rushing_yards&order_by=desc"
    
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(PlayerRushing.all.order(total_rushing_yards: :desc).to_json)
          end
        end
      end

      context "when sorting by total rushing touchdowns" do
        context "without speficic ordering" do
          it "orders by asc" do
            get "/player_rushings?sort_by=total_touchdowns"
    
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(PlayerRushing.all.order(total_touchdowns: :asc).to_json)
          end
        end

        context "with order_by=asc" do 
          it "orders by asc" do
            get "/player_rushings?sort_by=total_touchdowns&order_by=asc"
    
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(PlayerRushing.all.order(total_touchdowns: :asc).to_json)
          end
        end

        context "with order_by=desc" do 
          it "orders by desc" do
            get "/player_rushings?sort_by=total_touchdowns&order_by=desc"
    
            expect(response).to have_http_status(:ok)
            expect(response.body).to eq(PlayerRushing.all.order(total_touchdowns: :desc).to_json)
          end
        end
      end
    end
  end
end
