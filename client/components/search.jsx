import React, { Component } from 'react';
import SearchUser from './search-user';

class Search extends Component {
  render() {
    const {
      user,
      setPage,
      getPosts,
      addFollowing,
      searchUserList
    } = this.props;
    return (
      <main>
        <div
          className='row mx-auto mt-5'>
          <div className='col-sm mx-auto'>
            {searchUserList && searchUserList.length > 0
              ? (
                <SearchUser
                  user={user}
                  setPage={setPage}
                  getPosts={getPosts}
                  searchUserList={searchUserList}
                  addFollowing={addFollowing}
                />
              )
              : ('')
            }
          </div>
        </div>
      </main>
    );
  }
}

export default Search;
