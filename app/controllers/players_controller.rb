class PlayersController < ApplicationController
  def index
    players = Player.all
    render json: players
  end 

  def create
    @new = Player.create(player_params)
    puts @new
end

def player_params
  params.require(:player).permit(:username, :cohort)
end
end
