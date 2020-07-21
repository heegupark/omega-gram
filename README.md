# o-gram

> - Maintained by: `Heegu Park`


## Functionality Overview
1. A client receive the data from a server and dynamically display the data in HTML format
    - to view the posts(text and image - accepts jpg, jpeg, gif, png)
    - to create a post, update a post, delete a post
    - to search posts, to search users
    - to make and view a comment to a post
    - to follow a user, unfollow a user
    - to sign up/sign in/sign out
    - to like, unlike a post
    - to bring top-posters data
    - to display comments of a post in real time
2. A server receives the data from the client
    - to create a post, to update a post, to delete a post
    - to follow a user, to unfollow a user
    - to search users
    - to handle sign up/sign in/sign out
    - to make and view a comment to a post
    - to search top-poster data
    - to display comments of a post in real time
3. Heavily used React to create all HTML elements(virtual DOM) to dynamically display all data using DOM upon the data from MongoDB database via API server created by using Node.js
4. Used Express to run the API server
5. Used mongo and mongoose module to connect MongoDB database
6. Used AWS EC2 for web and API server and MongoDB cloud for MongoDB database
7. Used multer to update an image and sharp to redize the image
8. Used socket.io to broadcast all comments in real time
9. Support most of mobile devices(iPad - Landsacpe/Portrait, iPhone X - Landsacpe/Portrait, iPhone 6s/7s/8s - Landsacpe/Portrait, iPhone 6/7/8 - Landsacpe/Portrait, and so on)

## Planned Features
1. User can view posts.
2. User can view the detail of a note.
3. User can create a post with an image.
4. User can sign up/sign in/sign out.
5. User can update a post.
6. User can delete a post .
7. User can search posts.
8. User can make a comment.
9. User can follow a user.
10. User can unfollow a user.
11. User can like a post.
12. User can unlike a post.
13. User can view the ones who liked a post.
14. User can view the comments of a post.

## Lessons Learned
1. Various ways of dynamically displaying data using React virtual DOM functions
2. Experienced to deal with various functions of React virtual DOM
3. Experienced to effectively use React and Bootstrap for displaying data
4. React and JavaScript Object Oriented Programming for better functionalities and to increase the re-usage of codes
5. Experienced to create API server using node.js to process the data with communicating with database and pass the data to client
6. Experienced to create MongoDB database to store and retrieve data upon the request of a client via API server
7. Experienced to upload a file using multer node module and to resize the image using sharp node module
8. Experienced to use socket.io to broadcast all coments of a post from other users in real time
9. Experienced to deploy the web and API server into AWS EC2 and create MongoDB database instance into MongoDB cloud

## Live Site
* You can see and test the live version here: <a href="https://gram.heegu.net" target="blank">gram.heegu.net</a>

## Screen shot
[Desktop]

![Omega Gram](https://github.com/heegupark/omega-gram/blob/master/gram-ss-001.gif)

[Real Time Comments]

![Omega Gram](https://github.com/heegupark/omega-gram/blob/master/gram-ss-004.gif)
