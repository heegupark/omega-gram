import React, { Component } from 'react';

class Delete extends Component {
  render() {
    const {
      imgUrl,
      description,
      handleDeletePostClick,
      handleModalCancelClick
    } = this.props;
    return (
      <>
        <div className="text-center bg-dark">
          <p className="h5 mt-3 text-white">Do you really want to delete this post?</p>
        </div>
        <div className="mx-auto rounded note-edit-custom">
          {imgUrl
            ? (
              <img
                alt=""
                className="w-100 img-fluid mx-auto img-thumbnail rounded"
                src={imgUrl}
              />
            )
            : (
              ''
            )
          }
        </div>
        <div className="row mx-auto rounded note-edit-custom">
          <textarea
            disabled
            className="mt-1 bg-white mx-auto px-2 py-1 rounded resize-none border-light"
            value={description} />
        </div>
        <div className="text-center mb-3">
          <div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger mx-2 btn-custom my-1"
              onClick={handleDeletePostClick}>Delete</button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mx-2 btn-custom my-1"
              onClick={handleModalCancelClick}>Close</button>
          </div>
        </div>
      </>
    );
  }
}

export default Delete;
