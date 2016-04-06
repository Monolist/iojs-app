'use strict';

import React                from 'react';
import LinkedStateMixin     from 'react-addons-linked-state-mixin';
import {ListenerMixin}      from 'reflux';
import _                    from 'lodash';
import cx                   from 'classnames';

import GroupActions         from '../actions/GroupActions';
import UserSearchModalMixin from '../mixins/UserSearchModalMixin';
import EditGroupModalMixin  from '../mixins/EditGroupModalMixin';
import PermissionsHelpers   from '../utils/PermissionsHelpers';
import TagList              from './TagList';

const GroupSubheader = React.createClass({

  mixins: [LinkedStateMixin, ListenerMixin, UserSearchModalMixin, EditGroupModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    group: React.PropTypes.object,
    getUserLevel: React.PropTypes.func,
    isUserSelected: React.PropTypes.func,
    selectUser: React.PropTypes.func,
    deselectUser: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {},
      group: {},
      isUserSelected: function() {},
      selectUser: function() {},
      deselectUser: function() {},
      getUserLevel: function() {}
    };
  },

  getInitialState() {
    return {
      currentUserIsMember: false,
      currentUserDoesFollow: false
    };
  },

  // for UserSearchModalMixin
  isUserSelected(user) { return this.props.isUserSelected(user); },
  selectUser(user) { return this.props.selectUser(user); },
  deselectUser(user) { return this.props.deselectUser(user); },

  componentWillReceiveProps(nextProps) {
    const hasNewGroup = !_.isEmpty(nextProps.group) && !_.isEqual(this.props.group, nextProps.group);
    const hasNewUser = !_.isEmpty(nextProps.currentUser) && !_.isEqual(this.props.currentUser, nextProps.currentUser);

    if ( hasNewGroup || hasNewUser ) {
      this.setState({
        currentUserIsMember: _.some(nextProps.group.members, { id: nextProps.currentUser.id }),
        currentUserDoesFollow: _.some(nextProps.group.followers, { userId: nextProps.currentUser.id })
      });
    }
  },

  setPrivacyLevel(newPrivacyLevel) {
    GroupActions.update(this.props.group.id, {
      privacy: newPrivacyLevel
    });
  },

  toggleGroupMembership() {
    this.setState({ currentUserIsMember: !this.state.currentUserIsMember }, () => {
      if ( this.state.currentUserIsMember ) {
        GroupActions.addMember(this.props.group.id, this.props.currentUser);
      } else {
        GroupActions.removeMember(this.props.group.id, this.props.currentUser);
      }
    });
  },

  toggleFollowGroup() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow }, GroupActions.follow.bind(null, this.props.group.id));
  },

  renderGroupImage() {
    if ( this.props.group.imageUrl ) {
      const imageStyles = {
        backgroundImage: `url(${this.props.group.imageUrl})`
      };

      return (
        <div className="entity-subheader-image-container">
          <div className="entity-subheader-image" style={imageStyles} />
        </div>
      );
    }
  },

  renderGroupDescription() {
    if ( this.props.group.description ) {
      return (
        <p className="entity-subheader-description">
          {this.props.group.description}
        </p>
      );
    }
  },

  renderJoinLeaveButton() {
    const shouldDisplay = !PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser) && (this.props.group.privacy !== 'private' || this.state.currentUserIsMember);
    const buttonText = this.state.currentUserIsMember ? 'Leave' : 'Join';
    const classes = cx({
      'action-button': true,
      'join-leave-button': true,
      'half-width': true,
      'inactive': this.state.currentUserIsMember
    });

    if ( !_.isEmpty(this.props.currentUser) && !_.isEmpty(this.props.group) && shouldDisplay ) {
      return (
        <div ref="joinLeaveButton" className={classes} onClick={this.toggleGroupMembership}>
          {buttonText}
        </div>
      );
    }
  },

  renderFollowButton() {
    const buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    const classes = cx({
      'action-button': true,
      'follow-button': true,
      'half-width': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.currentUser) && !this.state.currentUserIsMember ) {
      return (
        <div ref="followButton" className={classes} onClick={this.toggleFollowGroup}>
          {buttonText}
        </div>
      );
    }
  },

  renderManageMembersButton() {
    const userIsMember = this.props.isUserSelected(this.props.currentUser);
    const groupInviteLevel = this.props.group.inviteLevel;
    const userLevel = this.props.getUserLevel(this.props.currentUser);

    if ( userIsMember && userLevel >= groupInviteLevel && !_.isEmpty(this.props.group) ) {
      return (
        <div ref="manageMembersButton" className="action-buttons-container">
          <div className="action-button" onClick={this.openUserSearchModal.bind(null, this.props.group.members)}>
            Add/Remove Members
          </div>
        </div>
      );
    }
  },

  renderEditButton() {
    if ( PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser) ) {
      return (
        <a href={null} onClick={this.openEditGroupModal.bind(null, this.props.group)} className="epsilon edit-link">
          <i className="icon-cog" />
        </a>
      );
    }
  },

  render() {
    const privacyIconClasses = cx({
      'icon-globe': this.props.group.privacy === 'public',
      'icon-lock': this.props.group.privacy === 'private'
    });
    const imageStyle = {};

    if ( this.props.group.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.group.imageUrl + ')';
    }

    return (
      <div className="entity-subheader group-subheader">

        {this.renderGroupImage()}

        <div className="entity-subheader-info-container">
          <h1 className="entity-subheader-title">{this.props.group.title}</h1>
          {this.renderGroupDescription()}
        </div>

        <div className="entity-subheader-actions-container text-right">
          Group Action Buttons
        </div>

      </div>
    );
  }

});

export default GroupSubheader;