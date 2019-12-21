class PlayerMatchesController < ApplicationController
  def index
    playerMatches = PlayerMatch.all
    render json: playerMatches, include: [ :player_1, :player_2, :match]
  end 
end