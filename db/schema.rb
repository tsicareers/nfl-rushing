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

ActiveRecord::Schema.define(version: 2021_05_13_014802) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "players", force: :cascade do |t|
    t.string "name"
    t.string "team_abv"
    t.string "position"
    t.integer "attempts"
    t.float "attempts_per_game"
    t.integer "rushing_yards"
    t.float "rushing_yards_per_attempt"
    t.float "rushing_yards_per_game"
    t.integer "touchdowns"
    t.integer "longest_rush"
    t.boolean "longest_rush_conclude_in_touchdown"
    t.integer "rushing_first_down"
    t.float "rushing_first_down_percentage"
    t.integer "rushing_20_more"
    t.integer "rushing_40_more"
    t.integer "fumble"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
