rushings = JSON.parse(File.read('rushing.json'))

Player.destroy_all

rushings.each do |params|
  longest_rush_conclude_in_touchdown = params['Lng'].instance_of?(String) && params['Lng'][-1] == 'T'

  rushing = {
    'name' => params['Player'],
    'team_abv' => params['Team'],
    'position' => params['Pos'],
    'attempts' => params['Att'],
    'attempts_per_game' => params['Att/G'],
    'rushing_yards' => params['Yds'].instance_of?(String) ? params['Yds'].delete(',').to_i : params['Yds'],
    'rushing_yards_per_attempt' => params['Avg'],
    'rushing_yards_per_game' => params['Yds/G'],
    'touchdowns' => params['TD'],
    'longest_rush' => longest_rush_conclude_in_touchdown ? params['Lng'][0...-1].to_i : params['Lng'].to_i,
    'longest_rush_conclude_in_touchdown' => longest_rush_conclude_in_touchdown,
    'rushing_first_down' => params['1st'],
    'rushing_first_down_percentage' => params['1st%'],
    'rushing_20_more' => params['20+'],
    'rushing_40_more' => params['40+'],
    'fumble' => params['FUM'],
  }

  player = Player.create(rushing)
end
