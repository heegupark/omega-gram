import React, { Component } from 'react';

class Followers extends Component {
  constructor() {
    super();
    this.handleFollowBtnClick = this.handleFollowBtnClick.bind(this);
  }

  handleFollowBtnClick(e) {
    e.preventDefault();
    this.props.addFollowing(event.target.id);
  }

  render() {
    const {
      user,
      followers,
      handleUsernameClick,
      handleUnfollowBtnClick
    } = this.props;
    const {
      handleFollowBtnClick
    } = this;
    return (
      <table className="mx-auto w-100">
        <tbody>
          {followers.length
            ? followers.map(follower => {
              const isFollowing = user ? user.followings.filter(follow => follow.following._id.toString() === follower._id.toString()) : false;
              return (
                <tr key={follower._id}>
                  <td></td>
                  <td className="text-center">
                    <span
                      className="cursor hover-blue"
                      id={follower._id}
                      onClick={handleUsernameClick}>{follower.username}</span>
                  </td>
                  {isFollowing.length
                    ? (
                      <>
                        <td className="text-center">
                          <span>following</span>
                        </td>
                        <td className="text-center">
                          <div
                            id={follower._id}
                            className="text-secondary cursor hover-black"
                            onClick={handleUnfollowBtnClick}>unfollow</div>
                        </td>
                      </>
                    )
                    : (
                      <>
                        <td className="text-center">
                          <span className="text-secondary">not following</span>
                        </td>
                        <td className="text-center">
                          <div
                            id={follower._id}
                            className="text-warning cursor hover-black"
                            onClick={handleFollowBtnClick}>follow</div>
                        </td>
                      </>
                    )}
                </tr>
              );
            })
            : (
              <tr><td>No followers</td></tr>
            )
          }
        </tbody>
      </table>
    );
  }
}

export default Followers;
