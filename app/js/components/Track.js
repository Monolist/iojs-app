/**
 * @jsx React.DOM
 */
 'use strict';

var React       = require('react/addons');
var Link        = require('react-router').Link;

var CommentList = require('./CommentList');

var Helpers     = require('../utils/Helpers');

var cx    = React.addons.classSet;

var Track = React.createClass({

  propTypes: {
    track: React.PropTypes.object.isRequired,
    isActive: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      isActive: false,
      isUpvoted: false,
      isDownvoted: false
    };
  },

  getInitialState: function() {
    return {
      displayComments: false
    };
  },

  renderDuration: function() {
    var element = null;

    if ( this.props.track.duration ) {
      element = (
        <span className="duration">{Helpers.formatSecondsAsTime(this.props.track.duration)}</span>
      );
    }

    return element;
  },

  renderOptions: function() {
    if ( this.props.type === 'playlist' ) {
      return this.renderParticipantOptions();
    } else if ( this.props.type === 'search' ) {
      return this.renderAddToPlaylist();
    }
  },

  renderParticipantOptions: function() {
    var scoreClasses = cx({
      'score': true,
      'upvoted': this.props.isUpvoted,
      'downvoted': this.props.isDownvoted
    });
    var upvoteClasses = cx({
      'fa': true,
      'fa-chevron-up': true,
      'upvote': true,
      'active': this.props.isUpvoted
    });
    var downvoteClasses = cx({
      'fa': true,
      'fa-chevron-down': true,
      'downvote': true,
      'active': this.props.isDownvoted
    });

    var element = (
      <div className="options-container">
        <div className="upvote-downvote-container">
          <span className={scoreClasses}>{this.props.track.upvotes - this.props.track.downvotes}</span>
          <i className={upvoteClasses}></i>
          <i className={downvoteClasses}></i>
        </div>
        <div className="added-by-container">
          added by <Link to="user" params={{username: 'jakemmarsh'}}>jakemmarsh</Link>
        </div>
      </div>
    );

    return element;
  },

  renderAddToPlaylist: function() {
    var element = (
      <div className="options-container">
        <div className="add-container">
          <i className="fa fa-plus" onClick={this.props.addToPlaylist}></i>
        </div>
      </div>
    );

    return element;
  },

  renderTrackSource: function() {
    var element;
    var elementClasses = 'source ' + this.props.track.source;
    var iconClasses = 'fa fa-' + this.props.track.source;

    if ( this.props.track.source === 'youtube' ) {
      iconClasses += '-play';
    }

    element = (
      <div className={elementClasses}>
        <i className={iconClasses}></i>
      </div>
    );

    return element;
  },

  renderToggleCommentDisplay: function() {
    var element = null;

    if ( this.props.type === 'playlist' ) {
      element = (
        <span onClick={this.toggleCommentDisplay}>Show/Hide Comments</span>
      );
    }

    return element;
  },

  toggleCommentDisplay: function() {
    this.setState({
      displayComments: !this.state.displayComments
    });
  },

  renderTrackComments: function() {
    var element = null;

    if ( this.props.track.comments ) {
      element = (
        <CommentList comments={this.props.track.comments} display={this.state.displayComments} />
      );
    }

    return element;
  },

  render: function() {
    var classes = cx({
      'track': true,
      'active': this.props.isActive
    });

    return (
      <li className={classes}>
        <div className="track-info" onClick={this.props.selectTrack}>
          <div className="artwork-container">
            <img src={this.props.track.image} className="artwork" />
          </div>
          <div className="info-container">
            <h5 className="title">{this.props.track.title} {this.renderDuration()}</h5>
            <h6 className="artist">{this.props.track.artist}</h6>
            {this.renderToggleCommentDisplay()}
          </div>
          {this.renderOptions()}
          {this.renderTrackSource()}
        </div>

        {this.renderTrackComments()}
      </li>
    );
  }

});

module.exports = Track;