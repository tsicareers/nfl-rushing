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

    describe "pagination" do
      let!(:player_rushings) { create_list(:player_rushing, 100) }

      context "when receives no page parameter" do
        it "returns the first page" do
          get "/player_rushings"
  
          expect(response).to have_http_status(:ok)
          expect(response.body).to eq(PlayerRushing.limit(20).to_json)
        end
      end

      context "when receives a valid page parameter" do
        let(:page) { 3 }
        it "offsets the records accordingly" do
          get "/player_rushings?page=#{page}"
  
          expect(response).to have_http_status(:ok)
          expect(response.body).to eq(PlayerRushing.offset(20*(page-1)).limit(20).to_json)
        end
      end

      context "when receives an invalid page parameter" do
        let(:page) { "!abc" }
        it "returns the first page" do
          get "/player_rushings?page=#{page}"
  
          expect(response).to have_http_status(:ok)
          expect(response.body).to eq(PlayerRushing.limit(20).to_json)
        end
      end
    end

    context "pagination, sorting and search" do
      let!(:player_rushings) { create_list(:player_rushing, 100) } 
      let!(:searchable_players) do
        create_list(:player_rushing, 50) do |rushing, i|
          rushing.player_name = "Mathew #{i}"
          rushing.save
        end
      end

      it "work with together" do
        get "/player_rushings?search=mathew&page=2&sort_by=total_rushing_yards"
  
        expect(response).to have_http_status(:ok)

        puts JSON.parse(response.body).map { |a| a["id"]  }
        puts '\n'
        puts searchable_players.sort_by{ |a| [a.total_rushing_yards, a.id] }[20..40].map(&:id)

        expect(response.body).to eq(
          searchable_players.sort_by { |a| [a.total_rushing_yards, a.id] }[20..39].to_json
        )
      end
    end
    
  end
end
