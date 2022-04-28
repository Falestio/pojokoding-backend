const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const requireAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send({
      message: "Please login to continue",
      messageClass: "alert-danger",
    });
  }
};

module.exports = { generateAuthToken, getHashedPassword, requireAuth };
