import React, { Component } from 'react';

class SearchUserItem extends Component {
  constructor() {
    super();
    this.state = {
      isUpdating: false
    };
    this.handleFollowBtnClick = this.handleFollowBtnClick.bind(this);
  }

  handleFollowBtnClick(e) {
    this.props.addFollowing(e.target.id);
  }

  render() {
    const {
      searchedUser,
      isFollowing,
      handleUsernameClick
    } = this.props;
    const { isUpdating } = this.state;
    const { handleFollowBtnClick } = this;
    return (
      <div>
        <div className="row mx-auto my-2">
          <div className="col"></div>
          <div className="col my-auto text-center">
            {isUpdating
              ? (
                <span
                  id={searchedUser._id}
                  className="text-secondary"
                >{searchedUser.username}</span>
              )
              : (
                <span
                  id={searchedUser._id}
                  className='cursor'
                  onClick={handleUsernameClick}>{searchedUser.username}</span>
              )
            }
          </div>
          <div className="col text-center">
            {isFollowing.length
              ? (
                <button
                  disabled
                  className="btn btn-sm btn-outline-secondary w-75px">following</button>
              )
              : isUpdating
                ? (
                  <button
                    disabled
                    className="btn btn-sm btn-outline-secondary pt-0 w-75px">
                    <div className="spinner-border spinner-border-sm text-dark mb-1" role="status">
                    </div>
                  </button>
                )
                : (
                  <button
                    id={searchedUser._id}
                    className="btn btn-sm btn-outline-warning w-75px"
                    onClick={handleFollowBtnClick}>follow</button>
                )
            }
          </div>
          <div className="col"></div>
        </div>
      </div>
    );
  }
}

export default SearchUserItem;
