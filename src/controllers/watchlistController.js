import { prisma } from "../config/db.js";
const addtoWatchlist = async (req, res) => {
  try {
    const { movieId, status, rating, notes } = req.body;
    // prefer authenticated user id from middleware
    // const userId = req.user?.id || req.body.userId;
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!movieId) {
      return res.status(400).json({ error: "movieId is required" });
    }

    // Verify if movie exists
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    // Check if already added
    const existingInwatchlist = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: movieId,
        },
      },
    });
    if (existingInwatchlist) {
      return res.status(400).json({ error: "Movie already in watchlist" });
    }
    if (existingInwatchlist) {
      return res.status(400).json({ error: "Movie already in watchlist" });
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: userId,
        movieId: movieId,
        status: status,
        rating: rating,
        notes: notes,
      },
    });

    return res.status(201).json({ status: "success", data: { watchlistItem } });
  } catch (err) {
    console.error("addtoWatchlist error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const removeFromWatchlist = async (req, res) => {
  const watchlistItem = await prisma.watchlist.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }
  // ensuring the user can only delete their own watchlist items
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Forbidden: You can only delete your own watchlist items",
    });
  }
  await prisma.watchlist.delete({
    where: {
      id: req.params.id,
    },
  });
  return res
    .status(200)
    .json({ message: "Watchlist item removed successfully" });
};
const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;
  const watchlistItem = await prisma.watchlist.findUnique({
    where: { id: req.params.id },
  });
  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }
  // ensuring the user can only update their own watchlist items
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Forbidden: You can only update your own watchlist items",
    });
  }
  const updatedItem = await prisma.watchlist.update({
    where: { id: req.params.id },
    data: {
      status,
      rating,
      notes,
    },
  });
  return res.status(200).json({ status: "success", data: { updatedItem } });
};
export { addtoWatchlist, removeFromWatchlist, updateWatchlistItem };
