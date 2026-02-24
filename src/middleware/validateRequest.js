// const result = schema.safeParse(req.body);
// if (!result.success) {
//   const errorMessage = result.error.errors.map((err) => err.message);
//   const error = errorMessage.join(", ");
//   return res.status(400).json({ error: error });
// }
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return res.status(400).json({
        error: flatErrors.join(", "),
      });
    }

    //  use parsed data (especially for z.coerce)
    req.body = result.data;

    next();
  };
};
