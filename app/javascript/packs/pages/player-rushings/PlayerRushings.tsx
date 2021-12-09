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
    }
  ];
  

  return (
    <div>
      <Table rowKey="player_name" dataSource={playerRushings} columns={columns} />;
    </div>
  )
}
export default PlayerRushings