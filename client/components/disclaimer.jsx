import React, { Component } from 'react';

class Disclaimer extends Component {
  constructor() {
    super();
    this.handleAcceptClick = this.handleAcceptClick.bind(this);
  }

  handleAcceptClick() {
    localStorage.setItem('omegagramaccept', true);
    this.props.handleDisclaimerAccept(true);
  }

  render() {
    const { handleAcceptClick } = this;
    return (
      <div className="modal">
        <div className="modal-content">
          <p className="mx-auto my-3 h4">Welcome to Omega Gram</p>
          <div className="mx-3 my-2 text-center">This app is created strictly for demonstration purposes. By clicking the button below, you accept that Omega Gram do not guarantee storing the notes that you write and the images that you upload.</div>
          <button className="btn btn-sm btn-danger mx-auto my-3" onClick={handleAcceptClick}>Accept</button>
          <p className="mx-auto my-3 h6 text-secondary">tips</p>
          <div className="mx-3 my-2 text-center text-secondary">{'If you sign in, you can edit your posts. If you don\'t sign in, you will use Omega Gram as a guest. If you want to delete your posts, please email to '}<a href="mailto:omegathrone@omegathrone.com">omegathrone@omegathrone.com</a>.</div>
        </div>
      </div>
    );
  }
}

export default Disclaimer;
