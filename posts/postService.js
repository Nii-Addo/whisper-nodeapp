/*
**Load dependencies
*/
var fs=require('fs').promises;
var postsPath='../data.json';
var posts=require(postsPath);


const createPost=async(newPost)=>{

		  	//create new id for post
		    const id=generateNewId(posts);	

		 	//get date posted
		    const createdAt= new Date().toString();

		    const numberOfUpVotes=0;

		    const numberOfDownVotes=0;

		    //create new object with id,date content
		    const postToSave={id,...newPost,numberOfUpVotes,numberOfDownVotes,createdAt};

		    //push new object to array of post
			posts.push(postToSave);

			//appendto file
			await fs.writeFile(postsPath, JSON.stringify(posts),'utf8');
			return posts;
}		


/*Update post*/
const updatePost=(postId,newPost)=>{
	return new Promise((resolve,reject)=>{
		const post=findById(postId,posts)
		.then(post=>{
		if(newPost.content){
			post.content=newPost.content;
		}
		if(newPost.numberOfUpVotes){
			post.numberOfUpVotes=newPost.numberOfUpVotes;	
		}   
		if(newPost.numberOfDownVotes){
			post.numberOfDownVotes=newPost.numberOfDownVotes;
		}	    
		//write to file
		fs.writeFile(postsPath, JSON.stringify(posts), (err) => {
		  if (err){
		  	reject (err);
		  } 
		  resolve(post);
		});
		})
		.catch(err=>reject(err))
	})
}

/*Find post by id*/
const getPostById=(id)=>{
	return new Promise((resolve,reject)=>{
		const post=findById(id,posts)
		 .then(post=>{
		  	resolve(post);
		 }).catch(err=>{
		 	reject(err);
		 })
	})
}

/*Find post by author*/
const getPostsByAuthor=(author)=>{
	return new Promise((resolve,reject)=>{
		postsByAuthor=posts.filter(post=>post.author === author);
		if(postsByAuthor){
			resolve(postsByAuthor)
		}else{
			reject(`No post by ${author}`)
		}
	})
}

/*Find all posts*/
const getAllPosts=()=>{
	return new Promise((resolve,reject)=>{
		if(posts.length==0){
			reject({
				message:"No posts created",
				status: 400
			})
		}
		resolve(posts);
	})
}

/*Delete post*/
const deletePost=(id)=>{
	return new Promise((resolve,reject)=>{
		findById(id,posts)
		.then(()=>{
			posts=posts.filter(post=>post.id !== id)
			//write to file
		fs.writeFile(postsPath, JSON.stringify(posts), (err) => {
		  if (err){
		  	reject (err);
		  } 
		  resolve(posts);
		});
		})
	})
}


/*utility methods*/
const generateNewId=(postArray)=>{
	if(postArray.length>0){
		return postArray[postArray.length -1].id +1; 
		}
		else{
			return 1; 
		}
		
}

const findById=(id,postArray)=>{
	return new Promise((resolve,reject)=>{
		const post=postArray.find(post=>post.id===id);
		if(!post){
			reject({message:"post not found"});
		}else{
			resolve(post);
		}
	})
}

module.exports={
	createPost,
	updatePost,
	getPostById,
	getPostsByAuthor,
	getAllPosts,
	deletePost
}