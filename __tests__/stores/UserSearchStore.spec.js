'use strict';

import when            from 'when';

import UserSearchStore from '../../app/js/stores/UserSearchStore';
import UserActions     from '../../app/js/actions/UserActions';
import SearchAPI       from '../../app/js/utils/SearchAPI';

describe('Store: UserSearch', function() {

  it('should search users on action', function(done) {
    const query = 'test';
    const searchStub = sandbox.stub(SearchAPI, 'userSearch').returns(when());

    UserActions.search(query, () => {
      sinon.assert.calledOnce(searchStub);
      sinon.assert.calledWith(searchStub, query);
      done();
    });
  });

});