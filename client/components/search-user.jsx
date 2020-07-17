import React, { Component } from 'react';
import SearchUserItem from './search-user-item';

class SearchUser extends Component {
  constructor() {
    super();
    this.handleBackToMainClick = this.handleBackToMainClick.bind(this);
    this.handleUsernameClick = this.handleUsernameClick.bind(this);
  }

  handleBackToMainClick() {
    this.props.setPage('main');
  }

  handleUsernameClick() {
    this.props.getPosts(event.target.id);
  }

  render() {
    const {
      searchUserList,
      user,
      handleFollowBtnClick
    } = this.props;
    const { handleBackToMainClick, handleUsernameClick } = this;
    return (
      <div className='fade-in mb-5'>
        <div className="h5 text-center my-3">
          {'user search result'}
        </div>
        {searchUserList.map(searchedUser => {
          const isFollowing = user.followings.filter(el => el.following._id.toString() === searchedUser._id.toString());
          const numberOfFollowers = searchedUser.followings.length;
          if (user._id === searchedUser._id) {
            return;
          }
          return (
            <SearchUserItem
              key={searchedUser._id}
              searchedUser={searchedUser}
              isFollowing={isFollowing}
              numberOfFollowers={numberOfFollowers}
              handleFollowBtnClick={handleFollowBtnClick}
              handleUsernameClick={handleUsernameClick}
            />
          );
        })}
        <hr></hr>
        <div className="text-center">
          <span className="cursor" onClick={handleBackToMainClick}>{'back to main'}</span>
        </div>
      </div>
    );
  }
}

export default SearchUser;
