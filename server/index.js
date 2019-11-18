const { app } = require('./app');
const PORT = 3000;
const { db, Person, Dish } = require('../db');


async function syncAndSeedDatabase() {
  try {

    await db.sync({ force: true });

    //  Create some rows in your Person and Dish tables here
    //  to interact with your API using the `npm run start:watch`
    //  or `npm run start` commands.
    const persons = [
      { name: 'mark', isAttending: true },
      { name: 'russell', isAttending: false },
      { name: 'ryan', isAttending: true}
    ]
   
    const [mark,russell,ryan] = await Promise.all( persons.map(people => Person.create(people)))  

    const dishes = [ 
      { name: 'turkey', description: 'delicious briney turkey', spoiled: true, personId: mark.id },
      { name: 'pie', description: 'delicious pumpkiney pie', spoiled: false, personId: ryan.id }
    ]
    const [dish1, dish2] = await Promise.all( dishes.map(dish => Dish.create(dish)))

   
  } catch (e) {
    console.log(e);
  }

  console.log('done seeding and associating!');
}

syncAndSeedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});
