class PlayersController < ApplicationController
  def show
    players = Player.all
  end 
end
