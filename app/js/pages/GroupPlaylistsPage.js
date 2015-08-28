'use strict';

import React        from 'react/addons';
import _            from 'lodash';

import PlaylistList from '../components/PlaylistList';

var GroupPlaylistsPage = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired,
    playlists: React.PropTypes.array.isRequired
  },

  renderPlaylists() {
    if ( !_.isEmpty(this.props.playlists) ) {
      return (
        <PlaylistList playlists={this.props.playlists} cardClassName="pure-u-1-3" />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">This group has not made any playlists yet!</h4>
      );
    }
  },

  render() {
    return (
      <div>

        {this.renderPlaylists()}

      </div>
    );
  }

});

export default GroupPlaylistsPage;