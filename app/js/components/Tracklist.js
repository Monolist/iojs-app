'use strict';

import React    from 'react';
import _        from 'lodash';
import cx       from 'classnames';

import Track    from './Track';

const Tracklist = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userIsCreator: React.PropTypes.bool,
    userIsCollaborator: React.PropTypes.bool,
    playlist: React.PropTypes.object,
    type: React.PropTypes.string,
    currentTrack: React.PropTypes.object,
    filter: React.PropTypes.string,
    isUpvoted: React.PropTypes.bool,
    isDownvoted: React.PropTypes.bool,
    addToPlaylist: React.PropTypes.func,
    sortPlaylist: React.PropTypes.func,
    selectTrack: React.PropTypes.func,
    upvoteTrack: React.PropTypes.func,
    downvoteTrack: React.PropTypes.func,
    userCollaborations: React.PropTypes.array,
    removeTrackFromPlaylist: React.PropTypes.func,
    sortAttribute: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      currentUser: {},
      userIsCreator: false,
      userIsCollaborator: false,
      playlist: {},
      filter: '',
      sortAttribute: 'createdAt'
    };
  },

  componentDidUpdate(prevProps) {
    const hasPlaylist = this.props.type === 'playlist' && this.props.playlist.tracks;
    const isNewPlaylist = !_.isEqual(this.props.playlist, prevProps.playlist);
    const isNewSortAttribute = this.props.sortAttribute !== prevProps.sortAttribute;

    if ( hasPlaylist && (isNewPlaylist || isNewSortAttribute) ) {
      this.props.sortPlaylist(this.props.sortAttribute);
    }
  },

  filterTracks(tracks, query) {
    let regex = new RegExp(query, 'i');

    return _.filter(tracks, function(track) {
      return regex.test(track.title) || regex.test(track.artist);
    });
  },

  trackIsActive(track) {
    return this.props.currentTrack && this.props.currentTrack.sourceParam === track.sourceParam;
  },

  createTrackElement(track, index) {
    return (
      <Track type={this.props.type}
             track={track}
             index={index}
             currentUser={this.props.currentUser}
             userIsCreator={this.props.userIsCreator}
             userIsCollaborator={this.props.userIsCollaborator}
             isActive={this.trackIsActive(track)}
             playlist={this.props.playlist}
             userCollaborations={this.props.userCollaborations}
             removeTrackFromPlaylist={this.props.removeTrackFromPlaylist}
             key={index} />
    );
  },

  renderTracks() {
    const filteredTracks = this.filterTracks(this.props.playlist.tracks, this.props.filter);

    if ( filteredTracks ) {
      return _.map(filteredTracks, this.createTrackElement);
    }
  },

  render() {
    const classes = cx({
      'tracklist': true,
      'has-control-bar': this.props.type === 'playlist'
    });

    return (
      <ul className={classes}>
        {this.renderTracks()}
      </ul>
    );
  }

});

export default Tracklist;
