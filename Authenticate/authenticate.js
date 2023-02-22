const jwt = require("jsonwebtoken");
const AuthModel = require("../Models/AuthModel");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const bearerToken = req.headers['authorization'];
    if(typeof bearerToken !== 'undefined'){
      const bearer = bearerToken.split(' ');
      const jwtToken = bearer[1];
      console.log('Bearer',jwtToken);
    
    const verifyToken = jwt.verify(jwtToken, process.env.SECRET_KEY);
    const rootUser = await AuthModel.findOne({
      _id: verifyToken._id,
      "tokens.token": jwtToken,
    });
    if (!rootUser) {
      throw new Error("User not found..");
    }
    const {...others } = rootUser._doc;
    req.token = jwtToken;
    req.rootUser = { data: others, success: true };
    req.userId = rootUser._id;

    next();
  }else{
    res.status(401).send({
      message: "Unotherized User: Please login first",
      success: false,
    });
  }
//  end of bearer token if 

  } catch (error) {
    res.status(401).send({
      message: "Unotherized User: Please login first",
      success: false,
    });
    console.log(error);
  }
};

module.exports = Authenticate;
