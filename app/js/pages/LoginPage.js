'use strict';

import React               from 'react/addons';
import {ListenerMixin}     from 'reflux'; // for LoggedOutRouteMixin
import {History}           from 'react-router';
import _                   from 'lodash';
import DocumentTitle       from 'react-document-title';

import LoggedOutRouteMixin from '../mixins/LoggedOutRouteMixin';
import Helpers             from '../utils/Helpers';
import UserActions         from '../actions/UserActions';
import CurrentUserStore    from '../stores/CurrentUserStore';
import LoginForm           from '../components/LoginForm';

const LoginPage = React.createClass({

  statics: {
    attemptedTransition: null
  },

  mixins: [React.addons.LinkedStateMixin, History, ListenerMixin, LoggedOutRouteMixin],

  propTypes: {
    query: React.PropTypes.object
  },

  getInitialState() {
    return {
      username: this.props.query.username || '',
      password: '',
      submitDisabled: true,
      facebookId: null,
      focusedInput: null,
      loading: false,
      error: null
    };
  },

  _onUserChange(err, user) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else if ( !_.isEmpty(user) ) {
      this.handleLogin();
    }
  },

  componentDidMount() {
    if ( !_.isEmpty(CurrentUserStore.user) ) {
      this.doRedirect();
    } else {
      UserActions.check((err, user) => {
        if ( !err ) {
          this._onUserChange(null, user);
        }
      });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) && this.isMounted() ) {
      this.checkForm();
    }
  },

  handleLogin() {
    let attemptedTransition;

    console.log('attemptedTransition:', LoginPage.attemptedTransition);

    if ( !_.isEmpty(LoginPage.attemptedTransition) ) {
      attemptedTransition = LoginPage.attemptedTransition;
      LoginPage.attemptedTransition = null;
      this.history.replaceState(null, attemptedTransition.path, attemptedTransition.query);
    } else {
      this.history.replaceState(null, '/');
    }
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Login')}>
      <div>

        <LoginForm onLogin={this.handleLogin}
                   isFacebookLogin={this.props.query.fb === 'true'} />

      </div>
      </DocumentTitle>
    );
  }

});

export default LoginPage;