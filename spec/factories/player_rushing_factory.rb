FactoryBot.define do
  factory :player_rushing do
    player_name { "John doe" }
    team_name { "Tassinari sports" }
    player_position { "FB" }
    avg_rushing_attempts_per_game { 2.5 }
    rushing_attempts { 2 }
    total_rushing_yards { 2 }
    avg_yards_per_attempt { 3.5 }
    yards_per_game { 5.5 }
    total_touchdowns { 4 }
    longest_rush { "4" }
    first_downs { 3 }
    first_downs_percentage { 2.4 }
    twenty_yards_rushes { 2 }
    fourty_yards_rushes { 3 }
    fumbles { 4 }

    trait :longest_rush_touchdown do
      longest_rush { "T" }
    end
  end
end