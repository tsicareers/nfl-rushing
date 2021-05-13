require 'csv'

class Player < ApplicationRecord
  validates :name, presence: true

  def self.search(search)
    if search
      q = "%#{search}%"
      where('lower(name) LIKE ?', q.downcase)
    else
      scoped
    end
  end

  def self.to_csv
    attributes = %w{name team_abv position attempts attempts_per_game rushing_yards rushing_yards_per_attempt rushing_yards_per_game touchdowns longest_rush rushing_first_down rushing_first_down_percentage rushing_20_more rushing_40_more fumble}

    CSV.generate(headers: true) do |csv|
      csv << attributes

      all.each do |user|
        csv << attributes.map do |attr|
          if attr == 'longest_rush'
            longest_rush_conclude_in_touchdown_label = user.longest_rush_conclude_in_touchdown ? "T" : ""
            "#{user.longest_rush}#{longest_rush_conclude_in_touchdown_label}"
          else
            user.send(attr)
          end
        end
      end
    end
  end
end
