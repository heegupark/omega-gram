import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:3001/';

class Comments extends Component {
  constructor() {
    super();
    this.state = {
      comments: [],
      comment: '',
      viewComment: false,
      message: 'write a comment...'
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleWriteComment = this.handleWriteComment.bind(this);
    this.handleUsernameClick = this.handleUsernameClick.bind(this);
    this.handleViewCommentToggle = this.handleViewCommentToggle.bind(this);
    this.getComments = this.getComments.bind(this);
  }

  componentDidMount() {
    this.getComments();
    const socket = socketIOClient(ENDPOINT);
    socket.on(`comment-${this.props.postId}`, data => {
      this.setState({
        comments: [...this.state.comments, data.comments]
      });
    });
  }

  handleViewCommentToggle() {
    this.setState({
      viewComment: !this.state.viewComment
    });
  }

  handleInputChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleUsernameClick() {
    event.preventDefault();
    this.props.getPosts(event.target.id);
  }

  handleWriteComment() {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    const { comment } = this.state;
    const { postId } = this.props;
    const body = { comment, postId };
    if (comment.length < 2) {
      setTimeout(() => {
        this.setState({
          message: 'write a comment...'
        });
      }, 1000);
      this.setState({
        message: 'place write something'
      });
    } else {
      if (authToken) {
        fetch('/api/comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(body)
        }).then(res => res.json())
          .then(result => {
            // this.setState({
            //   comments: [...this.state.comments, result.comments],
            //   comment: '',
            //   viewComment: true
            // });
            this.setState({
              comment: '',
              viewComment: true
            });
          })
          .catch(err => {
            console.error('failed to comment', err.message);
          });
      }
    }
  }

  getComments() {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    const { postId } = this.props;
    fetch(`/api/comments/${postId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then(res => res.json())
      .then(result => {
        if (result.success) {
          this.setState({
            comments: result.comments
          });
        }
      })
      .catch(err => {
        console.error('failed to find comments', err.message);
      });
  }

  render() {
    const { userId } = this.props;
    const {
      handleInputChange,
      handleWriteComment,
      handleUsernameClick,
      handleViewCommentToggle
    } = this;
    const { comments, comment, viewComment, message } = this.state;
    return (
      <>
        {viewComment
          ? (
            <>
              <table className="w-100 fade-in">
                <tbody>
                  {comments
                    ? (
                      comments.map(comment => {
                        const isMe = comment.userId._id === userId;
                        return (
                          <tr key={comment._id}>
                            <td style={{ width: '40%' }}>
                              <span
                                id={comment.userId._id}
                                className={`my-auto cursor hover-blue italic ${isMe ? 'bold' : ''}`}
                                onClick={handleUsernameClick}
                              >{`${comment.userId.username}${isMe ? ' (me)' : ''}`}</span>
                            </td>
                            <td className="col-9">
                              <span className="mx-2 my-auto">
                                {comment.comment}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )
                    : ('')
                  }
                </tbody>
              </table>
              <table className="w-100 text-center text-secondary hover-black">
                <tbody>
                  <tr>
                    <td>
                      <span
                        className="cursor"
                        onClick={handleViewCommentToggle}
                      >{`hide ${comments.length} comment${comments.length > 1 ? 's' : ''}`}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )
          : (
            <table className="w-100 text-center text-secondary hover-black">
              <tbody>
                <tr>
                  <td>
                    {comments.length
                      ? (
                        <span
                          className="cursor"
                          onClick={handleViewCommentToggle}
                        >{`view ${comments.length} comment${comments.length > 1 ? 's' : ''}`}</span>
                      )
                      : ('')
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          )
        }
        <table className="w-100">
          <thead>
            <tr>
              <td>
                <div className="input-group">
                  <input
                    name="comment"
                    className="form-control rounded my-2"
                    value={comment}
                    placeholder={message}
                    onChange={handleInputChange}
                  />
                  <button
                    className="my-auto btn btn-outline-secondary border-0"
                    type="button"
                    onClick={handleWriteComment}>
                    <i className="fas fa-pen-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </thead>
        </table>
      </>
    );
  }
}

export default Comments;
