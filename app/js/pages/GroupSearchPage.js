'use strict';

import React            from 'react/addons';
import {ListenerMixin}  from 'reflux';
import _                from 'lodash';

import GroupSearchStore from '../stores/GroupSearchStore';
import SearchActions     from '../actions/SearchActions';
import GroupList        from '../components/GroupList';

var GroupFeedPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    setSearchState: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      results: []
    };
  },

  _onResultsChange(err, results) {
    if ( err ) {
      this.props.setSearchState({
        error: err.message,
        loading: false
      });
      this.props.setError(err.message);
    } else {
      this.setState({
        results: results || []
      }, () => {
        this.props.setSearchState({
          error: null,
          loading: false
        });
      });
    }
  },

  componentDidMount() {
    this.listenTo(GroupSearchStore, this._onResultsChange);

    if ( this.props.query.q ) {
      this.doSearch();
    }
  },

  componentDidUpdate(prevProps) {
    let haveNewQuery = this.props.query.q && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.doSearch();
    }
  },

  doSearch() {
    this.setState({ results: [] }, () => {
      this.props.setSearchState({
        error: null,
        loading: true
      });
      SearchActions.searchGroups(this.props.query.q);
    });
  },

  renderResults() {
    if ( !_.isEmpty(this.state.results) ) {
      return (
        <GroupList groups={this.state.results} cardClassName="pure-u-1-3" />
      );
    }
  },

  render() {
    return (
      <div>

        {this.renderResults()}

      </div>
    );
  }

});

export default GroupFeedPage;