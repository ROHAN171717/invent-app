const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");

const userSchema=mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please add a name"],
    },
    email:{
        type: String,
        required:[true,"Please add an email"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password:{
        type: String,
        required: [true,"Please add a password"],
        minLength:[6,"Password must be up to 6 characters"],
        //   maxLength: [23, "Password must not be more than 23 characters"],
    },
    photo:{
        type: String,
        required:[true,"Please add a photo"],
        default:"https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone:{
        type: String,
        default: "+234",
    },
    bio:{
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters"],
        default: "bio",
    },
},{
    timestamps: true,
}
);

//DOCUMENT MIDDLEWARE
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }

    //Hash password
    const salt=await bcrypt.genSalt(12);
    const hashedPassword=await bcrypt.hash(this.password,salt);
    this.password=hashedPassword;
    next();
})

const User=mongoose.model("User",userSchema);
module.exports = User;