class RushStat < ApplicationRecord
    def self.search(param)
        RushStat.where('lower(player) LIKE ?', "%#{param.downcase}%")
    end
end
