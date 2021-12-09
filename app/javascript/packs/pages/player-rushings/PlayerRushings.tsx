import React, { useEffect, useState } from 'react'
import { Table } from 'antd'

const PlayerRushings = () => {
  const [playerRushings, setPlayerRushings] = useState([])

  useEffect(() => {
    fetch('/player_rushings')
      .then(response => response.json())
      .then(setPlayerRushings)
  }, [])
  
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'player_name',
      key: 'name',
    },
    {
      title: 'Position',
      dataIndex: 'player_position',
      key: 'position',
    },
    {
      title: 'Team',
      dataIndex: 'team_name',
      key: 'team',
    },
    {
      title: 'Avg rushing attempts / game',
      dataIndex: 'avg_rushing_attempts_per_game',
      key: 'avg_rushing_attempts_per_game',
    },
    {
      title: 'Rushing attempts',
      dataIndex: 'rushing_attempts',
      key: 'rushing_attempts',
    },
    {
      title: 'Rushing attempts',
      dataIndex: 'rushing_attempts',
      key: 'rushing_attempts',
    },
    {
      title: 'Total rushing yards',
      dataIndex: 'total_rushing_yards',
      key: 'total_rushing_yards',
    },
    {
      title: 'Average yards per attempt',
      dataIndex: 'avg_yards_per_attempt',
      key: 'avg_yards_per_attempt',
    },
    {
      title: 'Yards / game',
      dataIndex: 'yards_per_game',
      key: 'yards_per_game',
    },
    {
      title: 'Longest rush',
      dataIndex: 'longest_rush',
      key: 'longest_rush',
    },
    {
      title: 'Total touchdowns',
      dataIndex: 'total_touchdowns',
      key: 'total_touchdowns',
    },
    {
      title: '1st downs',
      dataIndex: 'first_downs',
      key: 'first_downs',
    },
    {
      title: '1st downs %',
      dataIndex: 'first_downs_percentage',
      key: 'first_downs_percentage',
    },
    {
      title: '20+',
      dataIndex: 'twenty_yards_rushes',
      key: 'twenty_yards_rushes',
    },
    {
      title: '40+',
      dataIndex: 'fourty_yards_rushes',
      key: 'fourty_yards_rushes',
    },
    {
      title: 'Fumbles',
      dataIndex: 'fumbles',
      key: 'fumbles',
    },
  ];
  

  return (
    <div>
      <Table rowKey="player_name" dataSource={playerRushings} columns={columns} />;
    </div>
  )
}
export default PlayerRushings