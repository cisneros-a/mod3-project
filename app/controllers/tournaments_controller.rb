class TournamentsController < ApplicationController
  def index
    tournaments = Tournament.all
    render json: tournaments
  end 

  def show
    tournament = Tournament.find(params[:id])
    render json: tournament
  end 

  def create
    @new = Tournament.create(tournament_params)
    puts @new
end

def update
  tournament = Tournament.find(params[:id])
  tournament.update(tournament_params)
end

def tournament_params
  params.require(:tournament).permit(:name, :winner_id)
end
end
