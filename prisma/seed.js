// reuse the application's configured Prisma client (with adapter) so the
// seed script doesn't have to re-specify connection details. This keeps the
// logic in one place and satisfies the constructor requirement that an
// adapter/accelerateUrl is provided.
import { prisma } from "../src/config/db.js";

const admin = "ed60b317-e670-4525-a0f7-60f433dfb140";
// title,overview,releaseYear,genres,runtime,posterurl,createdby
const movies = [
  {
    title: "Inception",
    overview:
      "A skilled thief who steals secrets through dream-sharing technology is given a chance to erase his criminal history.",
    releaseYear: 2010,
    geres: ["Sci-Fi", "Action", "Thriller"],
    runtime: 148,
    posterUrl: "https://example.com/inception.jpg",
    createdBy: admin,
  },
  {
    title: "The Dark Knight",
    overview:
      "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into chaos.",
    releaseYear: 2008,
    geres: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterUrl: "https://example.com/darkknight.jpg",
    createdBy: admin,
  },
  {
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
    releaseYear: 2014,
    geres: ["Sci-Fi", "Drama", "Adventure"],
    runtime: 169,
    posterUrl: "https://example.com/interstellar.jpg",
    createdBy: admin,
  },
  {
    title: "Parasite",
    overview:
      "A poor family schemes to become employed by a wealthy household, leading to unexpected consequences.",
    releaseYear: 2019,
    geres: ["Thriller", "Drama"],
    runtime: 132,
    posterUrl: "https://example.com/parasite.jpg",
    createdBy: admin,
  },
  {
    title: "Gladiator",
    overview:
      "A betrayed Roman general seeks revenge against the corrupt emperor who murdered his family.",
    releaseYear: 2000,
    geres: ["Action", "Drama", "History"],
    runtime: 155,
    posterUrl: "https://example.com/gladiator.jpg",
    createdBy: admin,
  },
  {
    title: "The Matrix",
    overview:
      "A computer hacker discovers reality is a simulation and joins a rebellion against intelligent machines.",
    releaseYear: 1999,
    geres: ["Sci-Fi", "Action"],
    runtime: 136,
    posterUrl: "https://example.com/matrix.jpg",
    createdBy: admin,
  },
  {
    title: "Titanic",
    overview:
      "A romance unfolds between two passengers aboard the ill-fated RMS Titanic.",
    releaseYear: 1997,
    geres: ["Romance", "Drama"],
    runtime: 195,
    posterUrl: "https://example.com/titanic.jpg",
    createdBy: admin,
  },
  {
    title: "Avengers: Endgame",
    overview:
      "The Avengers assemble once more to reverse the destruction caused by Thanos.",
    releaseYear: 2019,
    geres: ["Action", "Sci-Fi", "Adventure"],
    runtime: 181,
    posterUrl: "https://example.com/endgame.jpg",
    createdBy: admin,
  },
  {
    title: "Joker",
    overview:
      "A mentally troubled comedian embarks on a downward spiral that leads to the rise of a criminal mastermind.",
    releaseYear: 2019,
    geres: ["Crime", "Drama", "Thriller"],
    runtime: 122,
    posterUrl: "https://example.com/joker.jpg",
    createdBy: admin,
  },
  {
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over years, finding solace and redemption through acts of decency.",
    releaseYear: 1994,
    geres: ["Drama"],
    runtime: 142,
    posterUrl: "https://example.com/shawshank.jpg",
    createdBy: "admin",
  },
];

const main = async () => {
  console.log("Seeding database with movies...");

  // ensure an admin user exists for the foreign-key reference
  try {
    await prisma.user.create({
      data: {
        id: admin,
        name: "Admin",
        email: "admin@example.com",
        password: "password",
      },
    });
    console.log("Created admin user");
  } catch (err) {
    // ignore, user may already exist
  }

  for (const movie of movies) {
    const { createdBy: _cb, ...movieData } = movie;
    await prisma.movie.create({
      data: {
        ...movieData,
        creator: { connect: { id: admin } },
      },
    });
    console.log(`Inserted movie: ${movie.title}`);
  }
  console.log("Seeding Completed");
};
// since it async function we need to catch any error that might occur during the seeding process
main()
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
