class PlayerRushing < ApplicationRecord
  include ToCsvAbleConcern
  
  scope :search, ->(term) {
    where('lower(player_name) LIKE ?', "%#{term.downcase}%")
  }

  scope :order_by_numeric_longest_rush, ->(order_by = :asc) {
    safe_ordering = if [:asc, :desc].include?(order_by)
      order_by
    else 
      :asc
    end

    order(Arel.sql("(regexp_replace(longest_rush, '\\D*','','g')::numeric) #{safe_ordering}, longest_rush #{safe_ordering}, id #{safe_ordering}"))
  }

  def longest_rush_distance
    return longest_rush.to_i unless longest_rush_is_touchdown?
    
    longest_rush[0..-1].to_i
  end

  def longest_rush_is_touchdown?
    longest_rush.last == "T"
  end
end
