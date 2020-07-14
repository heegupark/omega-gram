import React, { Component } from 'react';
import Signout from './signout';
import Create from './create';
import Update from './update';
import Delete from './delete';
import Enlarge from './enlarge';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleModalCancelClick = this.handleModalCancelClick.bind(this);
    this.handleModalSignoutClick = this.handleModalSignoutClick.bind(this);
    this.handleDeletePostClick = this.handleDeletePostClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.modal = React.createRef();
  }

  handleModalCancelClick() {
    this.props.closeModal();
  }

  handleModalSignoutClick() {
    this.props.signout();
  }

  handleDeletePostClick() {
    this.props.deletePost();
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

  handleUploadBtnClick() {
    event.preventDefault();
    this.uploader.current.click();
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

  handleOutsideClick(event) {
    if (this.modal.current.contains(event.target)) {
      return;
    }
    this.handleModalCancelClick();
  }

  render() {
    const {
      handleModalSignoutClick,
      handleModalCancelClick,
      handleDeletePostClick,
      handleOutsideClick,
      modal
    } = this;
    const {
      imgUrl,
      modalCategory,
      description,
      isUploading,
      user,
      selectedPostId,
      addImage,
      addPost,
      updatePost
    } = this.props;
    let element = null;
    switch (modalCategory) {
      case 'signout':
        element = (
          <Signout
            handleModalSignoutClick={handleModalSignoutClick}
            handleModalCancelClick={handleModalCancelClick}
          />
        );
        break;
      case 'create':
        element = (
          <Create
            user={user}
            addImage={addImage}
            addPost={addPost}
            isUploading={isUploading}
            handleModalCancelClick={handleModalCancelClick}
          />
        );
        break;
      case 'delete':
        element = (
          <Delete
            imgUrl={imgUrl}
            description={description}
            handleDeletePostClick={handleDeletePostClick}
            handleModalCancelClick={handleModalCancelClick}
          />
        );
        break;
      case 'update':
        element = (
          <Update
            user={user}
            imgUrl={imgUrl}
            isUploading={isUploading}
            description={description}
            selectedPostId={selectedPostId}
            addImage={addImage}
            updatePost={updatePost}
            handleModalCancelClick={handleModalCancelClick}
          />
        );
        break;
      case 'enlargeImage':
        element = (
          <Enlarge
            userId={user._id}
            postId={selectedPostId}
            imgUrl={imgUrl}
            description={description}
            handleModalCancelClick={handleModalCancelClick}
          />
        );
        break;
    }
    return (
      <div className="modal" onClick={handleOutsideClick}>
        <div ref={modal} className="modal-content fade-in">
          {element}
        </div>
      </div>
    );
  }
}

export default Modal;
