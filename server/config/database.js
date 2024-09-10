import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`mongodb connected:: ${conn.connect.host}`);

    } catch(error) {
        console.error(`Error: ${error.message}`);
        process.exit();

    }
}
