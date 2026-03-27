const express = require("express");
const router = express.Router();
const postController = require("../controllers/posts");
const { uploadSingle, uploadMulti } = require("../middlewares/upload");
const { authenticate } = require("../middlewares/auth");

router.post("/", authenticate, uploadMulti, postController.createPost);
router.get("/", postController.findPosts);
router.get("/:id", postController.findPost);
router.put("/:id", authenticate, uploadMulti, postController.updatePost);
router.delete("/:id", postController.deletePost);

router.post("/:postId/comments", authenticate, postController.createComment);
router.get("/:postId/comments", postController.findComments);
router.put(
  "/:postId/comments/:commentId",
  authenticate,
  postController.updateComment
);
router.delete(
  "/:postId/comments/:commentId",
  authenticate,
  postController.deleteComment
);

module.exports = router;
