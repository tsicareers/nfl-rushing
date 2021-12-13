class AddIndexesToPlayerRushing < ActiveRecord::Migration[6.1]
  def change
    add_index :player_rushings, :total_rushing_yards
    add_index :player_rushings, :total_touchdowns
  end
end
