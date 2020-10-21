/*
** Load dependencies
*/
var express = require('express');
var router = express.Router();
var Joi=require('joi');

var postService=require('./postService');
const Posts=require('./Post');


/*GET all posts*/
router.get('/',async(req, res)=> {
  await Posts.find({})
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
	await Posts.find({author:req.params.author})
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
	await Posts.findById({_id:parseInt(req.params.id)})
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
    const {error,value}=validatePost(req.body);
	const {tittle,author,content}=value;
    if(error){
        return res.status(400).json(error.details[0].message);
    }else{
        const newPost={
            tittle,
            author,
            content
        };
        const post=new Posts(newPost);
        await post.save()
        .then(savedPost=>{
            return res.status(200).json(savedPost);
        }).catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    })
    }
	
})

/*UPDATE post*/
router.put('/update/:id',async(req,res)=>{
	const {content,numberOfDownVotes,numberOfUpVotes}=value;
    Posts.findById({_id:req.params.id})
    .then(post=>{
        Object.assign(post,value);
        post.save()
        .then(updatedPost=>{
            return res.status(200).json(updatedPost);
        })
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }) 
})

/*DELETE post*/
router.delete('/:id',async(req,res)=>{
await Posts.deleteOne({_id:req.params.id})
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
})

const validatePost=(post)=>{
    const validationSchema=Joi.object().keys({
        tittle:Joi.string().min(3).required(),
        author:Joi.string().min(3).required(),
        content:Joi.string().min(3).required(),
        numberOfDownVotes:Joi.number(),
        numberOfUpVotes:Joi.number(),
    })
    return validationSchema.validate(post);
}


module.exports = router;