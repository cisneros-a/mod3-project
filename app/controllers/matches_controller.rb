class MatchesController < ApplicationController
  def index
    matches = Match.all
    render json: matches
  end 

  def show
    match = Match.find(params[:id])
    render json: match
  end 

  def create
    @new = Match.create(match_params)
    puts @new
end

def update
  match = Match.find(params[:id])
  match.update(match_params)
end

def match_params
  params.require(:match).permit(:winner_id, :loser_id, :tournament_id, :host_id)
end


end
