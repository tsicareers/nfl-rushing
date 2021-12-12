require 'rails_helper'


RSpec.shared_examples "searchable" do |expected_format|
  let(:to_expected_format) { "to_#{expected_format}" }

  it "returns all current player rushings" do
    get "/player_rushings", params: {format: expected_format}

    expect(response).to have_http_status(:ok)
    expect(parsed_response).to eq(PlayerRushing.all.public_send(to_expected_format))
  end

  context "when receives a search string" do
    let!(:player_with_matching_name) do
      create(:player_rushing, player_name: 'Mathew Silva')
    end

    it "searches player rushings by player name" do
      get "/player_rushings?search=thew", params: {format: expected_format}

      expect(response).to have_http_status(:ok)
      expect(parsed_response).to eq(PlayerRushing.where(id: player_with_matching_name.id).public_send(to_expected_format))
    end

    context "with capital letters" do
      it "searches player rushings by lowercase player name" do
        get "/player_rushings?search=ThEw", params: {format: expected_format}

        expect(response).to have_http_status(:ok)
        expect(parsed_response).to eq(PlayerRushing.where(id: player_with_matching_name.id).public_send(to_expected_format))
      end
    end

    context "an empty search string" do
      it "returns all player rushings" do
        get "/player_rushings?search=", params: {format: expected_format}

        expect(response).to have_http_status(:ok)
        expect(parsed_response).to eq(PlayerRushing.all.public_send(to_expected_format))
      end
    end
  end
end

RSpec.shared_examples "sortable" do |expected_format|
  let(:to_expected_format) { "to_#{expected_format}" }

  context "when receives a sort param" do
    context "for an forbidden sortable column" do
      it "returns the player rushings without any order" do
        get "/player_rushings?sort_by=anything", params: {format: expected_format}

        expect(response).to have_http_status(:ok)
        expect(parsed_response).to eq(PlayerRushing.all.public_send(to_expected_format))
      end
    end

    context "when sorting by longest rush" do
      let!(:player_rushings_with_t) { create_list(:player_rushing, 5, :longest_rush_touchdown) }
      let!(:player_rushings_without_t) { create_list(:player_rushing, 5) }

      context "without speficic ordering" do
        it "orders by asc" do
          get "/player_rushings?sort_by=longest_rush", params: {format: expected_format}
  
          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.order_by_numeric_longest_rush.public_send(to_expected_format))
        end
      end

      context "with order_by=asc" do 
        it "orders by asc" do
          get "/player_rushings?sort_by=longest_rush&order_by=asc", params: {format: expected_format}
  
          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.order_by_numeric_longest_rush.public_send(to_expected_format))
        end
      end

      context "with order_by=desc" do 
        it "orders by desc" do
          get "/player_rushings?sort_by=longest_rush&order_by=desc", params: {format: expected_format}
          
          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.order_by_numeric_longest_rush(:desc).public_send(to_expected_format))
        end
      end
    end

    context "when sorting by longest rush" do
      let!(:player_rushings_with_t) { create_list(:player_rushing, 5, :longest_rush_touchdown) }
      let!(:player_rushings_without_t) { create_list(:player_rushing, 5) }

      it "disconsiders the T and orders respectively by numeric longest rush, longest rush and then ID" do
        get "/player_rushings?sort_by=longest_rush", params: {format: expected_format}

        expect(response).to have_http_status(:ok)
        expect(parsed_response).to eq(PlayerRushing.order_by_numeric_longest_rush.public_send(to_expected_format))
      end
    end

    context "when sorting by total rushing yards" do
      context "without speficic ordering" do
        it "orders by asc" do
          get "/player_rushings?sort_by=total_rushing_yards", params: {format: expected_format}

          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.all.order(total_rushing_yards: :asc).public_send(to_expected_format))
        end
      end

      context "with order_by=asc" do 
        it "orders by asc" do
          get "/player_rushings?sort_by=total_rushing_yards&order_by=asc", params: {format: expected_format}
  
          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.all.order(total_rushing_yards: :asc).public_send(to_expected_format))
        end
      end

      context "with order_by=desc" do 
        it "orders by desc" do
          get "/player_rushings?sort_by=total_rushing_yards&order_by=desc", params: {format: expected_format}
  
          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.all.order(total_rushing_yards: :desc).public_send(to_expected_format))
        end
      end
    end

    context "when sorting by total rushing touchdowns" do
      context "without speficic ordering" do
        it "orders by asc" do
          get "/player_rushings?sort_by=total_touchdowns", params: {format: expected_format}
  
          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.all.order(total_touchdowns: :asc).public_send(to_expected_format))
        end
      end

      context "with order_by=asc" do 
        it "orders by asc" do
          get "/player_rushings?sort_by=total_touchdowns&order_by=asc", params: {format: expected_format}
  
          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.all.order(total_touchdowns: :asc).public_send(to_expected_format))
        end
      end

      context "with order_by=desc" do 
        it "orders by desc" do
          get "/player_rushings?sort_by=total_touchdowns&order_by=desc", params: {format: expected_format}
  
          expect(response).to have_http_status(:ok)
          expect(parsed_response).to eq(PlayerRushing.all.order(total_touchdowns: :desc).public_send(to_expected_format))
        end
      end
    end
  end
