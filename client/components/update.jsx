import React, { Component } from 'react';

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: this.props.imgUrl,
      file: null,
      fileObject: null,
      fileName: null,
      previewFileObject: null,
      description: this.props.description
    };
    this.handleUpdatePostClick = this.handleUpdatePostClick.bind(this);
    this.handleUpdateInputChange = this.handleUpdateInputChange.bind(this);
    this.handleUpdateFileInputChange = this.handleUpdateFileInputChange.bind(this);
    this.handleFileDropChange = this.handleFileDropChange.bind(this);
    this.handleUploadBtnClick = this.handleUploadBtnClick.bind(this);
    this.uploader = React.createRef();
    this.textarea = React.createRef();
  }

  handleUploadBtnClick() {
    event.preventDefault();
    this.uploader.current.click();
  }

  handleUpdateInputChange() {
    event.preventDefault();
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      description: event.target.value
    });
  }

  handleUpdateFileInputChange() {
    event.preventDefault();
    this.setState({
      file: event.target.files[0],
      fileObject: URL.createObjectURL(event.target.files[0]),
      previewFileObject: URL.createObjectURL(event.target.files[0]),
      fileName: event.target.files[0].name
    });
  }

  handleFileDropChange() {
    event.preventDefault();
    this.setState({
      file: event.dataTransfer.files[0],
      fileObject: URL.createObjectURL(event.dataTransfer.files[0]),
      previewFileObject: URL.createObjectURL(event.dataTransfer.files[0]),
      fileName: event.dataTransfer.files[0].name
    });
  }

  handleUpdatePostClick() {
    event.preventDefault();
    const { file, fileName, description, imgUrl } = this.state;
    const { user, selectedPostId, addImage, updatePost } = this.props;
    const pathArr = imgUrl.split('/');
    const altFilename = pathArr[pathArr.length - 1];
    const changedImageName = fileName ? `${fileName.split(' ').join('')}` : altFilename;
    const form = new FormData();
    const updatedPost = {
      id: selectedPostId,
      description: description,
      imgUrl: `gram/${user._id}/${changedImageName}`,
      thumbnailImgUrl: `gram/${user._id}/thumbnail-${changedImageName}`
    };
    if (file) {
      form.append('image', file, changedImageName);
      addImage(form, updatedPost, 'update');
    } else {
      updatePost(updatedPost);
    }
  }

  render() {
    const {
      uploader,
      textarea,
      handleUploadBtnClick,
      handleFileDropChange,
      handleUpdateFileInputChange,
      handleUpdateInputChange,
      handleUpdatePostClick
    } = this;
    const {
      isUploading,
      handleModalCancelClick
    } = this.props;
    const { description, imgUrl, fileObject, previewFileObject } = this.state;
    return (
      <>
        <div className="text-center">
          <div className="mx-auto">
            <div className="note-edit-custom">
              {isUploading
                ? (
                  <div className="mx-auto my-auto">
                    <img
                      alt=""
                      className="w-100 img-fluid img-thumbnail rounded"
                      src={previewFileObject || imgUrl}
                      style={{ opacity: '0.6' }} />
                    <div
                      style={{ display: isUploading ? 'block' : 'none' }}
                      className="spinner-location-update-custom position-absolute spinner-border text-success"
                      role="status">
                      <span className="sr-only"></span>
                    </div>
                  </div>
                )
                : imgUrl || fileObject
                  ? (
                    <div className="mx-auto my-auto">
                      <img
                        alt=""
                        className="w-100 cursor img-fluid rounded"
                        src={previewFileObject || imgUrl}
                        onClick={handleUploadBtnClick}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleFileDropChange} />
                    </div>
                  )
                  : (
                    <button
                      className="w-100 add-image-btn-custom text-secondary"
                      onClick={handleUploadBtnClick}
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleFileDropChange}>
                      {'Add Image (click or drag)'}
                    </button>
                  )
              }
              <input
                hidden
                type="file"
                ref={uploader}
                onChange={handleUpdateFileInputChange} />
            </div>
            <textarea
              autoFocus
              required
              // rows="3"
              ref={textarea}
              disabled={isUploading}
              className="mx-auto form-control bg-white px-2 py-1 rounded resize-none w-100 border-light"
              value={description}
              onChange={handleUpdateInputChange}
              onFocus={e => {
                e.target.selectionStart = e.target.value.length;
              }} />
          </div>
        </div>
        <div className="text-center mb-1 mt-1">
          <div>
            <button
              type="button"
              disabled={isUploading}
              className="btn btn-sm btn-outline-warning mx-2 btn-custom mb-1"
              onClick={handleUpdatePostClick}>Update</button>
            <button
              type="button"
              disabled={isUploading}
              className="btn btn-sm btn-outline-secondary mx-2 btn-custom mb-1"
              onClick={handleModalCancelClick}>Close</button>
          </div>
        </div>
      </>
    );
  }
}

export default Update;
