# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

rushings_json = File.read('rushing.json')
rushings_list = JSON.parse(rushings_json)

rushings_list.each do |rushing_data|
  PlayerRushing.create(
    player_name: rushing_data["Player"],
    team_name: rushing_data["Team"],
    player_position: rushing_data["Pos"],
    avg_rushing_attempts_per_game: rushing_data["Att"],
    rushing_attempts: rushing_data["Att/G"],
    total_rushing_yards: rushing_data["Yds"],
    avg_yards_per_attempt: rushing_data["Avg"],
    yards_per_game: rushing_data["Yds/G"],
    total_touchdowns: rushing_data["TD"],
    longest_rush: rushing_data["Lng"],
    first_downs: rushing_data["1st"],
    first_downs_percentage: rushing_data["1st%"],
    twenty_yards_rushes: rushing_data["20+"],
    fourty_yards_rushes: rushing_data["40+"],
    fumbles: rushing_data["FUM"]
  )
end