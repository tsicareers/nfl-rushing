require "test_helper"

class Api::Vi::PlayersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_vi_players_index_url
    assert_response :success
  end
end
