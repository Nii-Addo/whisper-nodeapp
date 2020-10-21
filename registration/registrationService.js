var fs=require('fs');
const bcrypt=require('bcryptjs');

var usersPath='../usersdata.json';
var users=require(usersPath);

/*findOne*/
const findUser=(email)=>{
	return new Promise((resolve,reject)=>{
		user=users.find(userToFind=>userToFind.email === email);
		if(user){
			resolve(user);
		}else{
			reject("User not found");
		}
	})
	.catch(err=>{
		resolve(err);
	})
}

/*findOne*/
const findOne=(email)=>{
	return new Promise((resolve,reject)=>{
		user=users.find(userToFind=>userToFind.email === email);
		if(!user){
			resolve();
		}else{
			reject(user);
		}
	})
}

/*findById*/
const findById=(id,users)=>{
	return new Promise((resolve,reject)=>{
		const user=users.find(user=>user.id===id);
		if(!user){
			reject({message:"user not found"});
		}else{
			resolve(user);
		}
	})
}

/*save*/
const save=(newUser)=>{
	return new Promise((resolve,reject)=>{

		  	//create new id for user
		    const id=generateNewId(users);	

		 	//get date registed
		    const createdAt= new Date().toString();

		    const role="user";

		    //create new user object with id,date,email etc
		    const userToSave={id,...newUser,role,createdAt};

		    //push new object to array of users
			users.push(userToSave);

			//appendto file
			fs.writeFile(usersPath, JSON.stringify(users), (err) => {
			  if (err){
			  	reject (err);
			  } 
			  resolve(userToSave);
			});
	
	})
}	

const generateNewId=(postArray)=>{
	if(postArray.length>0){
		return postArray[postArray.length -1].id +1; 
		}
		else{
			return 1; 
		}
		
}

//check if passwords match
const authenticatePassword=(password,userPassword)=>{
	return new Promise((resolve,reject)=>{
		bcrypt.compare(password, userPassword, (err, result) => {
	      if (err) {
	        return reject({
	          status: 500,
	          error: err.message
	        });
	      }
	      resolve(result);
	      console.log(result);
	    }) 
	})
}


module.exports={
	findOne,
	findUser,
	findById,
	save,
	authenticatePassword
}