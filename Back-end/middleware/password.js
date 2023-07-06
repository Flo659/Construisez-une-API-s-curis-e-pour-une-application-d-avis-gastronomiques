const passwordValidator= require("password-validator");

const passwordschema = new passwordValidator();

passwordschema

.is().min(8)                                    
.is().max(100)                                 
.has().uppercase()                             
.has().lowercase()                              
.has().digits(1)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']);


module.exports= (req, res, next) => {
    if(passwordschema.validate(req.body.password)){
        next();
    }else{
        res.status(400).json({error:"Le mot de passe n'est pas assez fort ! " +"Caractères manquants: "+ passwordschema.validate(req.body.password, {list: true}) }) 
    }
};
