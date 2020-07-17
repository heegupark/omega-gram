import React, { Component } from 'react';

class Followings extends Component {
  render() {
    const { user, handleUsernameClick, handleUnfollowBtnClick } = this.props;
    return (
      <table className="mx-auto w-100">
        <tbody>
          {user
            ? user.followings.length > 0
              ? user.followings.map(follow => {
                if (user._id === follow.following._id) {
                  return;
                }
                return (
                  <tr key={follow._id}>
                    <td></td>
                    <td className="text-center">
                      <span
                        id={follow.following._id}
                        className="cursor hover-blue"
                        onClick={handleUsernameClick}>
                        {`${follow.following.username}`}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        id={follow.following._id}
                        className="text-warning cursor hover-black"
                        onClick={handleUnfollowBtnClick}>unfollow</span>
                    </td>
                    <td></td>
                  </tr>
                );
              })
              : (
                <tr className="my-auto"><td>No followings</td></tr>
              )
            : (<tr className="my-auto"><td></td></tr>)
          }
        </tbody>
      </table>
    );
  }
}

export default Followings;
