const Sauces= require("../models/sauces");
const fs= require("fs");

exports.createdsauce =(req, res, next) =>{
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    delete sauceObjet._userId;
    const create_sauces = new Sauces({
        ...sauceObjet,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });

    create_sauces.save()
    .then(() => res.status(201).json({message:"Sauces créées !"}))
    .catch(error => res.status(400).json({error}));
};

exports.get_sauces =(req, res, next) =>{
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
}

exports.get_one_sauce =(req, res, next) =>{
    Sauces.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
}

exports.sauce_modified =(req, res, next) =>{
    let sauceObject={};
    req.file ? (
        Sauces.findOne({_id: req.params.id})
        .then((sauce) =>{
            const filename = sauce.imageUrl.split("/images/")[1]
            fs.unlinkSync(`images/${filename}`)
        }),
         sauceObject= {...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }   

        ): (sauceObject= {...req.body});
        
    delete sauceObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((sauce) =>{
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: "Not authorized"})
            } else{
                Sauces.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message:"Sauce modifiée !"}))
                .catch(error => res.status(500).json({error}));
            }
        })
        .catch((error) =>{
            res.status(404).json({error});
        }); 
    }
exports.delete_sauce= (req, res, next) =>{
    Sauces.findOne({_id: req.params.id})
    .then(sauce =>{
        if (sauce.userId != req.auth.userId){
            res.status(401).json({message: "Not authorized"});
        } else{
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${filename}`);
            Sauces.deleteOne({_id: req.params.id}) 
             .then(() => res.status(200).json({message:"Sauce supprimée !"}))
             .catch(error => res.status(500).json({error}));
        }
    })
    .catch(error =>{
        res.status(404).json({error});
    });
};

exports.sauceLike = (req, res, next) =>{
    const userId= req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    if(userId){
        Sauces.findOne({_id: sauceId})
        .then(find_sauce =>{
            if (like==1){
                if(find_sauce.usersLiked.includes(userId)){
                    res.status(409).json({error:"La sauce a déjà été liké !"})
               }
               else if(find_sauce.usersDisliked.includes(userId)){
                    Sauces.updateOne({_id: sauceId}, { $inc:{likes: +1}, $inc:{dislikes: -1}, $pull:{usersDisliked: userId}, $push:{usersLiked: userId}})
                    .then(()=> res.status(200).json({message:"La sauce a bien été liké et le dislike a bien été annulé !"}))
                    .catch(error => res.status(500).json({error}));
               }
               else{
                Sauces.updateOne({_id: sauceId}, { $inc:{likes: +1}, $push:{usersLiked: userId}})
                .then(() => res.status(200).json({message:"Sauce liké !"}))
                .catch(error => res.status(500).json({error}));
               }
                
            }
            if(like==0){
                if(find_sauce.usersLiked.includes(userId)){
                    Sauces.updateOne({_id: sauceId}, { $inc:{likes: -1}, $pull:{usersLiked: userId}})
                    .then(() => res.status(200).json({message:"Le like de la sauce a bien été annulé !"}))
                    .catch(error => res.status(500).json({error}));
                }
                else if(find_sauce.usersDisliked.includes(userId)){
                    Sauces.updateOne({_id: sauceId}, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
                    .then(() => res.status(200).json({message:"Le dislike de la sauce a bien été annulé !"}))
                    .catch(error => res.status(500).json({error}));
                }       
            }
            if(like==-1){
                if(find_sauce.usersDisliked.includes(userId)){
                    res.status(409).json({error:"La sauce a déjà été disliké !"})
               }
               else if(find_sauce.usersLiked.includes(userId)){
                Sauces.updateOne({_id: sauceId},{ $inc:{dislikes: +1}, $inc:{likes: -1}, $pull:{usersLiked: userId}, $push:{usersDisliked: userId}})
                .then(() => res.status(200).json({message: "La sauce a bien été disliké et le like a bien été annulé !"}))
                .catch(error => res.status(500).json({error}))
               }
               else{
                Sauces.updateOne({_id: sauceId}, { $inc: {dislikes: +1}, $push: {usersDisliked: userId}})
                .then(()=> res.status(200).json({message:"Le dislike de la sauce a bien été pris en compte !"}))
                .catch(error => res.status(400).json({error}))
               }
            }
        })
        .catch(error=> res.status(404).json({error}));
    };
};