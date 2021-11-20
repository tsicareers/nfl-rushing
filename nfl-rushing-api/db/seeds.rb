all_stats = JSON.parse(File.read(Rails.root.join("db/rushing.json")))

all_stats.each do |stat|
    RushStat.create(
        player: stat["Player"],
        team: stat["Team"],
        pos: stat["Pos"],
        attempts: stat["Att"],
        att_per_game: stat["Att/G"],
        total_rushing_yards: stat["Yds"].to_s,
        avg_yard_attempt: stat["Avg"],
        yds_per_game: stat["Yds/G"],
        rushing_touchdowns: stat["TD"],
        longest_rush: stat["Lng"],
        rushing_first_downs: stat["1st"],
        first_downs_percent: stat["1st%"],
        twenty_plus_rushes: stat["20+"],
        forty_plus_rushes: stat["40+"],
        fumbles: stat["FUM"]
    )
end