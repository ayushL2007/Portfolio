class RepoDetailsService
  FILE_PATH = Rails.root.join('tmp', 'dynamic_data.json')

  def fetch_data
    # Check if file exists and was updated less than 24 hours ago
    if File.exist?(FILE_PATH) && File.mtime(FILE_PATH) > 24.hours.ago
      return JSON.parse(File.read(FILE_PATH))
    end

    # Otherwise, refresh the content
    refresh_and_save
  end

  def refresh_and_save
    # Your logic to generate the updated hash
    fetch_repos(Rails.application.credentials.dig("GITHUB"))

    updated_hash = {
      last_updated: Time.current,
      tech_stats: { ruby: "active", java: "stable" },
      projects: @repos,
      languages: @l,
      best_repos: @best_repos
    }

    # Write to file
    File.open(FILE_PATH, 'w') do |f|
      f.write(JSON.pretty_generate(updated_hash))
    end

    updated_hash
  end

  private
  def fetch_repos(token)
      # In your Controller or Service Object
      client = Octokit::Client.new(access_token: token)

      puts client.access_token.present?
      # Enable auto-pagination to fetch more than 30 repos
      client.auto_paginate = true

      # Fetch repositories for a specific user
      @repos = client.repos("ayushL2007")

      @l = @repos.map {|r| client.languages(r.full_name)}
      p @l[1]
      trim_description
      arrange_project
      @repos -= @best_repos

      @repos = @repos.map(&:to_hash)
      @best_repos = @best_repos.map(&:to_hash)
      @l = @l.map(&:to_hash)
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

  private
  def arrange_project
      picks = [1130246938, 1134846947, 1019955323]
      @best_repos =  @repos.select {|r| picks.include?(r.id)}
  end
end