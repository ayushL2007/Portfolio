require 'octokit'

class PortfolioController < ApplicationController
    def main
        client = RepoDetailsService.new
        data = client.fetch_data

        p data

        @projects = data["projects"]
        @languages = data["languages"]
        @best_repos = data["best_repos"]
    end


end
