const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image:{
    type:String
  },
  languages: [String],
  gender: {
    type: String,
    default:""
  },
  amount: {
    type:Number,
    default:0
  },
  days: {
    type:Number,
    default:0
  }
  ,
  resetToken:{
    token:String,
  },
  skillsKnown: [
    {
      category: String,
      skill: String
    }
  ],
  skillsRequired: [
    {
      category: String,
      skill: String
    }
  ],
  learning: [String],
  feed_preferences: {
    skills: [String],
    language: String,
  },
  notifications: [
    {
      type: {
        type: String,
        
        default:"",
      },
      from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
      },
      preachSkill: {
        category: String,
        skill: String,
        _id:mongoose.Schema.Types.ObjectId,
      },
      learnSkill:{
        category: String,
        skill: String,
        _id:mongoose.Schema.Types.ObjectId,

      }
    },
  ],
  rejected: [
    mongoose.Schema.Types.ObjectId
  ]
  ,
  chats: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      messages: [
        {
          from_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          to_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
          message: String,
        },
      ],
      status: {
        type: String,
        enum: ['in_progress', 'completed'],
      },
      preachSkill: {
        category: String,
        skill: String,
        _id:mongoose.Schema.Types.ObjectId,
      },
      learnSkill:{
        category: String,
        skill: String,
        _id:mongoose.Schema.Types.ObjectId,

      },
      ratingGiven:{
        type:Boolean,
        default:false,
      },
      finish:{
        type:Boolean,
        default:false
      },
      paid:{
        type:Boolean,
        default:false
      }
    },
  ],
  acceptedPaidUser :[
    {
      users:mongoose.Schema.Types.ObjectId,
      learnSkill:{
        category: String,
        skill: String,
        _id:mongoose.Schema.Types.ObjectId,

      }
    }
  ],
  paidUsers :[
    {
      users:mongoose.Schema.Types.ObjectId,
      learnSkill:{
        category: String,
        skill: String,
        _id:mongoose.Schema.Types.ObjectId,

      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      amount: {
        type:Number,
        default:0
      }

    }
  ],
  rating: {
    ratingValue:{
      type:Number,
      default:0
    },
    ratingCount:{
      type:Number,
      default:0
    }
  },
  completed_skills: [
    {
      skill: {
        type:String,
        default:""
      },
      category :{
        type:String,
        default:""
      },
      mentor: {
        _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name:{
        type:String,
        default:""
      }
    }
    },
  ],
  agreed_skill_coins:[{
    skillCoins: {type:Number,default:0},
    agreedID: {type:mongoose.Schema.Types.ObjectId},
}],
  skillCoins: {
    type:Number,
    default:0
  },
  payments: [
    {
      paymentIntentID: {
        type:String,
        default:""
      },
      chargeID :{
        type:String,
        default:""
      }
    },
  ],
});

const User = mongoose.model("user",userSchema)

module.exports = User