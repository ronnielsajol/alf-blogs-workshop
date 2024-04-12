const Post = require("../models/postModel");
const deleteFile = require("../utils/deleteFile");

//READ

// @desc GET All Posts
// @route GET /posts
// access Public

const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find();

		res.json(posts);
	} catch (err) {
		console.log(err);
	}
};

//GET SPECIFIC POST

const showPost = async (req, res) => {
	try {
		const { id } = req.params;

		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json({ error: "Post not found!" });
		}

		res.status(200).json(post);
	} catch (err) {
		console.log(err);
	}
};

//CREATE

// @desc Create a post
// @route POST /posts
// access Public
const createPost = async (req, res) => {
	//Validate if req.body exists
	if (!req.body) {
		return res.status(400).json({ error: "No request body!" });
	}

	const { title, author, content, cover_photo } = req.body;

	const path = req.file?.path ?? null;

	try {
		const post = new Post({
			title,
			author,
			content,
			cover_photo: path,
		});

		const newPost = await post.save();

		if (newPost) {
			return res.status(201).json(newPost);
		}
	} catch (error) {
		console.log(error);
		res.status(422).json({ error: "Error creating post!" });
	}
};

//UPDATE

// @desc Update a post
// @route POST /posts/:id
// access Public

const updatePost = async (req, res) => {
	//Validate if req.body exists
	if (!req.body) {
		return res.status(400).json({ error: "No request body!" });
	}

	const { id } = req.params;

	//optionally check if req.file exists
	const { title, author, content, cover_photo } = req.body;

	const path = req.file?.path ?? null;

	try {
		const originalPost = await Post.findById(id);

		if (!originalPost) {
			return res.status(404).json({ error: "Post not found!" });
		}

		if (originalPost.cover_photo && path) {
			deleteFile(originalPost.cover_photo);
		}

		originalPost.title = title;
		originalPost.author = author;
		originalPost.content = content;
		originalPost.cover_photo = path;

		const updatedPost = await originalPost.save();

		res.status(201).json(updatedPost);
	} catch (error) {
		console.log(error);
		res.status(422).json({ error: "Error updating post!" });
	}
};
//DELETE

// @desc    Delete specified post
// @route   DELETE /posts/:id
// access   Public
const deletePost = async (req, res) => {
	const { id } = req.params;

	const post = await Post.findByIdAndDelete(id);

	if (!post) {
		return res.status(404).json({ message: "post not found" });
	}

	if (post.cover_photo) {
		deleteFile(post.cover_photo);
	}

	res.status(201).json({ message: "Successfully deleted post!" });
};

module.exports = {
	getAllPosts,
	createPost,
	updatePost,
	showPost,
	deletePost,
};
