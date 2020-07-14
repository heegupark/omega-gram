import React, { Component } from 'react';

class Like extends Component {
  constructor() {
    super();
    this.state = {
      didILike: false,
      likeCount: 0,
      list: [],
      isMouseOver: false
    };
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.getLikeCount = this.getLikeCount.bind(this);
    this.getDidILike = this.getDidILike.bind(this);
    this.likeNumFormat = this.likeNumFormat.bind(this);
    this.handleDisplayLikers = this.handleDisplayLikers.bind(this);
  }

  componentDidMount() {
    this.getLikeCount();
    this.getDidILike();
  }

  getLikeCount() {
    const { postId } = this.props;
    fetch(`/api/like/${postId}`)
      .then(res => res.json())
      .then(list => {
        this.setState({
          likeCount: list.length,
          list: list
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
        if (result.length === 1) {
          this.setState({
            didILike: true
          });
        }
      })
      .catch(err => console.error(err.message));
  }

  handleDisplayLikers() {
    this.setState({
      isMouseOver: !this.state.isMouseOver
      // isMouseOver: true
    });
  }

  handleLikeClick() {
    const { userId, username, postId } = this.props;
    fetch('/api/like', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        username,
        postId
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'liked') {
          this.setState({
            didILike: true
          });
        } else {
          this.setState({
            didILike: false
          });
        }
        this.getLikeCount();
      })
      .catch(err => console.error(err.message));
  }

  likeNumFormat(number) {
    let like = 'like';
    let changedNumber = number;
    if (number > 1) like = +'s';
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
      likeNumFormat,
      handleDisplayLikers
    } = this;
    const {
      didILike,
      likeCount,
      isMouseOver,
      list
    } = this.state;
    return (
      <>
        <div className="col ml-1 text-left">
          {didILike
            ? (
              <i
                className="fas fa-heart text-danger cursor"
                onMouseOver={handleDisplayLikers}
                onMouseOut={handleDisplayLikers}
                onClick={handleLikeClick}>
              </i>
            )
            : (
              <i className="far fa-heart cursor"
                onMouseOver={handleDisplayLikers}
                onMouseOut={handleDisplayLikers}
                onClick={handleLikeClick}></i>
            )
          }
          {likeCount
            ? (
              <span className="ml-3">{likeNumFormat(likeCount)}</span>
            )
            : ('')
          }
          {isMouseOver
            ? (list.map((item, index) => {
              const size = list.length >= 4 ? 4 : list.length;
              if (index <= 2) {
                return (
                  <div
                    key={index}
                    style={{ top: `${-25 * (size - index)}px` }}
                    className="px-3 rounded bg-dark text-white liker-mouseover">
                    {item.username}
                  </div>
                );
              } else if (index === 3) {
                return (
                  <div
                    key={index}
                    style={{ top: `${-25 * (size - index)}px` }}
                    className="px-3 rounded bg-dark text-white liker-mouseover">
                  and more
                  </div>
                );
              }
            }))
            : ('')
          }
        </div>
      </>
    );
  }
}

export default Like;
