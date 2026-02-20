import { prisma } from "../config/db.js";
const addtoWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;
  // prefer authenticated user id from middleware
  const userId = req.user?.id || req.body.userId;
  // Verify if mocie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });
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
  const watchlistItem = await prisma.watchlist.create({
    data: {
      userId: userId,
      movieId: movieId,
      status: status,
      rating: rating,
      notes: notes,
    },
  });
  res.status(201).json({
    status: "success",
    data: { watchlistItem },
  });
};
export { addtoWatchlist };
