# Introduction
ODC is Orange Digital Center, which provides enthusiast learners with knowledge and tries to make an IMPACT on them.
## Summary
In 7 Days I managed to create a backend service for a System who Provides online/offline Courses, Admin Panel to use CRUD operation using RESTful API for courses and students, assign students to specific course and the system will check if course’s prerequisites match student skills. if so, the system will add the student to a course group which has available places left, if not the system will add the specific student to rejected document in database with the required skill that he’s missing to enroll the course so in the future I can use these data to send course recommendation to rejected student.
the system has an authorization and authentication to ensure if the user has a permission to use a specific feature. 

## Project
It's a Backend service for automated courses system to ensure that a student applied to a specific course is actually meets the requirements/prerequisites of this course. 

## usage
* It has courses recommendation system for rejected students on specific courses
by sending them a mail with one of course's prerequisites which he applied to.
* It uses JWT for Authentication, and Authorization.
* It uses OTP on registration, by sending an email to the user with the OTP. 
* It uses KMP (Knuth-Morris-Pratt) Algorithm to search for any course.
* It uses Levenshtein Distance Algorithm to find any similar courses with the name provided.

## Technology
* Node.js
* Express.js
* MongoDB
* Some other libraries. 
