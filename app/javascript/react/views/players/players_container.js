import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchPlayers from '../../store/player/actions/fetch_players';
import SmartTable from './smart_table';

class PlayersContainer extends Component {
  constructor(props) {
    super(props);
    this.handlePageNumberClick = this.handlePageNumberClick.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
    this.state = {
      sort: null,
      sort_dir: null
    }
  }

  componentDidMount() {
    this.props.fetchPlayers();
  }

  handlePageNumberClick(page) {
    const args = { page: page };
    const { sort, sort_dir } = this.state;
    if(sort && sort_dir) {
      args["sort"] = sort
      args["sort_dir"] = sort_dir
    }

    const formValues = this.props.filterForm;
    if(formValues && formValues.values && formValues.values.name) {
      args["name"] = formValues.values.name
    }
    
    this.props.fetchPlayers(args);
  }

  handleSorting(sort, sort_dir) {
    this.setState({ sort })
    this.setState({ sort_dir })
    const args = {};
    if(sort && sort_dir) {
      args["sort"] = sort
      args["sort_dir"] = sort_dir
    }

    const formValues = this.props.filterForm;
    if(formValues && formValues.values && formValues.values.name) {
      args["name"] = formValues.values.name
    }

    this.props.fetchPlayers(args);
  }

  render() {
    const {
      isFetching,
      isError,
      errorMessage,
      players,
      playerMeta
    } = this.props;
    const isEmpty = players.length === 0;

    if (isEmpty && isFetching) {
      return <span>Loading</span>;
    }
    if (isError) {
      return <span>{errorMessage}</span>;
    }
    if (isEmpty) {
      return <div className ="default-div"><h5>No players found with the current applied filters.</h5><h6>Try applying different filters.</h6></div>;
    }
    return (
      <SmartTable
        players={players}
        playerMeta={playerMeta}
        handlePageNumberClick={this.handlePageNumberClick}
        handleSorting={this.handleSorting}
    />
  );
  }
}
function mapStateToProps(state) {
  return {
    players: state.player.all,
    playerMeta: state.player.meta,
    isFetching: state.player.isFetching,
    isError: state.player.isError,
    errorMessage: state.player.errorMessage
  };
}
export default connect(mapStateToProps, { fetchPlayers })(PlayersContainer);