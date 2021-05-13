require "test_helper"

module Api
  module V1
    class PlayersControllerTest < ActionDispatch::IntegrationTest
      test "should get index" do
        get api_vi_players_index_url
        assert_response :success
      end
    end
  end
end
