class CreatePlayerRushings < ActiveRecord::Migration[6.1]
  def change
    create_table :player_rushings do |t|
      t.string :player_name
      t.string :team_name
      t.string :player_position
      t.float :avg_rushing_attempts_per_game
      t.integer :rushing_attempts
      t.integer :total_rushing_yards
      t.float :avg_yards_per_attempt
      t.float :yards_per_game
      t.integer :total_touchdowns
      t.string :longest_rush
      t.integer :first_downs
      t.float :first_downs_percentage
      t.integer :twenty_yards_rushes
      t.integer :fourty_yards_rushes
      t.integer :fumbles

      t.timestamps
    end
  end
end
