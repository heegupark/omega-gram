import React, { Component } from 'react';
import Post from './post';

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleNoteInputChange = this.handleNoteInputChange.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleGoToSignIn = this.handleGoToSignIn.bind(this);
  }

  handleNoteInputChange() {
    event.preventDefault();
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      note: event.target.value
    });
  }

  handleInputClick() {
    this.props.openModal('create');
  }

  handleGoToSignIn() {
    this.props.setPage('signin');
  }

  render() {
    const {
      posts,
      isSignedIn,
      addImage,
      openModal,
      closeModal,
      updateNote,
      keyword,
      user,
      isUploading
    } = this.props;
    const { handleInputClick, handleGoToSignIn } = this;
    return (
      <main>
        <div className="row my-3 mx-auto fixed-top bg-white input-box">
          <div className="col-sm mx-auto input-group">
            <textarea
              rows="2"
              style={{ display: isSignedIn ? '' : 'none' }}
              className="form-control resize-none input-text"
              type="text"
              onClick={handleInputClick}
              placeholder={isUploading ? 'writing...' : 'what do you have today?'}/>
          </div>
        </div>
        <div
          className='row mx-auto post-box'>
          <div className='col-sm mx-auto'>
            {posts.length > 0
              ? posts.map((post, index) => {
                const { _id, description, imgUrl, thumbnailImgUrl, owner, updatedAt } = post;
                return <Post
                  key={index}
                  _id={_id}
                  imgUrl={imgUrl}
                  description={description}
                  thumbnailImgUrl={thumbnailImgUrl}
                  owner={owner}
                  user={user}
                  updatedAt={updatedAt}
                  isSignedIn={isSignedIn}
                  addImage={addImage}
                  openModal={openModal}
                  closeModal={closeModal}
                  updateNote={updateNote}
                  keyword={keyword}
                  isUploading={isUploading} />;
              })
              : isSignedIn
                ? (
                  <>
                    <p className="text-center">no notes at the moment</p>
                    <p className="text-center">{'why don\'t you start writing a small note?'}</p>
                  </>
                )
                : (
                  <>
                    <p className="text-center">please sign in to enjoy o-note!</p>
                    <div className="text-center my-3">
                      <button
                        className="btn btn-sm mx-1 text-secondary sign-up-btn"
                        onClick={handleGoToSignIn}>go to signin</button>
                    </div>
                  </>
                )
            }
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
