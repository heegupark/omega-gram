import React, { Component } from 'react';

class TopFollowers extends Component {
  constructor() {
    super();
    this.state = {
      followers: []
    };
    this.getTopFollowers = this.getTopFollowers.bind(this);
    this.handleFollowBtnClick = this.handleFollowBtnClick.bind(this);
    this.handleUsernameClick = this.handleUsernameClick.bind(this);
  }

  componentDidMount() {
    this.getTopFollowers(5, 0);
  }

  handleFollowBtnClick(e) {
    e.preventDefault();
    this.props.addFollowing(event.target.id);
    const array = this.state.followers.filter(follower => follower._id.toString() !== event.target.id.toString());
    this.setState({
      followers: array
    });
  }

  handleUsernameClick(e) {
    e.preventDefault();
    this.props.getPosts(event.target.id);
  }

  getTopFollowers(limit, skip) {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    fetch(`/api/topfollowings/?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          this.setState({
            followers: result.data
          });
        }
      })
      .catch(err => console.error(err.message));
  }

  render() {
    const {
      handleFollowBtnClick
    } = this;
    const { followers } = this.state;
    const { handleUsernameClick } = this;
    return (
      <table className="mx-auto w-100">
        <tbody>
          {followers.length
            ? (
              followers.map(follower => {
                return (
                  <tr key={follower._id}>
                    <td className="text-center">
                      <span
                        id={follower._id}
                        className="cursor hover-blue"
                        onClick={handleUsernameClick}>{follower.userInfo[0].username}
                      </span>
                    </td>
                    <td className="text-center">
                      <span>{`${follower.count} follower${follower.count > 1 ? 's' : ''}`}
                      </span>
                    </td>
                    <td className="text-center">
                      <span>
                        <div
                          id={follower._id}
                          className="text-warning cursor hover-black"
                          onClick={handleFollowBtnClick}>follow</div>
                      </span>
                    </td>
                  </tr>
                );
              })
            )
            : (
              <tr>
                <td>
                  <div className="text-center">
                    {'click '}
                    <span className="text-primary text-center cursor hover-black" onClick={handleUsernameClick}>{'here'}</span>
                    {' to start enjoying o-gram!!!'}
                  </div>
                </td>
              </tr>
            )

          }
        </tbody>
      </table>
    );
  }
}

export default TopFollowers;
