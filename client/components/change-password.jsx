import React, { Component } from 'react';

class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      newPassword: '',
      newPasswordConfirm: '',
      message: '',
      isChanged: false
    };
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleCloseBtnClick = this.handleCloseBtnClick.bind(this);
    this.handleChangeBtnClick = this.handleChangeBtnClick.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  handleChangeInput() {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleCloseBtnClick() {
    this.props.handleModalCancelClick();
  }

  showMessage(message, time) {
    setTimeout(() => {
      this.setState({
        message: ''
      });
    }, time);
    this.setState({
      message
    });
  }

  handleChangeBtnClick(e) {
    e.preventDefault();
    const token = window.localStorage.getItem(process.env.AUTH_TOKEN_STRING);
    const { newPassword, newPasswordConfirm } = this.state;
    if (newPassword.length < 1) {
      this.showMessage('new password is required', 1000);
    } else if (newPasswordConfirm.length < 1) {
      this.showMessage('new password confirm is required', 1000);
    } else if (newPassword !== newPasswordConfirm) {
      this.showMessage('passwords don\'t match', 1000);
    } else {
      fetch('/api/users/password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          newPassword
        })
      })
        .then(res => res.json())
        .then(message => {
          this.showMessage(message.message, 1000);
          this.setState({
            isChanged: message.success
          });
        })
        .catch(err => {
          console.error(`Something wrong happened while changing password:${err.message}`);
        });
    }
  }

  render() {
    const { handleChangeInput, handleChangeBtnClick, handleCloseBtnClick } = this;
    const { newPassword, newPasswordConfirm, message, isChanged } = this.state;
    return (
      <>
        <div className="text-center bg-dark">
          <p className="h5 mt-3 text-white">change password</p>
        </div>
        <div className="row mt-4 mb-2 mx-2">
          <div className="col my-auto">
            new password
          </div>
          <div className="col">
            <input
              required
              id="newPassword"
              type="password"
              className="w-100"
              disabled={isChanged}
              value={newPassword}
              onChange={handleChangeInput} />
          </div>
        </div>
        <div className="row my-2 mx-2">
          <div className="col my-auto">
            new password confirm
          </div>
          <div className="col">
            <input
              required
              id="newPasswordConfirm"
              type="password"
              className="w-100"
              disabled={isChanged}
              value={newPasswordConfirm}
              onChange={handleChangeInput} />
          </div>
        </div>
        <div className="row my-2 mx-2">
          <div className="col my-auto h-40 text-danger text-center">{message}</div>
        </div>
        <div className="row mt-2 mb-3 mx-2">
          <div className="col text-center">
            <button
              style={{ display: isChanged ? 'none' : '' }}
              className="btn btn-sm btn-outline-danger mx-2 w-75px"
              onClick={handleChangeBtnClick}>change</button>
            <button
              className="btn btn-sm btn-outline-secondary mx-2 w-75px"
              onClick={handleCloseBtnClick}>cancel</button>
          </div>
        </div>
      </>
    );
  }
}

export default ChangePassword;
