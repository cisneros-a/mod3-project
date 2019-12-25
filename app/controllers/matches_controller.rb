class MatchesController < ApplicationController
  def index
    matches = Match.all
    render json: matches
  end 

  def create
    @new = Match.create(match_params)
    puts @new
end

def match_params
  params.require(:match).permit(:winner_id, :loser_id, :tournament_id, :host_id)
end
end
