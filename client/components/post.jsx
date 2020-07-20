import React, { Component } from 'react';
import Like from './like';
import Comments from './comments';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isImgLoaded: false,
      more: false
    };
    this.getTimeMsg = this.getTimeMsg.bind(this);
    this.handleUpdateBtnClick = this.handleUpdateBtnClick.bind(this);
    this.handleDeleteBtnClick = this.handleDeleteBtnClick.bind(this);
    this.handlePostClick = this.handlePostClick.bind(this);
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.textBolder = this.textBolder.bind(this);
    this.handleUsernameClick = this.handleUsernameClick.bind(this);
  }

  getTimeMsg(updatedAt) {
    const createdTime = new Date(updatedAt);
    const currentTime = new Date();
    const second = 60;
    const minute = 60;
    const hour = 24;
    const day = 30;
    const month = 12;
    let divider = 1;
    let timeMsg = '';
    let diff = (currentTime - createdTime) / 1000;
    if (diff <= second) {
      timeMsg = 'second';
    } else if (diff <= second * minute) {
      divider = second;
      timeMsg = 'minute';
    } else if (diff <= second * minute * hour) {
      divider = second * minute;
      timeMsg = 'hour';
    } else if (diff <= second * minute * hour * day) {
      divider = second * minute * hour;
      timeMsg = 'day';
    } else if (diff <= second * minute * hour * day * month) {
      divider = second * minute * hour * day;
      timeMsg = 'month';
    } else {
      divider = second * minute * hour * day * month;
      timeMsg = 'year';
    }
    diff /= divider;
    const displayTime = Math.abs(Math.round(diff));
    const plural = displayTime > 1 ? 's' : '';
    const timeMessage = `${displayTime} ${timeMsg}${plural} ago`;
    return timeMessage;
  }

  handleUpdateBtnClick() {
    this.setState({
      more: false
    });
    const { _id, description, imgUrl, openModal, isUploading } = this.props;
    if (!isUploading) {
      openModal('update', _id, description, imgUrl);
    }
  }

  handleDeleteBtnClick() {
    this.setState({
      more: false
    });
    const { _id, description, thumbnailImgUrl, openModal, isUploading } = this.props;
    if (!isUploading) {
      openModal('delete', _id, description, thumbnailImgUrl);
    }
  }

  handlePostClick() {
    this.setState({
      more: false
    });
    const { _id, description, imgUrl, owner, openModal } = this.props;
    openModal('enlargeImage', _id, description, imgUrl, owner);
  }

  handleMoreClick() {
    this.setState({
      more: !this.state.more
    });
  }

  handleUsernameClick() {
    this.props.getPosts(this.props.owner._id);
  }

  textBolder(text, boldStr) {
    const keyword = new RegExp(boldStr, 'i');
    const array = text.split(keyword);
    const keyIndex = text.toLowerCase().indexOf(boldStr.toLowerCase());
    const originalKeyword = text.substring(keyIndex, keyIndex + boldStr.length);
    return (
      <>
        {array.map((item, index) => (
          <span key={index}>
            {item}
            {index !== array.length - 1 && (
              <b className="text-warning">{originalKeyword}</b>
            )}
          </span>
        ))}
      </>
    );
  }

  render() {
    const {
      _id,
      user,
      owner,
      imgUrl,
      thumbnailImgUrl,
      description,
      updatedAt,
      keyword,
      getPosts
    } = this.props;
    const {
      isImgLoaded,
      more
    } = this.state;
    const {
      getTimeMsg,
      handlePostClick,
      textBolder,
      handleMoreClick,
      handleDeleteBtnClick,
      handleUpdateBtnClick,
      handleUsernameClick
    } = this;
    const isMe = owner._id === user._id;
    const timeMessage = getTimeMsg(updatedAt);
    return (
      <div className="mb-4">
        <div className="row">
          <div className="col mx-auto post-image">
            <span
              className={`hover-goldenrod cursor ${isMe ? 'font-weight-bold' : ''}`}
              onClick={handleUsernameClick}
            >{`${owner.username}`}{isMe ? ' (me)' : ''}</span>
          </div>
        </div>
        <div className="row my-1">
          <div className="mx-auto post-image ml-2 text-center">
            {imgUrl
              ? (
                <>
                  <img
                    alt=""
                    className="img-fluid rounded cursor hover-bigger"
                    src={thumbnailImgUrl}
                    onLoad={() => this.setState({ isImgLoaded: true })}
                    style={isImgLoaded ? {} : { display: 'none' }}
                    onClick={handlePostClick}></img>
                  <div
                    className="spinner-border spinner-border-sm text-info"
                    role="status"
                    style={isImgLoaded ? { display: 'none' } : {} } >
                    <span className="sr-only"></span>
                  </div>
                </>
              )
              : (
                ''
              )
            }
          </div>
        </div>
        <div className="row mt-2">
          <div className="mx-auto post-image">
            <Like
              postId={_id}
              username={user.username}
              userId={user._id} />
            <div className="d-flex">
              <div className="col text-left pl-0">
                <div className="">{keyword ? textBolder(description, keyword) : description}</div>
                <div className="time-msg text-secondary">{timeMessage}</div>
              </div>
              <div className="col text-right pr-0">
                {isMe
                  ? (
                    <>
                      <button
                        type="button"
                        style={!more ? { display: 'none' } : {}}
                        className="more-btn-anim mb-1 btn btn-sm btn-outline-danger mx-1 pb-0 my-auto"
                        onClick={handleDeleteBtnClick}>
                        <i className="fas fa-eraser"></i></button>
                      <button
                        type="button"
                        style={!more ? { display: 'none' } : {}}
                        className="more-btn-anim mb-1 btn btn-sm btn-outline-warning mx-1 pb-0 my-auto"
                        onClick={handleUpdateBtnClick}>
                        <i className="fas fa-pen-alt"></i></button>
                      <button
                        className="btn btn-sm border-0 my-auto rounded hover-circle"
                        onClick={handleMoreClick}>
                      . . .
                      </button>
                    </>
                  )
                  : ('')
                }
              </div>
            </div>
            <div>
              <Comments
                postId={_id}
                userId={user._id}
                getPosts={getPosts}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
