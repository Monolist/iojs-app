'use strict';

import React            from 'react';
import _                from 'lodash';
import {History}        from 'react-router';
import DocumentTitle    from 'react-document-title';
import lscache          from 'lscache';

import Helpers          from '../utils/Helpers';
import PageControlBar   from '../components/PageControlBar';
import SearchBar        from '../components/SearchBar';
import TabBar           from '../components/TabBar';
import ListLink         from '../components/ListLink';

const SearchPage = React.createClass({

  mixins: [History],

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    location: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    userLikes: React.PropTypes.array
  },

  getInitialState() {
    if ( this.props.location.query.sources ) {
      this.sources = this.props.location.query.sources.split(',');
    } else if ( lscache.get('trackSearchSources') ) {
      this.sources = lscache.get('trackSearchSources').split(',');
    } else {
      this.sources = ['audiomack', 'bandcamp', 'soundcloud', 'youtube'];
    }

    return {
      query: this.props.location.query.q ? this.props.location.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      searchAudiomack: _.indexOf(this.sources, 'audiomack') !== -1,
      searchBandcamp: _.indexOf(this.sources, 'bandcamp') !== -1,
      searchSoundCloud: _.indexOf(this.sources, 'soundcloud') !== -1,
      searchYouTube: _.indexOf(this.sources, 'youtube') !== -1,
      loading: false
    };
  },

  componentDidUpdate(prevProps) {
    const haveNewQuery = this.props.location.query.q && this.props.location.query.q.length && prevProps.location.query.q !== this.props.location.query.q;

    if ( haveNewQuery ) {
      this.setState({ query: this.props.location.query.q });
    }
  },

  getSearchPlaceholder() {
    let placeholder = 'Search...';

    if ( this.history.isActive('/search/tracks') ) {
      placeholder = 'Justin Bieber Where Are U Now';
    } else if ( this.history.isActive('/search/playlists') ) {
      placeholder = 'Summer Mix';
    } else if ( this.history.isActive('/search/groups') ) {
      placeholder = 'Local Hip Hop';
    }

    return placeholder;
  },

  setSearchState(state = {}) {
    this.setState({
      error: state.error || null,
      loading: state.loading || false
    }, () => {
      if ( !this.state.loading ) {
        this.refs.SearchBar.refs.input.focus();
      }
    });
  },

  toggleAudiomack() {
    this.setState({
      searchAudiomack: !this.state.searchAudiomack
    }, () => {
      if ( this.state.searchAudiomack ) {
        this.sources.push('audiomack');
      } else {
        this.sources = _.without(this.sources, 'audiomack');
      }

      lscache.set('trackSearchSources', this.sources.join(','));
      this.reloadPage();
    });
  },

  toggleBandcamp() {
    this.setState({
      searchBandcamp: !this.state.searchBandcamp
    }, () => {
      if ( this.state.searchBandcamp ) {
        this.sources.push('bandcamp');
      } else {
        this.sources = _.without(this.sources, 'bandcamp');
      }

      lscache.set('trackSearchSources', this.sources.join(','));
      this.reloadPage();
    });
  },

  toggleSoundCloud() {
    this.setState({
      searchSoundCloud: !this.state.searchSoundCloud
    }, () => {
      if ( this.state.searchSoundCloud ) {
        this.sources.push('soundcloud');
      } else {
        this.sources = _.without(this.sources, 'soundcloud');
      }

      lscache.set('trackSearchSources', this.sources.join(','));
      this.reloadPage();
    });
  },

  toggleYouTube() {
    this.setState({
      searchYouTube: !this.state.searchYouTube
    }, () => {
      if ( this.state.searchYouTube ) {
        this.sources.push('youtube');
      } else {
        this.sources = _.without(this.sources, 'youtube');
      }

      lscache.set('trackSearchSources', this.sources.join(','));
      this.reloadPage();
    });
  },

  handleQueryChange(evt) {
    this.setState({
      query: evt.target.value
    });
  },

  handleKeyPress(evt) {
    const keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage(query = {}) {
    if ( !this.state.loading ) {
      _.assign(query, {
        q: this.state.query,
        sources: this.sources.join(','),
        playlist: this.props.location.query.playlist
      });

      if ( !this.history.isActive('/search/tracks') ) {
        delete query.sources;
      }

      if ( this.state.query ) {
        this.history.pushState(null, window.location.pathname, query);
      }
    }
  },

  renderTrackSearchOptions() {
    if ( this.history.isActive('/search/tracks') ) {
      return (
        <ul>
          <li>
            <input type="checkbox"
                   id="audiomack"
                   checked={this.state.searchAudiomack}
                   onChange={this.toggleAudiomack} />
            <label htmlFor="audiomack">Audiomack</label>
          </li>
          <li>
            <input type="checkbox"
                   id="bandcamp"
                   checked={this.state.searchBandcamp}
                   onChange={this.toggleBandcamp} />
            <label htmlFor="bandcamp">Bandcamp</label>
          </li>
          <li>
            <input type="checkbox"
                   id="soundcloud"
                   checked={this.state.searchSoundCloud}
                   onChange={this.toggleSoundCloud} />
            <label htmlFor="soundcloud">SoundCloud</label>
          </li>
          <li>
            <input type="checkbox"
                   id="youtube"
                   checked={this.state.searchYouTube}
                   onChange={this.toggleYouTube} />
            <label htmlFor="youtube">YouTube</label>
          </li>
        </ul>
      );
    }
  },

  renderError() {
    if ( this.state.error ) {
      return (
        <h4 className="error text-center nudge--top light">
          {this.state.error}
        </h4>
      );
    }
  },

  renderChildren() {
    return this.props.children && React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.query,
      currentUser: this.props.currentUser,
      currentTrack: this.props.currentTrack,
      userCollaborations: this.props.userCollaborations,
      userLikes: this.props.userLikes,
      setSearchState: this.setSearchState,
      isLoading: this.state.loading
    });
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Search')}>
      <section className="content search fx-4 max-width-wrapper">

        <TabBar className="nudge-half--bottom">
          <ListLink to="/search/playlists" query={{ q: this.props.location.query.q }}>
            Playlists
          </ListLink>
          <ListLink to="/search/groups" query={{ q: this.props.location.query.q }}>
            Groups
          </ListLink>
          <ListLink to="/search/tracks" query={{ q: this.props.location.query.q }}>
            Tracks
          </ListLink>
        </TabBar>

        <PageControlBar type="search">
          <div className="search-container">
            <SearchBar ref="SearchBar"
                       value={this.state.query}
                       onChange={this.handleQueryChange}
                       onKeyPress={this.handleKeyPress}
                       disabled={this.state.loading}
                       placeholder={this.getSearchPlaceholder()}
                       loading={this.state.loading} />
          </div>
          <div className="options-container">
            {this.renderTrackSearchOptions()}
          </div>
        </PageControlBar>

        {this.renderError()}

        {this.renderChildren()}

      </section>
      </DocumentTitle>
    );
  }

});

export default SearchPage;
