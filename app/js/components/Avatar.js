/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = React.createFactory(require('react-router').Link);

var Avatar = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  },

  getDefaultProps: function() {
    return {
      user: {}
    };
  },

  render: function() {
    var element = null;
    var styles = {
      'height': this.props.size,
      'width': this.props.size,
      'backgroundImage': this.props.user.imageUrl ? 'url(' + this.props.user.imageUrl + ')' : null
    };

    if ( this.props.user.imageUrl ) {
      element = (
        <div className="avatar" style={styles}>
          <Link to="Profile" params={{ username: this.props.user.username }} />
        </div>
      );
    }

    return element;
  }

});

module.exports = React.createFactory(Avatar);