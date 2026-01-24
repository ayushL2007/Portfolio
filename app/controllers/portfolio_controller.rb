require 'octokit'

class PortfolioController < ApplicationController
    @token = "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"
    def main
        fetch_repos
        @projects = @repos
    end

    private
    def fetch_repos
        # In your Controller or Service Object
        client = Octokit::Client.new(access_token: @token)

        # Enable auto-pagination to fetch more than 30 repos
        client.auto_paginate = true

        # Fetch repositories for a specific user
        @repos = client.repos("ayushL2007")

        p @repos.last.full_name
        @languages = @repos.map {|r| client.languages(r.full_name)}
        p @languages
        trim_description
    end



    private
    def trim_description
        @repos.each do |repo|
            desc = repo.description
            if desc.split.length > 20
                desc = desc.split "."
                desc = desc[0..desc.length-2].join ". "  
            end
            repo.description = desc
        end
    end
end
