const express = require('express');
const path = require("path")
const { mongoConnect } = require('./db');
const userRouter = require('./routes/user')
const cookieParser = require('cookie-parser');
const { chekAuthForUserCookie } = require('./middleware/auth');
const blogRouter = require('./routes/blog');
const Blog = require('./models/blog');

const app = express();

const port = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(chekAuthForUserCookie("token"));
app.use(express.static(path.resolve('./public')));


app.get('/', async (req, res) => {

    const allBlog = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs : allBlog
    })
})

//router registers
app.use('/user', userRouter);
app.use('/blog', blogRouter);

//connection
mongoConnect("mongodb://127.0.0.1:27017/blogify").then(() => {
    console.log("Database is connected!");
})

app.listen(port, () => { console.log(`server started at PORT ${port}`) });

