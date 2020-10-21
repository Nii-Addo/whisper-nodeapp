const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const PostSchema=new Schema({
  title:{ 
    type:String,
    minLength:3,
    trim:true
  },
  author:{ 
    type:String,
    minLength:3,
    trim:true
  },
  content:{ 
    type:String,
    minLength:3,
    trim:true
  },
  numberOfUpVotes:{ 
    type:Number,
    default:0,
  },
  numberOfDownVotes:{ 
    type:Number, 
    default:0
  }
},
{
  timestamps:true
})

const Post=mongoose.model('Post',PostSchema);
module.exports=Post;