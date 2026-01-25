const jwt = require("jsonwebtoken");

const generateJWT = async (req, res) => {
  try {
    const user = req.body; // { email, role }
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ message: "JWT generation failed" });
  }
};

module.exports = {
  generateJWT,
};
