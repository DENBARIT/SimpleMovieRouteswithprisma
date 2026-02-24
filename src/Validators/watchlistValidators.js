import { z } from "zod";

const addtoWatchlistSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),

  status: z.enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
    errorMap: () => ({
      message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
    }),
  }),

  rating: z.coerce
    .number({ invalid_type_error: "Rating must be a number" })
    .int()
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10")
    .optional(),

  notes: z.string().optional(),
});

export { addtoWatchlistSchema };
