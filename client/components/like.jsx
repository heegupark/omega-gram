import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

class Like extends Component {
  constructor() {
    super();
    this.state = {
      didILike: false,
      likeList: []
    };
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.getLikeCount = this.getLikeCount.bind(this);
    this.getDidILike = this.getDidILike.bind(this);
    this.likeNumFormat = this.likeNumFormat.bind(this);
  }

  componentDidMount() {
    this.getDidILike();
    this.getLikeCount();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
    };
  }

  getLikeCount() {
    const { postId } = this.props;
    fetch(`/api/like/${postId}`)
      .then(res => res.json())
      .then(likeList => {
        this.setState({
          likeList
        });
      })
      .catch(err => console.error(err.message));
  }

  getDidILike() {
    const { userId, postId } = this.props;
    fetch('/api/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        postId
      })
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          didILike: result.isLiked
        });
      })
      .catch(err => console.error(err.message));
  }

  handleLikeClick() {
    // const token = window.localStorage.getItem(process.env.AUTH_TOKEN_STRING);
    const { userId, postId, authToken } = this.props;
    if (authToken) {
      fetch('/api/like', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          userId,
          postId
        })
      })
        .then(res => res.json())
        .then(result => {
          this.setState({
            didILike: result.isLiked
          });
          this.getLikeCount();
        })
        .catch(err => console.error(err.message));
    }
  }

  likeNumFormat(number) {
    let like = 'like';
    let changedNumber = number;
    if (number > 1) like += 's';
    if (number >= 1e3 && number < 1e6) {
      changedNumber = +(number / 1e3).toFixed(1) + 'K';
    }
    if (number >= 1e6 && number < 1e9) {
      changedNumber = +(number / 1e6).toFixed(1) + 'M';
    }
    if (number >= 1e9 && number < 1e12) {
      changedNumber = +(number / 1e9).toFixed(1) + 'B';
    }
    if (number >= 1e12) {
      changedNumber = +(number / 1e12).toFixed(1) + 'T';
    }
    return `${changedNumber} ${like}`;
  }

  render() {
    const {
      handleLikeClick,
      likeNumFormat
    } = this;
    const {
      didILike,
      likeList
    } = this.state;
    const { userId, postId } = this.props;
    return (
      <>
        <div className="col ml-1 text-left pl-0">
          {didILike
            ? (
              <i
                className="fas fa-heart text-danger cursor hover-black"
                onClick={handleLikeClick}>
              </i>
            )
            : (
              <i className="far fa-heart cursor hover-red"
                onClick={handleLikeClick}></i>
            )
          }
          {likeList.length
            ? (
              <>
                <span
                  data-tip=''
                  data-for={`likers-${postId}`}
                  className="ml-3"
                >{likeNumFormat(likeList.length)}</span>
                <ReactTooltip
                  className="fade-in"
                  id={`likers-${postId}`}
                  place="top"
                  getContent={() => { return null; }}>
                  {(likeList.map((item, index) => {
                    const isMe = userId === item.userId._id;
                    return (
                      <div
                        key={index}>
                        {isMe ? `${item.userId.username} (me)` : item.userId.username}
                      </div>
                    );
                  }))}
                </ReactTooltip>
              </>
            )
            : ('')
          }
        </div>
      </>
    );
  }
}

export default Like;
