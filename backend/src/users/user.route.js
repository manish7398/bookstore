const express = require("express");
const router = express.Router();
const { generateJWT } = require("./user.controller");

router.post("/jwt", generateJWT);

module.exports = router;
