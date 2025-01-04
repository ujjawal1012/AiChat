import mongoose from 'mongoose';


const projectSchema = new mongoose.Schema({    
    name: {
        type: String,
        required: true,
        unique: [true, 'Project name already exists'],
        trim: true,
      lowercase: true
    }
, users:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

]
})

const Project = mongoose.model('Project', projectSchema);

export default Project;