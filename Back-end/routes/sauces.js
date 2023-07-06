const express= require("express");
const router= express.Router();

const multer= require("../middleware/multer-config");
const auth= require("../middleware/auth");
const saucectrl = require("../controllers/sauces");

router.post("/", auth, multer, saucectrl.createdsauce);
router.get("/", auth, saucectrl.get_sauces);
router.get("/:id", auth, saucectrl.get_one_sauce);
router.put("/:id", auth, multer, saucectrl.sauce_modified);
router.delete("/:id", auth, saucectrl.delete_sauce);
router.post("/:id/like", auth, saucectrl.sauceLike);

module.exports= router;

