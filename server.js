const express= require('express')
const app = express()
const path = require('path')
const bookRouter = require('./routes/bookRoute')
const userRoute = require('./routes/userRoute')
const flash = require('connect-flash')
const contactRoute = require('./routes/contact')
const aboutRoute = require('./routes/about')
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);     // cookies 

app.use(flash())
app.use(express.static(path.join(__dirname,'assets')))
app.set('view engine','ejs')                            
app.set('views','views') 


var store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/library',
  collection: 'mySessions'
});
app.use(session({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
  }));


app.use('/',bookRouter)
app.use('/',userRoute)
app.use('/',contactRoute)
app.use('/',aboutRoute)






app.listen(3000,()=>console.log("server run on port 3000"))