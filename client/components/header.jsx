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
    if (this.state.search.length > 0) {
      if (this.state.search[0] === '@') {
        this.props.searchUsers(event.target.value.trim().slice(1));
      } else {
        this.props.searchKeyword(event.target.value.trim());
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
    this.props.searchKeyword('');
  }

  handleViewUserProfile() {
    this.props.setPage('user');
  }

  render() {
    const {
      handleLogoClick,
      handleSigninClick,
      // handleSignoutClick,
      handleSearchInputChange,
      handleSearchCancelClick,
      handleSearchClick,
      handleViewUserProfile
    } = this;
    const {
      view,
      // username,
      isSignedIn,
      isModalOpen,
      isUploading
    } = this.props;
    const { isSearch, search } = this.state;
    return (
      <header>
        <nav className="navbar bg-dark fixed-top">
          {isSearch && !isUploading && !isModalOpen
            ? (
              <>
                <div
                  className="input-group search-input-box"
                  style={{ display: view === 'main' && isSignedIn ? '' : 'none' }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="search posts or users(type with '@')"
                    className="pl-2 mx-auto rounded search-input topdown-animation"
                    value={search}
                    onBlur={handleSearchCancelClick}
                    onChange={handleSearchInputChange}
                  />
                  <button
                    className="topdown-animation text-secondary border-0 bg-transparent position-absolute search-cancel-btn"
                    onClick={handleSearchCancelClick}>
                          X
                  </button>
                </div>
              </>
            )
            : (
              <>
                <div
                  className="input-group search-input-icon-box"
                  style={{ display: view === 'main' && isSignedIn ? '' : 'none' }}>
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
                  </div>
                </div>
                <div className="signin-box" style={{ display: view === 'main' || view === 'user' ? '' : 'none' }}>
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
          {/* <div
            className="input-group search-input-box"
            style={{ display: view === 'main' && isSignedIn ? '' : 'none' }}>
            {isSearch && !isUploading && !isModalOpen
              ? (
                <>
                  <input
                    type="text"
                    placeholder="search"
                    className="pl-2 search-input wide-animation"
                    value={search}
                    style={{ zIndex: '1' }}
                    onChange={handleSearchInputChange}
                  />
                  <div
                    className="input-group-append"
                    style={{ zIndex: '1' }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleSearchCancelClick}>
                      X
                    </button>
                  </div>
                </>
              )
              : (
                <div
                  disabled={!isUploading}
                  className="search-icon text-white text-center cursor"
                  onClick={handleSearchClick}>
                  <i className="fas fa-search"></i>
                </div>
              )
            }
          </div>
          <div className="mx-auto">
            <div className="col my-auto text-center logo-box">
              <img className="omega-logo mr-1 mb-1" src="images/o-logo.png" />
              <div className="navbar-brand text-white mx-auto omega-note" onClick={handleLogoClick}>gram</div>
            </div>
          </div>
          <div className="signin-box" style={{ display: view !== 'main' ? 'none' : '' }}>
            <div className="text-center text-white mx-auto mt-1">
              <span className="username">{username || ''}</span>
              {isSignedIn
                ? <button
                  disabled={isModalOpen || isUploading}
                  className="mt-2 btn signin-btn text-light"
                  onClick={handleSignoutClick}>
                  <i className="fas fa-sign-out-alt"></i>
                </button>
                : <button
                  disabled={isModalOpen || isUploading}
                  className="mt-2 btn signin-btn text-white"
                  onClick={handleSigninClick}>
                  <i className="fas fa-sign-in-alt"></i>
                </button>
              }
            </div>
          </div> */}
        </nav>
      </header>
    );
  }
}

export default Header;
