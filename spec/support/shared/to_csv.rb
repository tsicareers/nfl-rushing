require 'rails_helper'

RSpec.shared_examples 'to csv-able' do
  describe "class.to_csv" do 
    let!(:records) { create_list(described_class.name.underscore.to_sym, 5) }

    it "returns a csv file with headers" do
      csv_string = described_class.all.to_csv

      csv = CSV.parse(csv_string)

      expect(csv[0]).to eq(described_class.column_names)
      expect(csv[1]).to eq(described_class.first.values_at(*described_class.column_names).map(&:to_s))
      expect(csv[5]).to eq(described_class.last.values_at(*described_class.column_names).map(&:to_s))
    end
  end
end