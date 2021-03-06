/* global FB */
'use strict';

import React                      from 'react';
import _                          from 'lodash';
import {ListenerMixin}            from 'reflux';

import UserActions                from './actions/UserActions';
import GlobalActions              from './actions/GlobalActions';
import CurrentUserStore           from './stores/CurrentUserStore';
import UserEditablePlaylistsStore from './stores/UserEditablePlaylistsStore';
import UserLikesStore             from './stores/UserLikesStore';
import UserGroupsStore            from './stores/UserGroupsStore';

const GlobalApp = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object
  },

  getInitialState() {
    return {
      currentUser: {},
      userCollaborations: [],
      userLikes: []
    };
  },

  _initFb() {
    if ( typeof FB !== 'undefined' ) {
      FB.init({
        appId: '1096019800427148',
        xfbml: true,
        version: 'v2.2'
      });
    }
  },

  _onUserChange(err, user) {
    if ( err ) {
      this.setState({ error: err });
    } else if ( !_.isEqual(this.state.currentUser, user) ) {
      this.setState({ currentUser: user }, () => {
        if ( !_.isEmpty(this.state.currentUser) ) {
          GlobalActions.loadUserEditablePlaylists();
          GlobalActions.loadUserLikes();
          GlobalActions.loadUserGroups();
        }
      });
    }
  },

  _onUserEditablePlaylistsChange(err, userCollaborations) {
    this.setState({ userCollaborations: userCollaborations });
  },

  _onUserLikesChange(userLikes) {
    this.setState({ userLikes: userLikes });
  },

  _onUserGroupsChange(err, userGroups) {
    this.setState({ userGroups: userGroups || [] });
  },

  componentWillMount() {
    this._initFb();
  },

  componentDidMount() {
    if ( !_.isEmpty(CurrentUserStore.user) ) {
      this._onUserChange(null, CurrentUserStore.user);
    } else {
      UserActions.check(this._onUserChange);
    }

    this.listenTo(CurrentUserStore, this._onUserChange);
    this.listenTo(UserEditablePlaylistsStore, this._onUserEditablePlaylistsChange);
    this.listenTo(UserLikesStore, this._onUserLikesChange);
    this.listenTo(UserGroupsStore, this._onUserGroupsChange);
  },

  renderChildren() {
    return this.props.children && React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.location.query,
      currentUser: this.state.currentUser,
      userCollaborations: this.state.userCollaborations,
      userGroups: this.state.userGroups,
      userLikes: this.state.userLikes
    });
  },

  render() {
    return (
      <div className="h-1-1">
        {this.renderChildren()}
      </div>
    );
  }

});

export default GlobalApp;
