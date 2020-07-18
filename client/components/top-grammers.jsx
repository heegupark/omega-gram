import React, { Component } from 'react';

class TopGrammers extends Component {
  constructor() {
    super();
    this.state = {
      grammers: []
    };
    this.getTopGrammers = this.getTopGrammers.bind(this);
    this.handleFollowBtnClick = this.handleFollowBtnClick.bind(this);
    this.handleUsernameClick = this.handleUsernameClick.bind(this);
  }

  componentDidMount() {
    this.getTopGrammers(5, 0);
  }

  handleFollowBtnClick(e) {
    e.preventDefault();
    this.props.addFollowing(event.target.id);
    const array = this.state.grammers.filter(grammer => grammer._id.toString() !== event.target.id.toString());
    this.setState({
      grammers: array
    });
  }

  handleUsernameClick(e) {
    e.preventDefault();
    this.props.getPosts(event.target.id);
  }

  getTopGrammers(limit, skip) {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    fetch(`/api/grammers/?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          this.setState({
            grammers: result.data
          });
        }
      })
      .catch(err => console.error(err.message));
  }

  render() {
    const {
      handleFollowBtnClick
    } = this;
    const { grammers } = this.state;
    const { handleUsernameClick } = this;
    return (
      <table className="mx-auto w-100">
        <tbody>
          {grammers.map(grammer => {
            return (
              <tr key={grammer._id}>
                <td className="text-center">
                  <span
                    id={grammer._id}
                    className="cursor hover-blue"
                    onClick={handleUsernameClick}>{grammer.userInfo[0].username}
                  </span>
                </td>
                <td className="text-center">
                  <span>{`${grammer.count} post${grammer.count > 1 ? 's' : ''}`}
                  </span>
                </td>
                <td className="text-center">
                  <span>
                    <div
                      id={grammer._id}
                      className="text-warning cursor hover-black"
                      onClick={handleFollowBtnClick}>follow</div>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default TopGrammers;
