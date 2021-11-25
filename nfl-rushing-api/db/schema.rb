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

ActiveRecord::Schema.define(version: 2021_11_20_190619) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "rush_stats", force: :cascade do |t|
    t.string "player"
    t.string "team"
    t.string "pos"
    t.integer "attempts"
    t.float "att_per_game"
    t.string "total_rushing_yards"
    t.float "avg_yard_attempt"
    t.float "yds_per_game"
    t.integer "rushing_touchdowns"
    t.string "longest_rush"
    t.integer "rushing_first_downs"
    t.float "first_downs_percent"
    t.integer "twenty_plus_rushes"
    t.integer "forty_plus_rushes"
    t.integer "fumbles"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
