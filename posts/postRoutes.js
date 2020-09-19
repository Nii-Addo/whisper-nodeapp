/*
** Load dependencies
*/
var express = require('express');
var router = express.Router();

var postService=require('./postService');


/*GET all posts*/
router.get('/',async(req, res)=> {
  await postService.getAllPosts()
    .then(posts => res.json(posts))
    .catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    })
});

/*GET posts by author name*/
router.get('/author/:author',async(req,res)=>{
	await postService.getPostsByAuthor(req.params.author)
		.then(posts=>{
			res.status(200).json(posts);
		}).catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    })
})

/*GET post by param*/
router.get('/id/:id',async(req,res)=>{
	await postService.getPostById(parseInt(req.params.id))
		.then(post=>{
			res.status(200).json(post);
		}).catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    })
})

/*CREATE new post*/
router.post('/',async(req,res)=>{
	const {tittle,author,content}=req.body;
	const newPost={
		tittle,
		author,
		content
	};
	await postService.createPost(newPost)
		.then(savedPost=>{
			return res.status(200).json(savedPost);
		}).catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    })
})

/*UPDATE post*/
router.put('/update/:id',async(req,res)=>{
	const {content,numberOfDownVotes,numberOfUpVotes}=req.body;
	const id=parseInt(req.params.id);
	const newPost={
		content,
		numberOfUpVotes,
		numberOfDownVotes
	};
	await postService.updatePost(id,newPost)
		.then(updatedPost=>{
			return res.status(200).json(updatedPost);
		}).catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    })
})

/*DELETE post*/
router.delete('/:id',async(req,res)=>{
	const id=parseInt(req.params.id);
	await postService.deletePost(id)
		.then(posts=>{
			res.json(posts);
		} )
		.catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    })
})


module.exports = router;