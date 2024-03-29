if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
};

// INITIALIZING THE FIREBASES 

// const firebaseConfig = {
//   apiKey: "AIzaSyBogMHjvhe2RE5UduZFl-MI1zWF1MLmM2k",
//   authDomain: "wanderlust-2014a.firebaseapp.com",
//   databaseURL: "https://wanderlust-2014a-default-rtdb.firebaseio.com",
//   projectId: "wanderlust-2014a",
//   storageBucket: "wanderlust-2014a.appspot.com",
//   messagingSenderId: "550080145897",
//   appId: "1:550080145897:web:210f51c05611d68beb0378",
//   measurementId: "G-6HS6TZ20D0"
// };

const express = require("express");
const serverless = require("serverless-http");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrror.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const router = require('./routes/listing.js');

const dbUrl = process.env.ATLAS_DATABASES;

main()
.then( ()=>{
  console.log("Connected to DataBases");
})
.catch((e) => {
  console.log(e);
})

async function main() {
  await mongoose.connect(dbUrl);
}  

app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs" , ejsMate);
app.set("view engine" , "ejs");

app.set("views" , path.join(__dirname,"views"));

app.use('/form', express.static(__dirname + '/index.html'));
// app.set("views" ,"/opt/render/project/src/views");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);



const store = MongoStore.create({
  mongoUrl: dbUrl ,
  crypto : {
    secret:process.env.SECRET ,
  },
  touchAfter: 24 * 3600 ,
});

store.on("error" , () => {
  console.log("ERROR OCCUR IN MONGO SESSION" , err);
});

app.use(session({
  store,
  secret:process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
    maxAge : 7 * 24 * 60 * 60 * 1000 ,
    httpOnly:true ,
  }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy (User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser" , async(req, res) => {
//   let fakeUser = new User( {
//     email : "shalni123@gmail.com" ,
//     username : "Shalni123",
//   });

//    const registerUser = await User.register(fakeUser , "helloworld");
//    res.send(registerUser);
// })

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

// MIDDLE WARE

app.all("*" , (req ,res , next) => {
  next(new ExpressError(404 , "Page not found"));
});

app.use((err,req,res,next)=>{
  let{statusCode=500 , message ="Something Went Wrong"} = err;
  res.status(statusCode).render("error.ejs" , {message , err});
});

const port = process.env.PORT;

app.listen(port , () => {
  console.log("App is Working");
});

app.use("/.netlify/functions/api" , router);
module.exports.handler = serverless(app);