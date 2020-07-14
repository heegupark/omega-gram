import React, { Component } from 'react';
import Header from './header';
import Footer from './footer';
import Main from './main';
import Signin from './signin';
import Modal from './modal';
import Disclaimer from './disclaimer';

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
      selectedPostId: null,
      isSignedIn: false,
      isModalOpen: false,
      isFirstSearch: true,
      isUploading: false,
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
    this.searchKeyword = this.searchKeyword.bind(this);
    this.handleDisclaimerAccept = this.handleDisclaimerAccept.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
    this.getPosts();
  }

  handleDisclaimerAccept(accept) {
    this.setState({
      isDisclaimerAccepted: accept
    });
  }

  setPage(page, user) {
    this.setState({
      view: page,
      user: user,
      posts: []
    });
    this.getUserInfo();
    this.getPosts();
  }

  setSignin() {
    this.setState({
      isSignedIn: true
    });
    this.getPosts();
  }

  setSignout() {
    this.setState({
      isModalOpen: false,
      isSignedIn: false,
      user: {}
    });
    this.getPosts();
  }

  getPosts() {
    const token = window.localStorage.getItem('omega-gram-token');
    fetch('/api/gram/?sortBy=createdAt:desc', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          posts: data
        });
      })
      .catch(err => console.error(err.message));
  }

  addImage(form, post, category) {
    this.setState({
      isUploading: true
    });
    const _id = this.state.user._id;
    fetch(`/api/gram/image/${_id}`, {
      method: 'POST',
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

  addPost(post) {
    this.setState({
      isUploading: true
    });
    const token = window.localStorage.getItem('omega-gram-token');
    fetch('/api/gram/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(post)
    }).then(res => res.json())
      .then(data => {
        this.setState({
          posts: [data, ...this.state.posts],
          isUploading: false,
          isModalOpen: false
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

  updatePost(updatedNote) {
    const token = window.localStorage.getItem('omega-gram-token');
    const arr = [...this.state.posts];
    const newArr = arr.map(note => {
      if (note._id === updatedNote.id) {
        note.description = updatedNote.description;
        note.imgUrl = updatedNote.imgUrl;
        note.thumbnailImgUrl = updatedNote.thumbnailImgUrl;
      }
      return note;
    });
    if (token) {
      fetch(`/api/gram/${updatedNote.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
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
    const token = window.localStorage.getItem('omega-gram-token');
    const { selectedPostId, posts } = this.state;
    if (token) {
      fetch(`/api/gram/${selectedPostId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
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
    const token = window.localStorage.getItem('omega-gram-token');
    if (token) {
      fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          this.setState({
            user: data
          });
          this.setSignin();
        })
        .catch(err => console.error(err.message));
    }
  }

  signout() {
    const token = window.localStorage.getItem('omega-gram-token');
    if (token) {
      fetch('/api/users/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          window.localStorage.removeItem('omega-gram-token');
          this.setSignout();
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
      searchKeyword,
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
            isSignedIn={isSignedIn}
            isModalOpen={isModalOpen}
            openModal={openModal}
            keyword={keyword}
            posts={posts}/>
        );
        break;
      case 'signin':
        element = (
          <Signin
            setPage={setPage}
            setSignin={setSignin}
            isUploading={isUploading}
          />
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
