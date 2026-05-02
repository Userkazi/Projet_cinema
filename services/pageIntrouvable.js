const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});

module.exports = pageIntrouvable;