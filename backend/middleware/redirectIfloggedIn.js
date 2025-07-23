function redirectIfLoggedIn(req, res, next) {
  if (res.locals.user) {
    return res.redirect('/'); // or /profile, /box, etc.
  }
  next();
}

module.exports = redirectIfLoggedIn;