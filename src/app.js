require('dotenv').config();

const express = require('express');
const path = require("path")
const mongoose =  require("mongoose")
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog')

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require('./middleware/authentication');

const app = express();
const PORT = process.env.PORT || 8000;
          
mongoose
    .connect(process.env.MONGO_URL)
    .then((e) => console.log("Mongodb Connected"))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))

app.use(express.static(path.resolve('./public')))

app.get("/", async(req,res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});
app.get('/search', async (req, res) => {
    const searchQuery = req.query.query; // Get the search query from request parameters
    try {
        // Perform text search using Mongoose's $text operator
        const results = await Blog.find({ $or: [{ "title": {$regex: searchQuery} }] });
        return res.render("home", {
            user: req.user,
            blogs: results
        }); // Return search results as JSON
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.use("/user", userRoute)
app.use("/blog", blogRoute)



app.listen(PORT, ()=> {console.log(`server started at ${PORT}`)})

