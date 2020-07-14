import React, { Component } from 'react';

class Enlarge extends Component {
  render() {
    const {
      imgUrl,
      description,
      handleModalCancelClick
    } = this.props;
    return (
      <>
        <div className="text-center mb-1">
          <div className="row mx-auto rounded note-edit-custom">
            <div className="mx-auto">
              <img
                alt=""
                className="img-fluid rounded"
                src={imgUrl}
              />
            </div>
          </div>
          <div className="row mx-auto rounded note-edit-custom">
            <textarea
              // rows="3"
              disabled
              className="col mt-1 bg-white px-2 py-1 rounded resize-none w-100 border-light"
              value={description} />
          </div>
        </div>
        <div className="text-center mb-1">
          <button
            type="button"
            className="mb-1 btn btn-sm btn-outline-secondary mx-3 pb-0"
            onClick={handleModalCancelClick}>close</button>
        </div>
      </>
    );
  }
}

export default Enlarge;
