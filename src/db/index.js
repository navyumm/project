import mongoose from "mongoose";

const mongoDB = async() => {
    try {
        const databse =await mongoose.connect(`${process.env.MONGODB_URI}/${process.constants.DB_NAME}`);
        console.log("MongoDB Connected Successfuly !!! : ", databse);

    } catch (error) {
        console.log("MongoDB Connection Failed : ", error);
        process.exit(1)
    }
}

