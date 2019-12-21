class PlayerMatch < ApplicationRecord
  belongs_to :match
  belongs_to :player_1, :class_name => 'Player'
  belongs_to :player_2, :class_name => 'Player'  

end
