const router = require("express").Router();
const { Dish, Person } = require("../../db");

// make sure to use router.get, router.post etc..., instead of app.get, app.post, or etc... in this file.
// see https://expressjs.com/en/api.html#router

router.get("/", (req, res, next) => {
    try{
        Dish.findAll()
        .then(item => res.send(item))
    }
    catch(e){
        next(e)
    }
});
router.get("/:id", (req, res, next) => {
    try{
        Dish.findAll({where:{
            id:req.params.id
        }})
        .then(item => res.send(item))
    }
    catch(e){
        next(e)
    }
});

router.post("/", async(req, res, next) => {
    try {
        if (req.body.name) {
            const newDish = await Dish.create(req.body)
            res.status(200).send(newDish);
        }
        else{
            res.status(400).send('This is  wrong');
        }
    }
    catch (e) {
        next(e);
    }
})

router.put("/:id", async(req, res, next) => {
    try {
        const updatedDish = await Dish.update({...req.body},
        {
            where: {
                id: req.params.id,
            }
        });
        if (updatedDish[0]) {
            res.status(200).send(await Dish.findAll({where: {id: req.params.id}}));
        }
        else{
            res.status(400).send('This is  wrong');
        }
    }
    catch (e) {
        
        next(e);
    }
})

router.delete("/:id", async(req, res, next) => {
    try {
        const deleteDish = await Dish.destroy({
            where: {
                id: req.params.id,
            }
        });
        if (deleteDish) {
            res.status(200).send();
        }
        else{
            res.status(400).send('This is  wrong');
        }
    }
    catch (e) { 
        next(e);
    }
})   


module.exports = router;
