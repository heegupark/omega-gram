import React, { Component } from 'react';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordconfirm: '',
      message: '',
      mode: 'signin',
      isSigningIn: false,
      isSigningUp: false
    };
    this.handleSignupClick = this.handleSignupClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSigninClick = this.handleSigninClick.bind(this);
    this.handleSigninSubmit = this.handleSigninSubmit.bind(this);
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
    this.handleBackToMain = this.handleBackToMain.bind(this);
    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
    this.inputEmail = React.createRef();
  }

  componentDidMount() {
    this.inputEmail.current.focus();
  }

  handleSignupClick() {
    this.setState({
      mode: 'signup',
      message: 'Please DO NOT use real email address'
    });
  }

  handleSigninClick() {
    this.setState({
      mode: 'signin',
      message: ''
    });
  }

  handleCancelClick() {
    this.setState({
      username: '',
      email: '',
      password: '',
      message: '',
      passwordconfirm: ''
    });
  }

  handleInputChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handlePasswordValueChange() {
    this.setState({
      password: event.target.value
    });
  }

  handleBackToMain() {
    this.props.setPage('main');
  }

  handleSignupSubmit() {
    const { username, email, password, passwordconfirm } = this.state;
    const { signup } = this;
    if (password !== passwordconfirm) {
      this.setState({
        message: 'Passwords don\'t match.'
      });
    } else {
      const credential = {
        username,
        email,
        password
      };
      signup(credential);
      this.setState({
        username: '',
        email: '',
        password: '',
        passwordconfirm: '',
        isSigningUp: true
      });
    }
  }

  handleSigninSubmit() {
    const { email, password } = this.state;
    const { signin } = this;
    const credential = {
      email,
      password
    };
    this.setState({
      password: '',
      isSigningIn: true
    });
    signin(credential);
  }

  signin(credential) {
    fetch('/api/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive'
      },
      body: JSON.stringify(credential)
    }).then(res => res.json())
      .then(data => {
        this.setState({
          isSigningIn: false
        });
        if (data.token && data.user) {
          window.localStorage.setItem('omega-gram-token', data.token);
          this.props.setPage('main', data.user);
          this.props.setSignin();
        } else {
          this.setState({
            message: 'Please check your email and password.',
            isSigningIn: false
          });
          this.inputEmail.current.focus();
        }
      })
      .catch(err => {
        console.error(`Something wrong happened while signing in:${err.message}`);
      });
  }

  signup(credential) {
    fetch('/api/users', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credential)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          isSigningUp: false
        });
        if (data.token && data.user) {
          window.localStorage.setItem('omega-gram-token', data.token);
          this.props.setPage('main', data.user);
          this.props.setSignin();
        } else {
          this.setState({
            message: 'Sign-Up is not completed.',
            isSigningUp: false
          });
        }
      })
      .catch(err => {
        console.error(`Something wrong happened while signing up:${err.message}`);
      });
  }

  render() {
    const {
      handleSignupClick,
      handleCancelClick,
      handleInputChange,
      handleSigninClick,
      handleSigninSubmit,
      handleSignupSubmit,
      handleBackToMain,
      inputEmail
    } = this;
    const { username, email, password, passwordconfirm, message, mode, isSigningIn, isSigningUp } = this.state;
    return (
      <main>
        <div className="row mx-auto sign-item-box">
          <div className="col-sm-6 mx-auto">
            <div className="h4 text-center text-secondary">{mode === 'signin' ? 'signin' : 'signup'}</div>
            {mode === 'signup'
              ? (
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label htmlFor="username" className="input-group-text bg-dark text-white"><i className="fas fa-user-tag"></i></label>
                  </div>
                  <input
                    required
                    id="username"
                    type="username"
                    className="form-control border-dark"
                    placeholder="username"
                    name="username"
                    value={username || ''}
                    onChange={handleInputChange}></input>
                </div>
              )
              : (
                <div className="h-54"></div>
              )
            }

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label htmlFor="email" className="input-group-text bg-dark text-white">@</label>
              </div>
              <input
                ref={inputEmail}
                required
                id="email"
                type="email"
                className="form-control border-dark"
                placeholder="email"
                name="email"
                value={email || ''}
                onChange={handleInputChange}></input>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label htmlFor="password" className="input-group-text bg-dark text-white"><i className="fas fa-key"></i></label>
              </div>
              <input
                required
                id="password"
                type="password"
                className="form-control border-dark"
                placeholder="password"
                name="password"
                value={password || ''}
                onChange={handleInputChange}></input>
            </div>
            {mode === 'signin'
              ? (
                <>
                  <div className="h-54">
                  </div>
                  <div className="text-center">
                    {isSigningIn
                      ? (
                        <>
                          <button
                            disabled
                            className="btn btn-sm btn-outline-dark mx-1 w-60px">
                            <div className="spinner-border spinner-border-sm text-dark mb-1" role="status">
                            </div>
                          </button>
                          <button
                            disabled
                            className="btn btn-sm btn-outline-secondary mx-1 w-60px">
                            <div className="spinner-border spinner-border-sm text-dark mb-1" role="status">
                            </div>
                          </button>
                        </>
                      )
                      : (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark mx-1 w-60px"
                            onClick={handleSigninSubmit}>signin</button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary mx-1 w-60px"
                            onClick={handleCancelClick}>cancel</button>
                        </>
                      )}
                  </div>
                </>
              )
              : (
                <>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <label htmlFor="passwordconfirm" className="input-group-text bg-dark text-white"><i className="fas fa-key"></i></label>
                    </div>
                    <input
                      type="password"
                      id="passwordconfirm"
                      className="form-control border-dark"
                      placeholder="password confirm"
                      name="passwordconfirm"
                      value={passwordconfirm || ''}
                      onChange={handleInputChange}></input>
                  </div>
                  <div className="text-center">
                    {isSigningUp
                      ? (
                        <>
                          <button
                            disabled
                            className="btn btn-sm btn-outline-dark mx-1 w-60px">
                            <div className="spinner-border spinner-border-sm text-dark mb-1" role="status">
                            </div></button>
                          <button
                            disabled
                            className="btn btn-sm btn-outline-secondary mx-1 w-60px">
                            <div className="spinner-border spinner-border-sm text-dark mb-1" role="status">
                            </div></button>
                        </>
                      )
                      : (
                        <>
                          <button
                            type = "button"
                            className = "btn btn-sm btn-outline-dark mx-1 w-60px"
                            onClick = { handleSignupSubmit }>signup</button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary mx-1 w-60px"
                            onClick={handleCancelClick}>cancel</button>
                        </>
                      )}

                  </div>
                </>
              )
            }
            <div className="row text-center h-54">
              <span className="text-danger mx-auto my-auto">{message}</span>
            </div>
            <div className="text-center my-3">
              <button
                className="btn btn-sm mx-1 text-dark sign-up-btn hover-blue"
                onClick={mode === 'signin' ? handleSignupClick : handleSigninClick}>{mode === 'signin' ? 'signup' : 'signin'}</button>
            </div>
            <div className="text-center my-3">
              <button
                className="btn btn-sm mx-1 text-secondary sign-up-btn hover-black"
                onClick={handleBackToMain}>back to main</button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Signin;
