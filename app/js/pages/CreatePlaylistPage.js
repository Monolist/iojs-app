/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var when                    = require('when');
var _                       = require('lodash');
var $                       = require('jquery');
var Navigation              = require('react-router').Navigation;
var cx                      = React.addons.classSet;

var DocumentTitle           = require('../components/DocumentTitle');
var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');
var PlaylistActions         = require('../actions/PlaylistActions');
var AwsAPI                  = require('../utils/AwsAPI');
var FileInput               = require('../components/FileInput');
var Spinner                 = require('../components/Spinner');

var CreatePlaylistPage = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin, AuthenticatedRouteMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      title: '',
      image: null,
      privacy: 'public',
      focusedInput: null,
      loading: false,
      submitDisabled: true,
      error: null
    };
  },

  componentDidMount: function() {
    var component = this;

    $('#create-playlist-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('#create-playlist-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    if ( this.state.title && this.state.title.length ) {
      this.setState({ submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  },

  updateImage: function(image) {
    this.setState({ image: image });
  },

  createPlaylist: function(playlist) {
    var deferred = when.defer();

    this.setState({ loading: true });

    PlaylistActions.create(playlist, function(err, createdPlaylist) {
      if ( err ) {
        deferred.reject(err);
      } else {
        deferred.resolve(createdPlaylist);
      }
    });

    return deferred.promise;
  },

  uploadImage: function(playlist) {
    var deferred = when.defer();

    if ( this.state.image ) {
      AwsAPI.uploadPlaylistImage(this.state.image, playlist.id).then(function() {
        deferred.resolve(playlist);
      }).catch(function(err) {
        console.log('error uploading playlist image:', err);
        deferred.resolve();
      });
    } else {
      deferred.resolve(playlist);
    }

    return deferred.promise;
  },

  handleSubmit: function(evt) {
    var playlist = {
      title: this.state.title,
      privacy: this.state.privacy
    };

    evt.stopPropagation();
    evt.preventDefault();

    this.createPlaylist(playlist).then(this.uploadImage).then(function(createdPlaylist) {
      this.transitionTo('Playlist', { slug: createdPlaylist.slug });
    }.bind(this)).catch(function(err) {
      this.setState({ loading: false, error: err });
    }.bind(this));
  },

  renderSpinner: function() {
    var element = null;

    if ( this.state.loading ) {
      element = (
        <Spinner size={10} />
      );
    }

    return element;
  },

  render: function() {
    var titleLabelClasses = cx({ 'active': this.state.focusedInput === 'title' });
    var imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    var privacyLabelClasses = cx({ 'active': this.state.focusedInput === 'privacy' });

    return (
      <section className="content create-playlist soft--ends soft-half--sides">

        <DocumentTitle title="Create Playlist" />

        <form id="create-playlist-form" className="full-page" onSubmit={this.handleSubmit}>

          <div className="input-container">
            <label htmlFor="title" className={titleLabelClasses}>Title</label>
            <div className="input">
              <input type="text" id="title" valueLink={this.linkState('title')} placeholder="Title" required />
            </div>
          </div>

          <div className="input-container">
            <label htmlFor="image-url" className={imageLabelClasses}>Cover Image</label>
            <div className="input">
              <FileInput id="image-url" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />
            </div>
          </div>

          <div className="input-container">
            <label htmlFor="privacy" className={privacyLabelClasses}>Privacy</label>
            <div className="input">
              <select id="privacy" valueLink={this.linkState('privacy')} required>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div>
            <div />
            <div className="error-container">{this.state.error}</div>
          </div>

          <div>
            <div>{this.renderSpinner()}</div>
            <div className="submit-container">
              <input type="submit" className="btn full" value="Create Playlist" disabled={this.state.submitDisabled ? 'true' : ''} />
            </div>
          </div>

        </form>

      </section>
    );
  }

});

module.exports = React.createFactory(CreatePlaylistPage);