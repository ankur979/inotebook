const jwt = require("jsonwebtoken");
const Signature = 'Ankur$123';
const fetchuser = (req, res, next) => {
    // get user token veryfy user
    const token = req.header("user-token");

    if (!token) {
        res.status(401).json({ error: "Plases enter vilid token" });
    }
    try {
        const data = jwt.verify(token, Signature);
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).json({ error: "Plases enter vilid token" });
    }

}

module.exports = fetchuser;