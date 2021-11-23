require "csv"

class RushStat < ApplicationRecord
    def self.search(param)
        RushStat.where('lower(player) LIKE ?', "%#{param.downcase}%")
    end

    def self.to_csv(collection)
        attributes = self.attribute_names

        CSV.generate(headers: true) do |csv|
            csv << attributes

            collection.each do |stat|
                csv << attributes.map{ |attr| stat.send(attr) }
            end
        end
    end
end
