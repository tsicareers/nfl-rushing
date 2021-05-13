class CreatePlayers < ActiveRecord::Migration[6.1]
  def change
    create_table :players do |t|
      t.string :name
      t.string :team_abv
      t.string :position
      t.integer :attempts
      t.float :attempts_per_game
      t.integer :rushing_yards
      t.float :rushing_yards_per_attempt
      t.float :rushing_yards_per_game
      t.integer :touchdowns
      t.integer :longest_rush
      t.boolean :longest_rush_conclude_in_touchdown
      t.integer :rushing_first_down
      t.float :rushing_first_down_percentage
      t.integer :rushing_20_more
      t.integer :rushing_40_more
      t.integer :fumble

      t.timestamps
    end
  end
end
