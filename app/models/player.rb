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
end
