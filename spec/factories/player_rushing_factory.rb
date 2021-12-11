FactoryBot.define do
  factory :player_rushing do
    player_name { "John doe" }
    team_name { "Tassinari sports" }
    player_position { "FB" }
    avg_rushing_attempts_per_game { rand(1.0..10.0) }
    rushing_attempts { rand(1..10) }
    total_rushing_yards { rand(1..10) }
    avg_yards_per_attempt { rand(1.0..10.0) }
    yards_per_game { rand(1.0..10.0) }
    total_touchdowns { rand(1..10) }
    longest_rush { rand(1..10).to_s }
    first_downs { rand(1..10) }
    first_downs_percentage { rand(1.0..10.0) }
    twenty_yards_rushes { rand(1..10) }
    fourty_yards_rushes { rand(1..10) }
    fumbles { rand(1..10) }

    trait :longest_rush_touchdown do
      longest_rush { rand(1..10).to_s + "T" }
    end
  end
end