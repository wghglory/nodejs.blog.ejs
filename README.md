# Blog system

## skills or packages

package         | version | usage
--------------- | ------- | -------------------------------------
body-parser     | ^1.16.0 | request.body parser, json
compression     | ^1.6.2  | compress in production
connect-flash   | ^0.1.1  | error, info message pass
ejs             | ^2.5.5  | template engine
express         | ^4.14.1 | high level http server
express-session | ^1.15.0 | session management, default in memory
method-override | ^2.3.7  | http get post delete put
mongoose        | ^4.8.1  | mongodb schema, connect to mongodb
morgan          | ^1.7.0  | error info log
passport        | ^0.3.2  | login
passport-local  | ^1.0.0

## project startup

- uncompress db
- `npm install` to install all packages
- `mongod --dbpath=/Users/derek/Work/Github/nodejs.miaov.blog/db --port=27018`, modify path
- `node server` or `nodemon server`
- localhost:8888

## project indroduction

- regular/admin login/logout
- admin backend management, CRUD of user, category and content
- pagination
- article refers user and category
- `npm install nodemon -g`, and `nodemon server` to start nodejs

Note:

```javascript
console.log(categories[0]._id);   //Object, needs toString()
console.log(categories[0].id===categories[0]._id.toString());   //true!
```
