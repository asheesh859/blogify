const { Router } = require('express')
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id).populate("createdBy");
    const comments = await Comment.find({blogId:id}).populate("createdBy")
    console.log(comments)
  

    return res.render('blog' , {
        user:req.user,
        blog,
        comments
    });

})

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const file = req.file;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
})


router.post('/comment/:blogId' , async(req , res )=>{
    console.log('running');
    const body = req.body;
        const comment = await Comment.create({
            content : body.content,
            createdBy:req.user._id,
            blogId : req.params.blogId,
        });
        const commentResult = comment.save();
        return res.redirect(`/blog/${req.params.blogId}`);
        
   
})

module.exports = router