end

RSpec.describe "PlayerRushings", type: :request do
  describe "GET /player_rushings" do
    let!(:player_rushings) { create_list(:player_rushing, 5) }
    let(:parsed_response) {  JSON.parse(response.body) }
    let(:response_rushings) { parsed_response["data"].to_json }
    let(:pagination_data) { parsed_response["pagination"] }

    context "json" do
      it_behaves_like "sortable", :json do 
        let(:parsed_response) { JSON.parse(response.body)["data"].to_json }
      end

      it_behaves_like "searchable", :json do 
        let(:parsed_response) { JSON.parse(response.body)["data"].to_json }
      end

      describe "pagination" do
        let!(:player_rushings) { create_list(:player_rushing, 100) }
  
        it "returns pagination metadata" do
          get "/player_rushings", params: {format: :json}
    
            expect(response).to have_http_status(:ok)
            expect(pagination_data["current_page"]).to eq(1)
            expect(pagination_data["total_pages"]).to eq(5)
            expect(pagination_data["total_hits"]).to eq(100)
        end
  
        context "when receives no page parameter" do
          it "returns the first page" do
            get "/player_rushings", params: {format: :json}
    
            expect(response).to have_http_status(:ok)
            expect(response_rushings).to eq(PlayerRushing.limit(20).to_json)
          end
        end
  
        context "when receives a valid page parameter" do
          let(:page) { 3 }
          it "offsets the records accordingly" do
            get "/player_rushings?page=#{page}", params: {format: :json}
    
            expect(response).to have_http_status(:ok)
            expect(response_rushings).to eq(PlayerRushing.offset(20*(page-1)).limit(20).to_json)
          end
        end
  
        context "when receives an invalid page parameter" do
          let(:page) { "!abc" }
          it "returns the first page" do
            get "/player_rushings?page=#{page}", params: {format: :json}
    
            expect(response).to have_http_status(:ok)
            expect(response_rushings).to eq(PlayerRushing.limit(20).to_json)
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
          get "/player_rushings?search=mathew&page=2&sort_by=total_rushing_yards", params: {format: :json}
    
          expect(response).to have_http_status(:ok)
          expect(response_rushings).to eq(
            searchable_players.sort_by { |a| [a.total_rushing_yards, a.id] }[20..39].to_json
          )
        end
      end
    end

    context "csv" do
      it "responds in csv format" do
        get "/player_rushings", params: {format: :csv}

        expect(response.header['Content-Type']).to include 'text/csv'
      end

      it_behaves_like "sortable", :csv do 
        let(:parsed_response) { response.body }
      end

      it_behaves_like "searchable", :csv do 
        let(:parsed_response) { response.body }
      end

      context "sorting and search" do
        let!(:player_rushings) { create_list(:player_rushing, 100) } 
        let!(:searchable_players) do
          create_list(:player_rushing, 3) do |rushing, i|
            rushing.player_name = "Mathew #{i}"
            rushing.save
          end
        end
  
        it "work together" do
          get "/player_rushings?search=mathew&sort_by=total_rushing_yards", params: {format: :csv}
    
          expect(response).to have_http_status(:ok)
          expect(response.body).to eq(
            PlayerRushing.where("player_name LIKE '%Mathew%'").order(:total_rushing_yards, :id).to_csv
          )
        end
      end
    end
  end
end
