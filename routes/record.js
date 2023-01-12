const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the records.
recordRoutes.route("/salesreport").get(function (req, res) {
 let db_connect = dbo.getDb("AcmeInc");
 db_connect
   .collection("sales_report")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     console.log(result)
     res.json(result);
   });
});

recordRoutes.route("/transaction").get(function (req, res) {
  let db_connect = dbo.getDb("AcmeInc");
  db_connect
    .collection("CT")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result)
      res.json(result);
    });
 });
 
 // create user record if user not exist already
recordRoutes.route("/userAccount/new").post((req, response) => {
  let db_connect = dbo.getDb()

  db_connect.collection('CT').findOne({ email: req.body.email }).then((user) => {
      if(user){
          return response.status(400).json({ email: 'Email already exists' })
      }
      else{
          // password is not hashed, if production hash the password
          const userInfo = {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              created_at: req.body.created_at || new Date(),
              activated: req.body.activated || false,
              updated_at: req.body.updated_at ||null,
              bio: req.body.bio || null,
              last_password_changed: req.body.last_password_changed || null,
              dob: req.body.dob || null
          }

          db_connect.collection('CT').insertOne(userInfo, (err, res) => {
              if(err) throw err;
              response.json(res);
          })
      }
  })
})

// login api to sign in
recordRoutes.route('/login').post((req, response) => {
  let db_connect = dbo.getDb()
  const email = req.body.email;
  const password = req.body.password;

  db_connect.collection('CT').findOne({ email }).then((user) => {
      if(!user){
          return response.status(400).json({ email: 'Email not found' })
      }
      else{
          if(password !== user.password){
              return response.status(400).json({ password: 'Incorrect password'})
          }
          else{
              response.json(user)
          }
      }
  })
})
 
module.exports = recordRoutes;