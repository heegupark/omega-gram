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
          <p className="mx-auto my-3 text-warning text-center">This application is in-progress. I built this app using React, Node.js, and MongoDB to provide a function for users to create a post with an image and follow others to view their posts.</p>
          <div className="mx-3 my-2 text-center text-secondary">{'If you have any questions, please email to '}<a href="mailto:omegathrone@omegathrone.com">omegathrone@omegathrone.com</a>.</div>
        </div>
      </div>
    );
  }
}

export default Disclaimer;
