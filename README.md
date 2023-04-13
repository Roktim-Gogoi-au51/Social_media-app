# Social_media-app

Project Report: Backend Project for Social Media Web Application


Introduction: The purpose of this project is to create a backend system for managing user
profiles, posts, comments, likes, and follows in a web application. The project is built using
the Express.js framework on the server-side and uses MongoDB as the database.


Project Scope: The project aims to provide the following functionalities to the users of the
web application:
1. User Management: Users can create a profile, log in, and authenticate themselves.
User profiles will contain basic information such as name, email address, and
password.
2. Posts Management: Users can create, view, and update posts.
3. Commenting: Users can comment on other users' posts. Each comment will include
the user's name and the comment text.
4. Likes: Users can like posts. Each post will display the number of likes it has received.
5. Follow and Unfollow: Users can follow and unfollow other users. Users will be able
to view the number of users they are following and the number of users who are
following them.
6. Notifications: Users receive notifications when someone likes or comments on their
post, or when someone follows them.


Data Model: The data model for this project includes the following collections:
1. Users: Contains information about the users of the web application, such as name,
email address and password.
2. Profiles: Contains information about the user profiles, such as name, username, email,
bio, profile image, a list of followers, followings, notifications, posts and feed. In the
followers list all the emails of the users are stored, same goes for the following’s list.
In the posts list all the posts are stored as an object and each object has a caption, an
image, a list of likes and a list of comments. In the feed list all the posts of the other
users that the user is following are stored as an object.

I didn’t created a separate model for followers, followings, likes, comments.
Everything I included in the Profiles collection.


Implementation: The project was implemented using the following technologies:
1. Server-side framework: Express.js
2. Database: MongoDB
3. Authentication: Passport.js with local strategy
4. Template-engine: EJS

The project was implemented using the Model-View-Controller (MVC) architecture. The
models represent the data and provide the interface for interacting with the database. The
views are responsible for rendering the data in a user-friendly manner. The controllers handle
the business logic and mediate between the models and the views.


Conclusion: The project has successfully implemented a backend system for managing user
profiles, posts, comments, likes, and follows in a web application. The project has used the
Express.js framework on the server-side and MongoDB as the database. The project has
followed the MVC architecture, which has made it easy to develop and maintain the
codebase. The project has provided a number of functionalities to the users of the web
application, such as user authentication, post management, commenting, likes, follows and
unfollows, and notifications
