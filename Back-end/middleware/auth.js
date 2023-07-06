const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.tokenkey);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
    
   } catch(error) {
       res.status(404).json({ error });
   }
};