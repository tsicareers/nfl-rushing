require 'rails_helper'

RSpec.describe PlayerRushing, type: :model do
  describe ".longest_rush_distance" do
    context "when the rush distance is not touchdown" do
      let(:player_rushing) { create(:player_rushing) }

      it "returns the longest rush cast to a number" do
        expect(player_rushing.longest_rush_distance).to eq(
          player_rushing.longest_rush.to_i
        )
      end
    end

    context "when the rush distance is a touchdown" do
      let(:player_rushing) { create(:player_rushing, :longest_rush_touchdown) }

      it "returns the number without the 'T' suffix" do
        expect(player_rushing.longest_rush_distance).to eq(
          player_rushing.longest_rush[0..-1].to_i
        )
      end
    end
  end

  describe ".longest_rush_is_touchdown?" do
    context "when the rush distance is not touchdown" do
      let(:player_rushing) { create(:player_rushing) }

      it { expect(player_rushing.longest_rush_is_touchdown?).to be false }
    end

    context "when the rush distance is a touchdown" do
      let(:player_rushing) { create(:player_rushing, :longest_rush_touchdown) }

      it { expect(player_rushing.longest_rush_is_touchdown?).to be true }
    end
  end

  describe "class.order_by_numeric_longest_rush" do
    let!(:player_rushings) do 
      [
        create(:player_rushing, longest_rush: '5T'),
        create(:player_rushing, longest_rush: '4'),
        create(:player_rushing, longest_rush: '4T'),
        create(:player_rushing, longest_rush: '4'),
        create(:player_rushing, longest_rush: '4'),
        create(:player_rushing, longest_rush: '4T'),
        create(:player_rushing, longest_rush: '6T'),
        create(:player_rushing, longest_rush: '1')
      ]
    end

    it "returns player rushings sorted only by the numbers in longest_rush" do
      expect(PlayerRushing.order_by_numeric_longest_rush).to eq(
        PlayerRushing.all.sort_by { |p| [p.longest_rush_distance, p.longest_rush, p.id] }
      )
    end

    context "when receives param to order ascending" do 
      it "orders by the numbers in longest rush ascending" do
        expect(PlayerRushing.order_by_numeric_longest_rush(:asc)).to eq(
          PlayerRushing.all.sort_by { |p| [p.longest_rush_distance, p.longest_rush, p.id] }
        )
      end
    end

    context "when receives param to order descending" do 
      it "orders by the numbers in longest rush descending" do
        expect(PlayerRushing.order_by_numeric_longest_rush(:desc)).to eq(
          PlayerRushing.all.sort_by { |p| [p.longest_rush_distance, p.longest_rush, p.id] }.reverse
        )
      end
    end
  end
end
