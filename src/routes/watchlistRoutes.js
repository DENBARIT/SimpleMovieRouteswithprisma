import express from "express";
import {
  addtoWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addtoWatchlistSchema } from "../Validators/watchlistValidators.js";
const router = express.Router();
router.use(authMiddleware);
// for applying to specific route
router.post("/", validateRequest(addtoWatchlistSchema), addtoWatchlist);
// router.post("/login", login);
// router.post("/logout", logout);

// {{baseUrl}}/watchlist/"id" for deleting from watchlist
router.delete("/:id", removeFromWatchlist);
router.put("/:id", updateWatchlistItem);
export default router;
