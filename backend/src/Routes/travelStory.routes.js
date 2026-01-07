import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    createStory,
    getAllStories,
    getStoryById,
    getMyStories,
    updateStory,
    deleteStory,
    toggleLike,
    addComment,
    deleteComment,
    toggleCommentLike,
    removeImage
} from "../controller/travelStory.controller.js";
import {
    createStorySchema,
    updateStorySchema,
    commentSchema
} from "../validations/travelStory.validation.js";

const router = Router();

// Public routes
router.get("/", getAllStories);
router.get("/:storyId", getStoryById);

// Protected routes
router.use(verifyJWT);

// Story CRUD
router.post("/", upload.array("images", 10), createStory);
router.get("/user/my-stories", getMyStories);
router.patch("/:storyId", upload.array("images", 10), updateStory);
router.delete("/:storyId", deleteStory);
router.patch("/:storyId/remove-image", removeImage);

// Likes
router.post("/:storyId/like", toggleLike);

// Comments
router.post("/:storyId/comments", validate(commentSchema), addComment);
router.delete("/:storyId/comments/:commentId", deleteComment);
router.post("/:storyId/comments/:commentId/like", toggleCommentLike);

export default router;
