import React, { Component } from 'react';
import Header from './header';
import Footer from './footer';
import Main from './main';
import User from './user';
import Signin from './signin';
import Modal from './modal';
import Disclaimer from './disclaimer';
import Search from './search';
import Intro from './intro';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      originalPosts: [],
      view: 'main',
      user: {},
      imgUrl: '',
      thumbnailImgUrl: '',
      description: '',
      modalCategory: '',
      keyword: '',
      message: '',
      limit: 5,
      skip: 0,
      postsOfOthers: false,
      selectedPostId: null,
      isSignedIn: false,
      isModalOpen: false,
      isFirstSearch: true,
      searchUserList: [],
      isUploading: false,
      isPostLoading: false,
      isDisclaimerAccepted: localStorage.getItem('omegagramaccept')
    };
    this.setPage = this.setPage.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.signout = this.signout.bind(this);
    this.setSignin = this.setSignin.bind(this);
    this.setSignout = this.setSignout.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.openModal = this.openModal.bind(this);
    this.addPost = this.addPost.bind(this);
    this.addImage = this.addImage.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.clearSearchUserList = this.clearSearchUserList.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
    this.searchKeyword = this.searchKeyword.bind(this);
    this.addFollowing = this.addFollowing.bind(this);
    this.stopFollowing = this.stopFollowing.bind(this);
    this.handleDisclaimerAccept = this.handleDisclaimerAccept.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.guestSignIn = this.guestSignIn.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  componentDidMount() {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    if (authToken) {
      this.getUserInfo();
      this.setSignin();
      this.getPosts();
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
    };
  }

  showMessage(message, time) {
    setTimeout(() => {
      this.setState({ message: '' });
    }, time);
    this.setState({ message });
  }

  handleDisclaimerAccept(accept) {
    this.setState({
      isDisclaimerAccepted: accept
    });
  }

  setPage(page, user, userId) {
    this.setState({
      view: page,
      user: user || this.state.user,
      posts: [],
      limit: 5,
      skip: 0
    });
    if (page === 'main') {
      this.getUserInfo();
      this.getPosts(userId);
    }
  }

  setSignin(token) {
    this.setState({
      isSignedIn: true
    });
    // this.getPosts();
  }

  guestSignIn() {
    fetch('/api/guest')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.localStorage.setItem('omegagram-authtoken', data.token);
          this.setPage('main', data.user);
          this.setSignin(data.token);
        } else {
          this.showMessage(data.message, 2000);
        }
      })
      .catch(err => console.error(`Failed to create a guest account: ${err.message}`));
  }

  setSignout() {
    this.setState({
      isModalOpen: false,
      isSignedIn: false,
      posts: [],
      user: {},
      view: 'main'
    });
    // this.getPosts();
  }

  getPosts(userId) {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    const { limit, skip } = this.state;
    this.setState({
      isPostLoading: true
    });
    if (userId) {
      this.setState({
        postsOfOthers: true
      });
    } else {
      this.setState({
        postsOfOthers: false
      });
    }
    this.clearSearchUserList();
    const url = userId ? `/api/gram/${userId}?sortBy=createdAt:desc&limit=${limit}&skip=${skip}` : `/api/gram/?sortBy=createdAt:desc&limit=${limit}&skip=${skip}`;
    if (authToken) {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (!data.gram.length) {
            this.setPage('intro');
          } else {
            this.setState({
              posts: data.gram,
              view: 'main'
            });
          }
          this.setState({
            isPostLoading: false
          });
        })
        .catch(err => {
          console.error(`No posts found: ${err.message}`);
          this.setState({
            isPostLoading: false
          });
        });
    }
  }

  addFollowing(userId) {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    if (authToken) {
      fetch('/api/following', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ following: userId })
      })
        .then(res => res.json())
        .then(updatedUser => {
          this.setState({
            user: updatedUser
          });
        })
        .catch(err => {
          console.error(`Something wrong happened while following:${err.message}`);
        });
    }
  }

  stopFollowing(userId) {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    if (authToken) {
      fetch('/api/stopfollowing', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ following: userId })
      })
        .then(res => res.json())
        .then(updatedUser => {
          this.setState({
            user: updatedUser
          });
        })
        .catch(err => {
          console.error(`Something wrong happened while unfollowing:${err.message}`);
        });
    }
  }

  updateUserInfo(body) {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    if (authToken) {
      fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(body)
      }).then(res => res.json())
        .then(user => {
          this.setState({
            user
          });
        })
        .catch(err => {
          console.error('failed to change user information', err.message);
        });
    }
  }

  addImage(form, post, category) {
    this.setState({
      isUploading: true
    });
    const _id = this.state.user._id;
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    if (authToken) {
      fetch(`/api/gram/image/${_id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: form
      }).then(res => res.json())
        .then(data => {
          if (category === 'create') {
            this.addPost(post);
          } else if (category === 'update') {
            this.updatePost(post);
          }
        })
        .catch(err => {
          console.error('image uploading error', err.message);
          this.setState({
            isUploading: false,
            isModalOpen: false
          });
        });
    }
  }

  addPost(post) {
    this.setState({
      isUploading: true
    });
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    if (authToken) {
      fetch('/api/gram/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(post)
      }).then(res => res.json())
        .then(data => {
          this.setState({
            posts: [data, ...this.state.posts],
            // posts: data,
            isUploading: false,
            isModalOpen: false,
            view: 'main'
          });
        })
        .catch(err => {
          console.error('adding a post error', err.message);
          this.setState({
            isUploading: false,
            isModalOpen: false
          });
        });
    }
  }

  updatePost(updatedNote) {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    const arr = [...this.state.posts];
    const newArr = arr.map(note => {
      if (note._id === updatedNote.id) {
        note.description = updatedNote.description;
        note.imgUrl = updatedNote.imgUrl;
        note.thumbnailImgUrl = updatedNote.thumbnailImgUrl;
      }
      return note;
    });
    if (authToken) {
      fetch(`/api/gram/${updatedNote.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          description: updatedNote.description,
          imgUrl: updatedNote.imgUrl,
          thumbnailImgUrl: updatedNote.thumbnailImgUrl
        })
      }).then(res => res.json())
        .then(data => {
          this.setState({
            posts: newArr,
            isUploading: false
          });
          this.closeModal();
        })
        .catch(err => {
          console.error('updating a note error', err.message);
          this.setState({
            isUploading: false
          });
        });
    }
  }

  deletePost() {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    const { selectedPostId, posts } = this.state;
    if (authToken) {
      fetch(`/api/gram/${selectedPostId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          this.setState({
            posts: posts.filter(post => post._id !== data._id)
          });
          this.closeModal();
        })
        .catch(err => console.error(err.message));
    }
  }

  getUserInfo() {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    if (authToken) {
      fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(user => {
          if (user) {
            this.setState({
              user
            });
          }
        })
        .catch(err => console.error(err.message));
    }
  }

  signout() {
    const authToken = window.localStorage.getItem('omegagram-authtoken');
    if (authToken) {
      fetch('/api/users/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            window.localStorage.removeItem('omegagram-authtoken');
            this.setSignout();
          }
        })
        .catch(err => console.error(err.message));
    }
  }

  closeModal() {
    this.setState({
      modalCategory: '',
      isModalOpen: false
    });
  }

  openModal(category, id, description, imgUrl, owner) {
    this.setState({
      modalCategory: category,
      isModalOpen: true,
      selectedPostId: id,
      description: description,
      imgUrl: imgUrl,
      owner: owner
    });
    this.clearSearchUserList();
  }

  clearSearchUserList() {
    this.setState({
      searchUserList: []
    });
  }

  searchUsers(keyword) {
    this.setState({
      posts: []
    });
    if (keyword.length > 0) {
      fetch(`/api/users/${keyword}`)
        .then(res => res.json())
        .then(users => {
          this.setState({
            searchUserList: users
          });
          this.setPage('search');
        })
        .catch(err => console.error(err.message));
    }
  }

  searchKeyword(keyword) {
    let arr = [];
    const { isFirstSearch } = this.state;
    if (isFirstSearch) {
      arr = [...this.state.posts];
      this.setState({
        originalPosts: arr,
        isFirstSearch: false
      });
    } else {
      arr = [...this.state.originalPosts];
    }
    const newArr = arr.filter(note => {
      return note.description.toLowerCase().includes(keyword.toLowerCase());
    });
    this.setState({
      posts: newArr,
      keyword
    });
  }

  render() {
    const {
      addPost,
      addImage,
      setPage,
      openModal,
      closeModal,
      signout,
      setSignin,
      deletePost,
      updatePost,
      clearSearchUserList,
      searchUsers,
      searchKeyword,
      addFollowing,
      stopFollowing,
      getPosts,
      guestSignIn,
      updateUserInfo,
      handleDisclaimerAccept
    } = this;
    const {
      posts,
      view,
      user,
      isSignedIn,
      isModalOpen,
      modalCategory,
      selectedPostId,
      description,
      imgUrl,
      keyword,
      message,
      postsOfOthers,
      isPostLoading,
      searchUserList,
      thumbnailImgUrl,
      isUploading,
      isDisclaimerAccepted
    } = this.state;
    const username = user ? user.username : '';
    let element = null;
    switch (view) {
      case 'main':
        element = (
          <Main
            user={user}
            setPage={setPage}
            getPosts={getPosts}
            isSignedIn={isSignedIn}
            isModalOpen={isModalOpen}
            addFollowing={addFollowing}
            openModal={openModal}
            guestSignIn={guestSignIn}
            keyword={keyword}
            message={message}
            isPostLoading={isPostLoading}
            posts={posts}/>
        );
        break;
      case 'user':
        element = (
          <User
            user={user}
            setPage={setPage}
            openModal={openModal}
            addFollowing={addFollowing}
            stopFollowing={stopFollowing}
            updateUserInfo={updateUserInfo}
            posts={posts} />
        );
        break;
      case 'signin':
        element = (
          <Signin
            setPage={setPage}
            setSignin={setSignin}
            addFollowing={addFollowing}
            isUploading={isUploading} />
        );
        break;
      case 'search':
        element = (
          <Search
            searchUserList={searchUserList}
            user={user}
            setPage={setPage}
            getPosts={getPosts}
            addFollowing={addFollowing} />
        );
        break;
      case 'intro':
        element = (
          <Intro
            isSignedIn={isSignedIn}
            getPosts={getPosts}
            postsOfOthers={postsOfOthers}
            openModal={openModal}
            addFollowing={addFollowing}
            isUploading={isUploading} />
        );
        break;
    }
    return (
      <div>
        <Header
          view={view}
          setPage={setPage}
          username={username}
          isSignedIn={isSignedIn}
          closeModal={closeModal}
          openModal={openModal}
          isModalOpen={isModalOpen}
          clearSearchUserList={clearSearchUserList}
          searchUsers={searchUsers}
          searchKeyword={searchKeyword}
          isUploading={isUploading} />
        {element}
        {isDisclaimerAccepted
          ? ''
          : (
            <Disclaimer
              handleDisclaimerAccept={handleDisclaimerAccept} />
          )
        }
        {isModalOpen
          ? <Modal
            user={user}
            addImage={addImage}
            modalCategory={modalCategory}
            signout={signout}
            deletePost={deletePost}
            updatePost={updatePost}
            selectedPostId={selectedPostId}
            closeModal={closeModal}
            description={description}
            imgUrl={imgUrl}
            addPost={addPost}
            thumbnailImgUrl={thumbnailImgUrl}
            isUploading={isUploading} />
          : ''
        }
        <Footer />
      </div>
    );
  }
}

export default App;
