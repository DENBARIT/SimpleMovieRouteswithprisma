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
export { addtoWatchlist };
