import React, { Component } from 'react';

class Signout extends Component {
  render() {
    const {
      handleModalSignoutClick,
      handleModalCancelClick
    } = this.props;
    return (
      <>
        <div className="text-center bg-dark">
          <p className="h5 mt-3 text-white">sign out</p>
        </div>
        <div className="text-center mt-3 mb-3">
          <p className="mt-3">Do you really want to sign out?</p>
        </div>
        <div className="text-center mb-3">
          <div>
            <button
              type="button"
              className="btn btn-sm btn-outline-dark mx-2 btn-custom mb-1"
              onClick={handleModalSignoutClick}>Sign Out</button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mx-2 btn-custom mb-1"
              onClick={handleModalCancelClick}>Close</button>
          </div>
        </div>
      </>
    );
  }
}

export default Signout;
