const express = require('express');
const router = express.Router();
const Joi=require('joi');
const bcrypt=require('bcryptjs');

const Users=require('./User');
let registrationService=require('./registrationService');

/*Login handler*/
router.post('/login',async(req, res)=>{
    Users.findOne({email:req.body.email})
        .exec((err,user)=>{
          if(err){
            res.status(400).json("1 Wrong email or password")
          }
          //if no errors
          bcrypt.compare(req.body.password,user.password,(err,isMatch)=>{
            if(err) throw err;
  
            if(isMatch){
              const {password,...rest}=user;
              const userInfo=Object.assign({},{...rest});
              
              return  res.json({
                message:"Successfully authenticated",
                userInfo,
              });
              }else{
                return res.status(400).json({message:"Wrong email or password"});
              }
            })

  });

})

/* handle registration. */
router.post('/register',async(req, res)=> {
	
	const {error,value}=validateUser(req.body);
	const {fullName,email,password,passwordConfirmation}=value;

    if(error){
    	return res.status(400).json(error.details[0].message);
    }
    else{
    	//Check password match before creating user
    	if(passwordConfirmation == password){
 			
 			//find if the user already exist
	    	Users.findOne({email: email})
        .then(user=>{
          if(user){
            return res.status(400).json("Email already exist");
          }
          else{
             //create a new user 
             const userDto={
              fullName,
              email,
              password,
             };
            
            //set password salt strength to 12
            bcrypt.genSalt(12,(err,salt)=>{
              if(err) throw err;

              //hash the user password
              bcrypt.hash(userDto.password,salt,(err,hash)=>{
                if(err) throw (err);
                
                userDto.password=hash;         
                const theUser=new Users(userDto);
                //save user
                theUser.save(userDto)
                 .then(savedUser=>{
                  const {
                    fullName,
                    email,
                  }=savedUser;
            
                  const userInfo={
                    fullName,
                    email,
                    };  
                    
                  return res.json({
                    message:"User created!",
                    userInfo,
                  }); 
               }).catch(err=>{
                  console.log(err);
                  return res.status(400).json({
                    message:"There was a problem creating your account"
                  });
                })                 
              })
            })   
          }   
        })
        .catch(err=>{
            console.log(err);
            return res.status(400).json({
              message:"There was a problem creating your account"
            });
          }) 
        }
    }
});

const validateUser=(user)=>{
	const validationSchema=Joi.object().keys({
		fullName:Joi.string().min(3).required(),
		email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
		password:Joi.string().pattern(new RegExp(/(?=.*[a-z]){8,30}/)).required(),
		passwordConfirmation:Joi.ref('password')
	})
    .with('password', 'passwordConfirmation');

    return validationSchema.validate(user);
}

module.exports = router;