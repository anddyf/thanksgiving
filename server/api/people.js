const router = require("express").Router();
const { Person, Dish } = require("../../db");
const path = require('path')

// make sure to use router.get, router.post etc..., instead of app.get, app.post, or etc... in this file.
// see https://expressjs.com/en/api.html#routers

router.get("/", async(req, res, next) => {
    try{

        if(req.url === '/?is_attending=true'){
            res.send((await Person.findAll({where:{isAttending:true}})))
        }
        else if(req.url === '/?is_attending=false'){
                res.send((await Person.findAll({where:{isAttending:false}})))
        }
        else if(req.url === '/?include_dishes=true'){
            res.send(await Dish.findAll({include: [{
                model: Person,
                as: 'person',
            }]
            }))
        }
        else if(req.url === '/'){
            res.send(await Person.findAll()) 
        }
    }
    catch(e){
    next(e)
    }
    
})

router.post("/", async(req, res, next) => {
    try {
        if (req.body.name && req.body.name !== '') {
            const newPerson = await Person.create(req.body);
            res.status(200).send(newPerson);
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
        const updateInfo = await Person.update({...req.body},
        {
            where: {
                id: req.params.id,
            }
        });
        if (updateInfo[0]) {
            res.status(200).send(await Person.findAll({where: {id: req.params.id}}));
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
        const deletePerson = await Person.destroy({
            where: {
                id: req.params.id,
            }
        });
        if (deletePerson) {
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
