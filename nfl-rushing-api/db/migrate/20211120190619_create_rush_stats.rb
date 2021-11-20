class CreateRushStats < ActiveRecord::Migration[6.1]
  def change
    create_table :rush_stats do |t|
      t.string :player
      t.string :team
      t.string :pos
      t.integer :attempts
      t.float :att_per_game
      t.string :total_rushing_yards
      t.float :avg_yard_attempt
      t.float :yds_per_game
      t.integer :rushing_touchdowns
      t.string :longest_rush
      t.integer :rushing_first_downs
      t.float :first_downs_percent
      t.integer :twenty_plus_rushes
      t.integer :forty_plus_rushes
      t.integer :fumbles

      t.timestamps
    end
  end
end
