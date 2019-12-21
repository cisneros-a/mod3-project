class Player < ApplicationRecord
  has_many :PlayerMatches
  has_many :matches, through: :PlayerMatches
end
