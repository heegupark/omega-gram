import React, { Component } from 'react';

class BasicInformation extends Component {
  constructor() {
    super();
    this.state = {
      isUpdate: false,
      isUpdating: false,
      username: '',
      email: '',
      message: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUpdateBtnClick = this.handleUpdateBtnClick.bind(this);
    this.handleUpdateStartBtnClick = this.handleUpdateStartBtnClick.bind(this);
    this.handleCancelBtnClick = this.handleCancelBtnClick.bind(this);
    this.handlePasswordBtnClick = this.handlePasswordBtnClick.bind(this);
    this.emailValidator = this.emailValidator.bind(this);
  }

  handleUpdateStartBtnClick() {
    this.setState({
      isUpdate: true
    });
  }

  handleCancelBtnClick() {
    this.setState({
      isUpdate: false,
      isUpdating: false,
      username: '',
      email: '',
      message: ''
    });
  }

  emailValidator(email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

  handleUpdateBtnClick(e) {
    e.preventDefault();
    const { username, email } = this.state;
    if (email && !this.emailValidator(email)) {
      this.setState({
        message: 'please provide valid email format'
      });
    } else {
      this.setState({
        isUpdate: false,
        isUpdating: true
      });
      const body = { username, email };
      this.props.updateUserInfo(body);
      this.setState({
        isUpdating: false,
        username: '',
        email: '',
        message: ''
      });
    }
  }

  handleInputChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    const { email } = this.state;
    if (email && this.emailValidator(email)) {
      this.setState({
        message: ''
      });
    }
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handlePasswordBtnClick() {
    this.props.openModal('changePassword');
  }

  render() {
    const { isUpdate, isUpdating, username, email, message } = this.state;
    const { user } = this.props;
    const {
      handleUpdateBtnClick,
      handleUpdateStartBtnClick,
      handleCancelBtnClick,
      handleInputChange,
      handlePasswordBtnClick
    } = this;
    return (
      <>
        {isUpdate
          ? (
            <div>
              <div className="row h-40">
                <div htmlFor={username} className="col my-auto">username:</div>
                <div className="col my-auto">
                  <input
                    id="username"
                    name="username"
                    value={username || ''}
                    placeholder={user.username}
                    onChange={handleInputChange} />
                </div>
              </div>
              <div className="row h-40">
                <div htmlFor={email} className="col my-auto">email:</div>
                <div className="col my-auto">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email || ''}
                    placeholder={user.email}
                    onChange={handleInputChange} />
                </div>
              </div>
              <div className="row h-40">
                <div className="col my-auto">member since:</div>
                <div className="col my-auto p-23">{user ? `${new Date(user.createdAt).toLocaleDateString()}` : ''}</div>
              </div>
              <div className="row h-40">
                <div className="col my-auto text-danger text-center">{message}</div>
              </div>
              <hr></hr>
              <div className="row h-40">
                <div className="mx-auto">
                  {isUpdating
                    ? (
                      <>
                        <button
                          disabled
                          className="mx-2 btn btn-sm btn-outline-warning my-auto w-75px">
                          <div className="spinner-border spinner-border-sm text-dark mb-1" role="status">
                          </div></button>
                        <button
                          disabled
                          className="mx-2 btn btn-sm btn-outline-secondary my-auto w-75px">
                          <div className="spinner-border spinner-border-sm text-dark mb-1" role="status">
                          </div></button>
                      </>
                    )
                    : (
                      <>
                        <button
                          className="mx-2 btn btn-sm btn-outline-warning my-auto w-75px"
                          onClick={handleUpdateBtnClick}>update</button>
                        <button
                          className="mx-2 btn btn-sm btn-outline-secondary my-auto w-75px"
                          onClick={handleCancelBtnClick}>cancel</button>
                      </>
                    )
                  }

                </div>
              </div>
            </div>
          )
          : (
            <>
              <div className= "row h-40">
                <div className="col my-auto">username:</div>
                <div className="col my-auto p-23">{user ? `${user.username}` : ''}</div>
              </div >
              <div className="row h-40">
                <div className="col my-auto">email:</div>
                <div className="col my-auto p-23">{user ? `${user.email}` : ''}</div>
              </div>
              <div className="row h-40">
                <div className="col my-auto">password:</div>
                <div className="col my-auto p-23">
                  <div
                    className="text-danger cursor border-0 hover-goldenrod"
                    onClick={handlePasswordBtnClick}>change password</div>
                </div>
              </div>
              <div className="row h-40">
                <div className="col my-auto">member since:</div>
                <div className="col my-auto p-23">{user ? `${new Date(user.createdAt).toLocaleDateString()}` : ''}</div>
              </div>
              <div className="row h-40">
                <div className="col my-auto text-danger text-center">{message}</div>
              </div>
              <hr></hr>
              <div className="row h-40">
                <div className="mx-auto">
                  <button
                    className="mx-auto btn btn-sm btn-outline-warning my-auto"
                    onClick={handleUpdateStartBtnClick}>update</button>
                </div>
              </div>
            </>
          )
        }
      </>
    );
  }
}

export default BasicInformation;
