import React from 'react';

import PlayersContainer from './players_container';
import FilterTable from './filter_table_container';

const Players = props => {
  return (
    <div>
      <h4>NFL players rushing statistics</h4>
      <FilterTable />
      <PlayersContainer />
    </div>
  );
}
export default Players;