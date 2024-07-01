require('dotenv').config();

const {Router}= require("express");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const Blog = require('../models/blog')
const Comment = require("../models/comment")

const router = Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
  
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_covers',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});
  
const upload = multer({ storage: storage });

router.get("/add-new", (req,res) =>{
    return res.render("addBlog", {
        user: req.user,
    })
})

router.get("/:id", async(req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate( "createdBy")
    return res.render("blog", {
        user: req.user,
        blog,
        comments,
    })
})
router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: req.file.path // Cloudinary returns the URL in req.file.path
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.post("/:id/delete", async(req,res) => {
    const id = req.params.id
    await Blog.deleteOne({_id: id});
    return res.redirect("/");
})
router.get('/:id/edit', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.render("edit-blog", { 
            user: req.user,
            blog 
        });
    } catch (error) {
        console.error('Error fetching blog for editing:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/:blogId/like", async (req, res) => {
    try {
        const blogId = req.params.blogId;
        // Find the blog by ID and increment the like count
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { $inc: { likes: 1 } }, { new: true });
        return res.json({ success: true, likes: updatedBlog.likes });
    } catch (error) {
        console.error("Error liking blog:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post('/:id', async (req, res) => {
    const { title, body } = req.body;
    const { id } = req.params;

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, { title, body }, { new: true });
        res.redirect(`/blog/${updatedBlog._id}`);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;