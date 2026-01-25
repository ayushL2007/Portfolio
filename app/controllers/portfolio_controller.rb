require 'octokit'

class PortfolioController < ApplicationController
    def main
        client = RepoDetailsService.new
        data = client.fetch_data

        @projects = data["projects"]
        @languages = data["languages"]
        @best_repos = data["best_repos"]
        @experiences = experiences
    end


    def resume
        pdf_path = Rails.root.join('app', 'assets','documents', 'resume_ayush.pdf')
        send_file(pdf_path, filename: "Resume_Ayush_Lahiri.pdf", type: "application/pdf", disposition: "inline")  
    end

    private
    def experiences
        roles = [
            { role: "App Dev Lead", company: "Google Developer Group IIITK", date: "2025 - Present", desc: "Built scalable Native Android App and conduct sessions for android devs." },
            {role: "Team Lead", company: "IronLegions Team", date: "Nov, 2025 - Jan, 2026", desc: "Lead Ironlegions team to semi's in ImagineCup building course-craft"},
            {role: "Team Lead", company: "IronLegions Team", date: "Dec, 2025 - Jan, 2026", desc: "Lead Ironlegions team to Top 10 in InnovateX building Signetic"}
        ]

        return roles
    end


end
