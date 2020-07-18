import React, { Component } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import BasicInformation from './basic-information';
import Followings from './followings';
import Followers from './followers';

class User extends Component {
  constructor() {
    super();
    this.state = {
      followers: []
    };
    this.handleUsernameClick = this.handleUsernameClick.bind(this);
    this.handleUnfollowBtnClick = this.handleUnfollowBtnClick.bind(this);
    this.handleSignoutClick = this.handleSignoutClick.bind(this);
    this.getFollowers = this.getFollowers.bind(this);
  }

  componentDidMount() {
    this.getFollowers();
  }

  handleUsernameClick() {
    this.props.setPage('main', this.props.user, event.target.id);
  }

  handleUnfollowBtnClick() {
    this.props.stopFollowing(event.target.id);
  }

  handleSignoutClick() {
    this.props.openModal('signout');
  }

  getFollowers() {
    const authToken = window.localStorage.getItem(process.env.AUTH_TOKEN_STRING);
    if (authToken) {
      fetch('/api/followers', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(followers => {
          this.setState({
            followers
          });
        })
        .catch(err => {
          console.error(`Something wrong happened while getting followers:${err.message}`);
        });
    }
  }

  render() {
    const { handleUsernameClick, handleUnfollowBtnClick, handleSignoutClick } = this;
    const { followers } = this.state;
    const { user, openModal, updateUserInfo, addFollowing } = this.props;
    const numberOfFollowings = user ? user.followings.length : 0;
    const numberOfFollowers = followers.length || 0;
    return (
      <main>
        <div className="mx-auto row user-profile-box">
          <div className="col text-center">
            <p className="h4">user profile</p>
          </div>
        </div>
        <Accordion defaultActiveKey="0" className="mx-auto w-accordion">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0" className="cursor">
              basic information
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <BasicInformation
                  user={user}
                  openModal={openModal}
                  updateUserInfo={updateUserInfo}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1" className="cursor">
              {numberOfFollowings ? `followings (${numberOfFollowings} following${numberOfFollowings > 1 ? 's' : ''})` : 'followings'}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Followings
                  user={user}
                  handleUsernameClick={handleUsernameClick}
                  handleUnfollowBtnClick={handleUnfollowBtnClick}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2" className="cursor">
              {numberOfFollowers ? `followers (${numberOfFollowers} follower${numberOfFollowers > 1 ? 's' : ''})` : 'followers'}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <Followers
                  user={user}
                  followers={followers}
                  handleUnfollowBtnClick={handleUnfollowBtnClick}
                  addFollowing={addFollowing}
                  handleUsernameClick={handleUsernameClick}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <hr></hr>
        <div className="mt-5">
          <div className="text-center">
            <button className="btn btn-sm btn-outline-secondary cursor" onClick={handleSignoutClick}>
              sign out
            </button>
          </div>
        </div>
      </main>
    );
  }
}

export default User;
