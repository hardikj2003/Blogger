const {Router}= require("express");
const User = require("../models/user");
const Blog = require("../models/blog")

const router = Router();

router.get("/", (req,res)=>{
    return res.render("home")
})
router.get("/signin", (req,res)=>{
    return res.render("signin")
})
router.get("/signup", (req,res)=>{
    return res.render("signup")
})
router.post("/signin", async (req,res) =>{
    const {email, password} = req.body;
    try {
        const token = await User.matchPasswordAndGenrateToken(email, password)
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password"
        })
    }
})
router.get('/logout', (req,res) => {
    res.clearCookie("token").redirect("/")
})

router.post("/signup", async(req,res)=>{
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect("/");
})

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const blogCount = await Blog.countDocuments({ createdBy: userId });

        const userBlogs = await Blog.find({ createdBy: userId });

        return res.render('user-page', { user, blogCount, userBlogs });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
