import React, { useEffect, useState } from 'react'
import { Table, Alert, Input, Button, Radio } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';

const { Search } = Input

const PlayerRushings = () => {
  const [error, setError] = useState(null)
  const [playerRushings, setPlayerRushings] = useState([])
  const [searchString, setSearchString] = useState('')
  const [sortBy, setSortBy] = useState(null)
  const [orderBy, setOrderBy] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const buildQueryString = () => {
    const params: any = {}

    if(page) {
      params.page = page.toString()
    }

    if(searchString) {
      params.search = searchString
    }

    if(sortBy) {
      params.sort_by = sortBy
      params.order_by = orderBy
    }

    const queryParams = new URLSearchParams(params)
    return `?${queryParams.toString()}`

  }

  useEffect(() => {
    setLoading(true)
    fetch(`/player_rushings${buildQueryString()}`)
      .then(response => response.json())
      .then(response => {
        setPlayerRushings(response.data)
        setTotalResults(response.pagination.total_hits)
        setPage(Number(response.pagination.current_page))
      })
      .then(() => setLoading(false))
      .catch((error) => {
        setLoading(false)
        setError(error)
      })
  }, [searchString, sortBy, orderBy, page])

  const onChange = (page, filters, sorter) => {
    setPage(page.current)
    setSortBy(sorter.field)
    setOrderBy(sorter.order === 'ascend' ? 'asc' : 'desc')
  }

  const downloadCsv = () => {
    fetch(`/player_rushings.csv${buildQueryString()}`, {
      headers: {
        'Content-Type': 'text/csv'
      }
    }).then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "player_rushings.csv";
        document.body.appendChild(a);
        a.click()
        window.URL.revokeObjectURL(url);
        a.remove();      
    });
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
      <Table loading={loading} size="small" pagination={{total: totalResults, pageSize: 20}} onChange={onChange} rowKey="player_name" dataSource={playerRushings} columns={columns} />
      <Button onClick={() => downloadCsv()} role="button" type="primary" icon={<DownloadOutlined />} size="large">
        CSV
      </Button>
    </div>
  )
}
export default PlayerRushings