import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      search: ''
    };
    this.handleLogoClick = this.handleLogoClick.bind(this);
    this.handleSigninClick = this.handleSigninClick.bind(this);
    this.handleSignoutClick = this.handleSignoutClick.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSearchCancelClick = this.handleSearchCancelClick.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleViewUserProfile = this.handleViewUserProfile.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  handleLogoClick() {
    this.props.setPage('main');
  }

  handleSigninClick() {
    this.props.setPage('signin');
  }

  handleSignoutClick() {
    this.props.openModal('signout');
  }

  handleSearchInputChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      search: event.target.value.trim()
    });
  }

  handleSubmitSearch(e) {
    e.preventDefault();
    const { search } = this.state;
    if (this.state.search.length > 0) {
      if (this.state.search[0] === '@') {
        this.props.searchUsers(search.trim().slice(1));
      } else {
        this.props.searchKeyword(search.trim());
      }
    }
  }

  handleSearchClick() {
    const { isModalOpen, isUploading } = this.props;
    if (!isModalOpen && !isUploading) {
      this.setState({
        isSearch: true
      });
    }
  }

  handleSearchCancelClick() {
    this.setState({
      isSearch: false,
      search: ''
    });
    // this.props.searchKeyword('');
  }

  handleViewUserProfile() {
    this.props.setPage('user');
  }

  render() {
    const {
      handleLogoClick,
      handleSigninClick,
      handleSearchInputChange,
      handleSearchCancelClick,
      handleSearchClick,
      handleViewUserProfile,
      handleSubmitSearch
    } = this;
    const {
      view,
      isSignedIn,
      isModalOpen,
      isUploading
    } = this.props;
    const { isSearch, search } = this.state;
    let displayStyle = 'none';
    if ((view !== 'signin') && isSignedIn) {
      displayStyle = '';
    }
    return (
      <header>
        <nav className="navbar bg-dark fixed-top">
          {isSearch && !isUploading && !isModalOpen
            ? (
              <form
                onSubmit={handleSubmitSearch}
                className="search-input search-input-box mx-auto">
                <div className="form-group" style={{ display: displayStyle }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="search posts or users(type with '@')"
                    className="form-control pl-2 mx-auto rounded topdown-animation w-100"
                    value={search}
                    onBlur={handleSearchCancelClick}
                    onChange={handleSearchInputChange}
                  />
                  <button
                    type="button"
                    className="topdown-animation text-secondary border-0 bg-transparent position-absolute search-cancel-btn"
                    onClick={handleSearchCancelClick}>
                      X
                  </button>
                </div>
              </form>
            )
            : (
              <>
                <div
                  className="input-group search-input-icon-box"
                  style={{ display: displayStyle }}>
                  <div
                    disabled={!isUploading}
                    className="search-icon text-white text-center cursor hover-blue"
                    onClick={handleSearchClick}>
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                <div className="mx-auto">
                  <div className="col my-auto text-center logo-box">
                    <img className="omega-logo mr-1 mb-1" src="images/o-logo.png" />
                    <div className="navbar-brand text-white mx-auto omega-note hover-blue" onClick={handleLogoClick}>gram</div>
                    <span className="badge badge-warning ml-1 pb-0">beta</span>
                  </div>
                </div>
                <div className="signin-box" style={{ display: displayStyle }}>
                  <div className="text-center text-white mx-auto mt-1">
                    {isSignedIn
                      ? (
                        /* <span
                      className="username cursor hover-blue"
                      onClick={handleViewUserProfile}>{username || ''}</span> */
                        <span
                          className="username cursor hover-blue"
                          onClick={handleViewUserProfile}>
                          <i className="fas fa-user-alt"></i>
                        </span>
                      )
                      // <button
                      //   disabled={isModalOpen || isUploading}
                      //   className="mt-2 btn signin-btn text-light"
                      //   onClick={handleSignoutClick}>
                      //   <i className="fas fa-sign-out-alt"></i>
                      // </button>
                      : (<button
                        disabled={isModalOpen || isUploading}
                        className="mt-2 btn signin-btn text-white hover-blue"
                        onClick={handleSigninClick}>
                        <i className="fas fa-sign-in-alt"></i>
                      </button>
                      )
                    }
                  </div>
                </div>
              </>
            )
          }
        </nav>
      </header>
    );
  }
}

export default Header;
