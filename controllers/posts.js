const models = require("../models");
const Comment = models.Comment;

// 게시글 작성
const createPost = async (req, res) => {
  const { title, content } = req.body;
  let filename = req.file ? req.file.filename : null;
  filename = `downloads/${filename}`;

  let attachments = [];
  if (req.file) {
    attachments.push({
      filename: req.file.filename,
      originalname: Buffer.from(req.file.originalname, "latin1").toString(
        "utf8"
      ),
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } else if (req.files && req.files.length > 0) {
    attachments = req.files.map((file) => ({
      filename: file.filename,
      originalname: Buffer.from(file.originalname, "latin1").toString("utf8"),
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    }));
  }

  const post = await models.Post.create({
    title: title,
    content: content,
    authorId: req.user.id,
    attachments: attachments,
  });
  res.status(201).json({ message: "ok", data: post });
};

// 게시글 목록
const findPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const totalPosts = await models.Post.count();
  const posts = await models.Post.findAll({
    limit: pageSize,
    offset: offset,
    include: [
      { model: models.User, as: "author", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  const postsWithCount = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.count({ where: { postId: post.id } });
      return { ...post.toJSON(), commentCount };
    })
  );

  const totalPages = Math.ceil(totalPosts / pageSize);
  res.status(200).json({
    message: "ok",
    data: {
      posts: postsWithCount,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalPosts,
        totalPages,
      },
    },
  });
};

// 게시글 한개 가져오기
const findPost = async (req, res) => {
  const id = req.params.id;
  const post = await models.Post.findByPk(id, {
    include: [
      { model: models.User, as: "author", attributes: ["id", "name", "email"] },
    ],
  });
  if (!post) {
    return res.status(400).json({ message: "게시글을 찾을 수 없습니다. " });
  }
  res.status(200).json({ message: "ok", data: post });
};

// 게시글 수정
const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, content, attachments: attachmentsRaw } = req.body;
  const post = await models.Post.findByPk(id);
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  if (title) post.title = title;
  if (content) post.content = content;

  let attachments = [];
  if (attachmentsRaw) {
    try {
      attachments = JSON.parse(attachmentsRaw);
    } catch (e) {
      attachments = attachments = Array.isArray(attachmentsRaw)
        ? attachmentsRaw
        : [];
    }
  } else if (Array.isArray(post.attachments)) {
    attachments = post.attachments;
  }
  // 새로 업로드된 파일 추가
  if (req.files && req.files.length > 0) {
    const newFiles = req.files.map((file) => ({
      filename: file.filename,
      originalname: Buffer.from(file.originalname, "latin1").toString("utf8"),
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    }));
    attachments = attachments.concat(newFiles);
  }
  post.attachments = attachments;
  await post.save();
  res.status(200).json({ message: "ok", data: post });
};

const deletePost = async (req, res) => {
  const id = req.params.id;
  const result = await models.Post.destroy({
    where: {
      id: id,
    },
  });
  if (result > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
};

// comment
const createComment = async (req, res) => {
  const postId = req.params.postId;
  const { content } = req.body;
  const post = await models.Post.findByPk(postId);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  const comment = await models.Comment.create({
    content: content,
    postId: postId,
    userId: req.user.id,
  });
  res.status(201).json({ message: "ok", data: comment });
};

const findComments = async (req, res) => {
  const postId = req.params.postId;
  const comments = await models.Comment.findAll({
    where: { postId: postId },
    include: [
      { model: models.User, as: "author", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({ message: "ok", data: comments });
};

const updateComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const { content } = req.body;

  const post = await models.Post.findByPk(postId);
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  const comment = await models.Comment.findOne({
    where: {
      id: commentId,
      postId: postId,
    },
  });
  if (!comment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }
  if (content) comment.content = content;
  await comment.save();
  res.status(200).json({ message: "ok", data: comment });
};

const deleteComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const post = await models.Post.findByPk(postId);
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  const comment = await models.Comment.findOne({
    where: {
      id: commentId,
      postId: postId,
    },
  });
  if (!comment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }
  await comment.destroy();
  res.status(204).send();
  // if (result > 0) {
  //   res.status(204).send();
  // } else {
  //   res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  // }
};

module.exports = {
  createPost,
  findPosts,
  findPost,
  updatePost,
  deletePost,
  createComment,
  findComments,
  updateComment,
  deleteComment,
};
