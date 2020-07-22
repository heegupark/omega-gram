import React, { Component } from 'react';
import TopGrammers from './top-grammers';
import TopFollowers from './top-followers';
import { Accordion, Card } from 'react-bootstrap';
import Input from './input';

class Intro extends Component {
  constructor(props) {
    super(props);
    this.handleInputClick = this.handleInputClick.bind(this);
  }

  handleNoteInputChange() {
    event.preventDefault();
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      note: event.target.value
    });
  }

  handleInputClick() {
    this.props.openModal('create');
  }

  render() {
    const {
      isSignedIn,
      getPosts,
      postsOfOthers,
      addFollowing,
      isUploading
    } = this.props;
    const { handleInputClick } = this;
    return (
      <main>
        <div className="row my-3 mx-auto fixed-top bg-white input-box">
          <Input
            isSignedIn={isSignedIn}
            isUploading={isUploading}
            handleInputClick={handleInputClick}
          />
        </div>
        <div
          className='row mx-auto post-box'>
          <div className='col-sm mx-auto'>
            {postsOfOthers
              ? (
                <>
                  <p className="text-center">{'This user hasn\'t posted anything yet.'}</p>
                  <p className="text-center">{'Please visit later!'}</p>
                  <p className="text-center">do you want to follow others?</p>
                </>
              )
              : (
                <>
                  <p className="text-center">{'why don\'t you start writing a small note?'}</p>
                  <p className="text-center">{'Or, follow someone to see their posts'}</p>
                  <p className="text-center">do you want to follow?</p>
                </>
              )
            }
            <Accordion defaultActiveKey="0" className="mx-auto w-accordion">
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0" className="cursor">
                  popular posters
                  <span className="ml-2 text-warning">{'*click name to view their posts or follow!'}</span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <TopGrammers
                      addFollowing={addFollowing}
                      getPosts={getPosts}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1" className="cursor">
                  popular followings
                  <span className="ml-2 text-warning">{'*click name to view their posts or follow!'}</span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <TopFollowers
                      addFollowing={addFollowing}
                      getPosts={getPosts}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </div>
      </main>
    );
  }
}

export default Intro;
