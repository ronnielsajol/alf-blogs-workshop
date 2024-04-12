require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const port = 3000;

connectDb();

//Serve static files from the public directory
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.status(200).json({ message: "Hello World" });
});

//Post Routes:
const postRouter = require("./routers/postRouter");
app.use("/posts", postRouter);

//Use Error Middleware
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
