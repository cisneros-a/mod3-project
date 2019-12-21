class PlayerMatchesController < ApplicationController
  def create
    new = PlayerMatch.create(player_1_id:, player_2_id:, match_id: )
    new.save
  end
end