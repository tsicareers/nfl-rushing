# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_12_09_162649) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "player_rushings", force: :cascade do |t|
    t.string "player_name"
    t.string "team_name"
    t.string "player_position"
    t.float "avg_rushing_attempts_per_game"
    t.integer "rushing_attempts"
    t.integer "total_rushing_yards"
    t.float "avg_yards_per_attempt"
    t.float "yards_per_game"
    t.integer "total_touchdowns"
    t.string "longest_rush"
    t.integer "first_downs"
    t.float "first_downs_percentage"
    t.integer "twenty_yards_rushes"
    t.integer "fourty_yards_rushes"
    t.integer "fumbles"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
