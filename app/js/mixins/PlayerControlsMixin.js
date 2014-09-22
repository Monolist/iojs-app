'use strict';

var _ = require('underscore');

var PlayerControlsMixin = {

  getInitialState: function() {
    return {
      lastIndex: null,
      currentIndex: 0,
      isPlaying: false,
      repeat: false,
      shuffle: false,
      volume: 0.7,
      currentTime: 0,
      duration: 0,
      currentAudio: null
    };
  },

  componentWillMount: function() {
    this.setState({
      currentTrack: this.state.playlist[this.state.currentIndex],
      currentAudio: new Audio(this.state.playlist[this.state.currentIndex].url)
    });
  },

  componentDidMount: function() {
    this.addTrackListeners();
  },

  componentWillUnmount: function() {
    this.removeTrackListeners();
  },

  addTrackListeners: function() {
    this.state.currentAudio.volume = this.state.volume;
    this.state.currentAudio.addEventListener('ended', this.nextTrack);
    this.state.currentAudio.addEventListener('timeupdate', this.updateProgress);
    this.state.currentAudio.addEventListener('loadedmetadata', this.setDuration);
  },

  removeTrackListeners: function() {
    this.state.currentAudio.removeEventListener('ended', this.nextTrack);
    this.state.currentAudio.removeEventListener('timeupdate', this.updateProgress);
    this.state.currentAudio.removeEventListener('loadedmetadata', this.setDuration);
  },

  setDuration: function() {
    this.setState({
      duration: this.state.currentAudio.duration
    });
  },

  updateProgress: function() {
    this.setState({
      currentTime: this.state.currentAudio.currentTime
    });
  },

  seekTrack: function(newTime) {
    this.setState({
      currentTime: newTime
    }, function() {
      this.state.currentAudio.currentTime = this.state.currentTime;
    });
  },

  updateVolume: function(newVolume) {
    this.setState({
      volume: newVolume
    }, function() {
      this.state.currentAudio.volume = this.state.volume;
    });
  },

  getRandomTrackIndex: function() {
    var index = Math.floor((Math.random() * this.state.playlist.length - 1) + 1);

    // Recurse until we're not playing the same or last track
    if ( index === this.state.currentIndex || index === this.state.lastIndex ) {
      return this.getRandomTrackIndex();
    }

    return index;
  },

  stopPreviousTrack: function() {
    this.state.currentAudio.pause();
    this.removeTrackListeners();
  },

  transitionToNewTrack: function() {
    this.addTrackListeners();

    if ( this.state.isPlaying ) {
      this.state.currentAudio.play();
    } else {
      this.state.currentAudio.pause();
    }
  },

  lastTrack: function() {
    this.stopPreviousTrack();

    this.setState({
      lastIndex: this.state.currentIndex,
      currentIndex: this.state.lastIndex,
      currentTrack: this.state.playlist[this.state.lastIndex],
      currentAudio: new Audio(this.state.playlist[this.state.lastIndex].url)
    }, this.transitionToNewTrack);
  },

  nextTrack: function() {
    var newIndex;

    if ( this.state.shuffle) {
      newIndex = this.getRandomTrackIndex();
    } else {
      newIndex = ( this.state.currentIndex + 1 < this.state.playlist.length ) ? this.state.currentIndex + 1 : 0;
    }

    this.stopPreviousTrack();

    this.setState({
      lastIndex: this.state.currentIndex,
      currentIndex: newIndex,
      currentTrack: this.state.playlist[newIndex],
      currentAudio: new Audio(this.state.playlist[newIndex].url)
    }, this.transitionToNewTrack);
  },

  selectTrack: function(id) {
    var newTrack;
    var newIndex;

    _.each(this.state.playlist, function(track, index){
      if ( track.id === id ) {
        newTrack = track;
        newIndex = index;
      }
    });

    this.stopPreviousTrack();

    this.setState({
      lastIndex: this.state.currentIndex,
      currentTrack: newTrack,
      currentIndex: newIndex,
      currentAudio: new Audio(newTrack.url)
    }, this.transitionToNewTrack);
  },

  togglePlay: function() {
    this.setState({
      isPlaying: !this.state.isPlaying
    }, function() {
      if ( this.state.isPlaying ) {
        this.state.currentAudio.play();
      } else {
        this.state.currentAudio.pause();
      }
    });
  },

  toggleRepeat: function() {
    this.setState({
      repeat: !this.state.repeat
    });
  },

  toggleShuffle: function() {
    this.setState({
      shuffle: !this.state.shuffle
    });
  }

};

module.exports = PlayerControlsMixin;