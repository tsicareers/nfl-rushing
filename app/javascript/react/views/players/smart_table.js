import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactPaginate from 'react-paginate';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

// The user should be able to sort the players by Total Rushing Yards, Longest Rush and Total Rushing Touchdowns
const headCells = [
  { id: 'name', label: 'Name', tooltip: 'Player\'s name', isSortable: false },
  { id: 'team_abv', label: 'Team', tooltip: 'Player\'s team abbreviation', isSortable: false },
  { id: 'position', label: 'Pos', tooltip: 'Player\'s postion', isSortable: false },
  { id: 'attempts_per_game', label: 'Att/G', tooltip: 'Rushing Attempts Per Game Average', isSortable: false },
  { id: 'attempts', label: 'Att', tooltip: 'Rushing Attempts', isSortable: false },
  { id: 'rushing_yards', label: 'Yds', tooltip: 'Total Rushing Yards', isSortable: true },
  { id: 'rushing_yards_per_attempt', label: 'Avg', tooltip: 'Rushing Average Yards Per Attempt', isSortable: false },
  { id: 'rushing_yards_per_game', label: 'Yds/G', tooltip: 'Rushing Yards Per Game', isSortable: false },
  { id: 'touchdowns', label: 'TD', tooltip: 'Total Rushing Touchdowns', isSortable: true },
  { id: 'longest_rush', label: 'Lng', tooltip: 'Longest Rush -- a T represents a touchdown occurred', isSortable: true },
  { id: 'rushing_first_down', label: '1st', tooltip: 'Rushing First Downs', isSortable: false },
  { id: 'rushing_first_down_percentage', label: '1st%', tooltip: 'Rushing First Down Percentage', isSortable: false },
  { id: 'rushing_20_more', label: '20+', tooltip: 'Rushing 20+ Yards Each', isSortable: false },
  { id: 'rushing_40_more', label: '40+', tooltip: 'Rushing 40+ Yards Each', isSortable: false },
  { id: 'fumble', label: 'FUM', tooltip: 'Rushing Fumbles', isSortable: false },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={`${headCell.id}-${index}`}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.isSortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <Tooltip title={headCell.tooltip} arrow>
                  <span>{headCell.label}</span>
                </Tooltip>
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              <Tooltip title={headCell.tooltip} arrow>
                <span>{headCell.label}</span>
              </Tooltip>
              )}

          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const SmartTable = props => {
  const { players, playerMeta, handleSorting, handlePageNumberClick } = props;
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('created_at');

  const handleSortRequest = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    handleSorting(property, isAsc ? 'desc' : 'asc');
  };

  const pageCount = Math.ceil(playerMeta.total_count / playerMeta.per);

  const handlePageClick = data => {
    let selected = data.selected;
    handlePageNumberClick(selected + 1);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleSortRequest}
            />
            <TableBody>
              {players.map(player => {
                return (
                  <TableRow
                    hover
                    key={player.id}
                  >
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.team_abv}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.attempts_per_game}</TableCell>
                    <TableCell>{player.attempts}</TableCell>
                    <TableCell>{player.rushing_yards}</TableCell>
                    <TableCell>{player.rushing_yards_per_attempt}</TableCell>
                    <TableCell>{player.rushing_yards_per_game}</TableCell>
                    <TableCell>{player.touchdowns}</TableCell>
                    <TableCell>{player.longest_rush}{player.longest_rush_conclude_in_touchdown ? "T" : ""}</TableCell>
                    <TableCell>{player.rushing_first_down}</TableCell>
                    <TableCell>{player.rushing_first_down_percentage}</TableCell>
                    <TableCell>{player.rushing_20_more}</TableCell>
                    <TableCell>{player.rushing_40_more}</TableCell>
                    <TableCell>{player.fumble}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
        <span className='paginationTotalCount'>Total {playerMeta.total_count}</span>
      </Paper>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  }
}));

export default SmartTable;