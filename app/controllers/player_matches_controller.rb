class PlayerMatchesController < ApplicationController
  def index
    playerMatches = PlayerMatch.all
    render json: playerMatches, include: [ :player_1, :player_2, :match]
  end 

  def create
    @new = PlayerMatch.create(playerMatch_params)
    puts @new
  end

def playerMatch_params
  params.require(:player_match).permit(:player_1_id, :player_2_id, :match_id)
end
end