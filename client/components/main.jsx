import React, { Component } from 'react';
import Post from './post';
import SearchUser from './search-user';

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleNoteInputChange = this.handleNoteInputChange.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleGoToSignIn = this.handleGoToSignIn.bind(this);
    this.handleFollowBtnClick = this.handleFollowBtnClick.bind(this);
    this.handleGuestSignIn = this.handleGuestSignIn.bind(this);
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

  handleFollowBtnClick() {
    this.props.addFollowing(event.target.id);
  }

  handleGuestSignIn() {
    this.props.guestSignIn();
  }

  render() {
    const {
      posts,
      isSignedIn,
      addImage,
      openModal,
      closeModal,
      updateNote,
      searchUserList,
      keyword,
      getPosts,
      user,
      setPage,
      isUploading
      // isFirstLoading
    } = this.props;
    const { handleInputClick, handleGoToSignIn, handleFollowBtnClick, handleGuestSignIn } = this;
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
            {searchUserList.length > 0
              ? (
                <SearchUser
                  user={user}
                  setPage={setPage}
                  getPosts={getPosts}
                  searchUserList={searchUserList}
                  handleFollowBtnClick={handleFollowBtnClick}
                />
              )
              : posts.length > 0
                ? posts.map(post => {
                  const { _id, description, imgUrl, thumbnailImgUrl, owner, updatedAt } = post;
                  return <Post
                    key={_id}
                    _id={_id}
                    imgUrl={imgUrl}
                    description={description}
                    thumbnailImgUrl={thumbnailImgUrl}
                    owner={owner}
                    user={user}
                    getPosts={getPosts}
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
                  // ? isFirstLoading
                  //   ? (
                    <>
                      <p className="text-center">no notes at the moment</p>
                      <p className="text-center">{'why don\'t you start writing a small note?'}</p>
                      <p className="text-center">{'Or, follow someone to see their posts'}</p>
                    </>
                  )
                // : (
                //   <div className="text-center mt-5">
                //     <div className="spinner-border text-dark" role="status">
                //     </div>
                //   </div>
                // )
                  : (
                    <>
                      <p className="text-center">please sign in to enjoy o-note!</p>
                      <div className="text-center my-3">
                        <button
                          className="btn btn-sm mx-1 text-secondary sign-up-btn hover-black"
                          onClick={handleGoToSignIn}>go to signin</button>
                      </div>
                      <div className="text-center my-3">
                        <button
                          className="btn btn-sm mx-1 text-primary sign-up-btn hover-black"
                          onClick={handleGuestSignIn}>enjoy as a guest</button>
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
