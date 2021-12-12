require 'csv'

module ToCsvAbleConcern
  extend ActiveSupport::Concern

  included do
    def self.to_csv
      attributes = column_names
  
      CSV.generate('', headers: true) do |csv|
        csv << attributes
  
        all.each_slice(100) do |batch| 
          batch.each do |pr|
            csv << pr.attributes.values_at(*attributes)
          end
        end
      end
    end
  end
end