import React, { Component } from 'react';

class Input extends Component {
  render() {
    const {
      isSignedIn,
      isUploading,
      handleInputClick
    } = this.props;
    return (
      <div className="col-sm mx-auto input-group">
        <textarea
          rows="2"
          style={{ display: isSignedIn ? '' : 'none' }}
          className="form-control resize-none input-text"
          type="text"
          onClick={handleInputClick}
          placeholder={isUploading ? 'writing...' : 'what do you have today? click here to post fun things!'} />
      </div>
    );
  }
}

export default Input;
