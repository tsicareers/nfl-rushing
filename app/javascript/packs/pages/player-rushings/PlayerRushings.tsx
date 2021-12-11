import React, { useEffect, useState } from 'react'
import { Table, Alert, Input } from 'antd'

const { Search } = Input

const PlayerRushings = () => {
  const [error, setError] = useState(null)
  const [playerRushings, setPlayerRushings] = useState([])
  const [searchString, setSearchString] = useState('')
  const [sortBy, setSortBy] = useState(null)
  const [orderBy, setOrderBy] = useState(null)

  useEffect(() => {
    let queryString = '?'

    if(searchString) {
      const queryParams = new URLSearchParams({
        search: searchString
      })
      queryString += `${queryParams.toString()}`
    }

    if(sortBy) {
      const queryParams = new URLSearchParams({
        sort_by: sortBy,
        order_by: orderBy
      })
      queryString += `${queryParams.toString()}`
    }
    

    fetch(`/player_rushings${queryString}`)
      .then(response => response.json())
      .then(setPlayerRushings)
      .catch(setError)
  }, [searchString, sortBy, orderBy])

  const onChange = (page, filters, sorter) => {
    setSortBy(sorter.field)
    setOrderBy(sorter.order === 'ascend' ? 'asc' : 'desc')
  }
  
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
      sorter: true
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
      sorter: true
    },
    {
      title: 'Total touchdowns',
      dataIndex: 'total_touchdowns',
      key: 'total_touchdowns',
      sorter: true
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
    }
  ]
  

  return (
    <div>
      {error && <Alert
        type="error"
        message={'Oops! Something wrong happened!'} 
        description={error?.message || "We couldn't find out what went wrong. Please contact our support team!"} />}
      <Search role="searchbox" placeholder="Search by player name" onSearch={setSearchString} style={{ width: '100%' }} />
      <Table onChange={onChange} rowKey="player_name" dataSource={playerRushings} columns={columns} />
    </div>
  )
}
export default PlayerRushings