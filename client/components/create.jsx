import React, { Component } from 'react';

class Create extends Component {
  constructor() {
    super();
    this.state = {
      description: '',
      file: '',
      fileObject: '',
      previewFileObject: '',
      fileName: '',
      placeholder: 'do you have something fun?'
    };
    this.handleCreatePostClick = this.handleCreatePostClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileUploadBtnClick = this.handleFileUploadBtnClick.bind(this);
    this.handleFileDropChange = this.handleFileDropChange.bind(this);
    this.handleUpdateFileInputChange = this.handleUpdateFileInputChange.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.uploader = React.createRef();
  }

  handleInputChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      description: event.target.value
    });
  }

  handleFileUploadBtnClick() {
    event.preventDefault();
    this.uploader.current.click();
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

  showMessage(message, time) {
    const original = this.state.placeholder;
    setTimeout(() => {
      this.setState({
        placeholder: original
      });
    }, time);
    this.setState({
      placeholder: message
    });
  }

  handleCreatePostClick() {
    event.preventDefault();
    const { file, fileName, description } = this.state;
    if (!description) {
      this.showMessage('anything fun today?', 1000);
    } else {
      const { user, addImage, addPost } = this.props;
      // const pathArr = imgUrl.split('/');
      // const altFilename = pathArr[pathArr.length - 1];
      // const changedImageName = fileName ? `${fileName.split(' ').join('')}` : '';
      const fileNameSplit = fileName ? fileName.split('.') : '';
      const extention = fileNameSplit[fileNameSplit.length - 1];
      const randomFileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const changedImageName = fileName ? `${randomFileName}.${extention}` : '';
      const form = new FormData();
      const post = {
        description: description,
        imgUrl: changedImageName ? `gram/${user._id}/${changedImageName}` : '',
        thumbnailImgUrl: changedImageName ? `gram/${user._id}/thumbnail-${changedImageName}` : ''
      };
      if (file) {
        form.append('image', file, changedImageName);
        addImage(form, post, 'create');
      } else {
        addPost(post);
      }
    }
  }

  render() {
    const {
      handleInputChange,
      handleUpdateFileInputChange,
      handleFileUploadBtnClick,
      handleFileDropChange,
      handleCreatePostClick,
      uploader
    } = this;
    const {
      isUploading,
      handleModalCancelClick
    } = this.props;
    const {
      text,
      fileObject,
      previewFileObject,
      placeholder
    } = this.state;
    return (
      <>
        <div className="text-center">
          <textarea
            autoFocus
            rows="3"
            disabled={isUploading}
            className="form-control resize-none input-text bg-outline-secondary"
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder={isUploading ? 'writing...' : placeholder}
          />
        </div>
        <div className="text-center mb-3">
          <div className="mx-auto">
            {isUploading
              ? (
                <div className="mx-auto my-auto">
                  <img
                    alt=""
                    className="w-100 img-fluid img-thumbnail rounded"
                    src={previewFileObject}
                    style={{ opacity: '0.6' }} />
                  <div
                    style={{ display: isUploading ? 'block' : 'none' }}
                    className="spinner-location-update-custom position-absolute spinner-border text-dark"
                    role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              )
              : fileObject
                ? (
                  <div className="mx-auto my-auto note-edit-custom">
                    <img
                      alt=""
                      className="w-100 cursor img-fluid rounded"
                      src={previewFileObject}
                      onClick={handleFileUploadBtnClick}
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleFileDropChange} />
                  </div>
                )
                : (
                  <button
                    className="w-100 add-image-btn-custom text-secondary"
                    onClick={handleFileUploadBtnClick}
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
        </div>
        <div className="text-center mb-3">
          <div>
            <button
              type="button"
              disabled={isUploading}
              className="btn btn-sm btn-outline-dark mx-2 btn-custom mb-1"
              onClick={handleCreatePostClick}>Post</button>
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

export default Create;
