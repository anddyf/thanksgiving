// tests for /api/dishes

// supertest is a module that allows us to test our express server
const request = require('supertest');
const { app } = require('./../server/app.js');
const { db, Dish, Person } = require('./../db/index.js');

beforeEach(async done => {
  // wipe the db before each test block
  await db.sync({ force: true });
  done();
});
afterAll(async done => {
  // close the db connection upon completion of all tests
  await db.close();
  done();
});
describe('/api/dishes routes', () => {
  // its up to you to create the test conditions for /api/dishes
  // add as many tests as you feel necessary to fully cover each routes functionality
  const dish1 = { name: 'turkey', description: 'delicious briney turkey', spoiled: true };
  const dish2 = { name: 'pie', description: 'delicious pumpkiney pie', spoiled: true };
  describe('GET to /api/dishes', () => {
    it('does a test!', () => {
      return Promise.all([Dish.create(dish1), Dish.create(dish2)]).then(
        () => {
          return request(app) // have to return this promise as well
          .get('/api/dishes')
          .expect('Content-Type', /json/) // you can make assertions about the response using supertest's built in methods
          .expect(200) // you should always be sending status codes when sending a response from your server
          .then(response => {
            // once the promise is fulfilled we have access to the entire response
            const dishes = response.body;
            expect(dishes.length).toBe(2);
            expect(dishes).toEqual(
              expect.arrayContaining([
                expect.objectContaining(dish1),
                expect.objectContaining(dish2),
              ])
            );
          })
          .catch(err => {
            fail(err);
          })
        })
    });

  describe('GET to /api/dishes/:id', () => {
    it('does a test!', () => {
      return Promise.all([Dish.create(dish1), Dish.create(dish2)]).then(
        () => {
          return request(app) // have to return this promise as well
          .get('/api/dishes/1')
          .expect('Content-Type', /json/) // you can make assertions about the response using supertest's built in methods
          .expect(200) // you should always be sending status codes when sending a response from your server
          .then(response => {
            // once the promise is fulfilled we have access to the entire response
            const dishes = response.body;
            expect(dishes.length).toBe(1);
            expect(dishes).toEqual(
              expect.arrayContaining([
                expect.objectContaining(dish1),
              ])
            );
          })
          .catch(err => {
            fail(err);
          })
        })
    });
  });
})
describe('POST to /api/dishes/', () => {
  it('', async () => {
    //Use http://localhost:3000/ to make edits to database and change CRUD
    // HINT: You will be sending data then checking response. No pre-seeding required
    const banana = { name: 'banana', description:'delicious yellow', spoiled: false }
    const bananaResponse = await request(app).post('/api/dishes/').send(banana)

    expect(bananaResponse.statusCode).toBe(200);
    expect(bananaResponse.headers['content-type']).toEqual(
        expect.stringContaining('json')
        )
    const newDish = bananaResponse.body;
    expect(newDish.name).toBe('banana')
    expect(newDish.description).toBe('delicious yellow')
    expect(newDish.spoiled).toBe(false)

    const apiBanana = await Dish.findAll({
      where: {
        name: banana.name,
      }
    })
    expect(apiBanana[0].name).toEqual('banana')

    // Make sure you test both the API response and whats inside the database anytime you create, update, or delete from the database
  });
  it('should return status code 400 if missing required information', async () => {
    const blankName = { name:'', isAttending: false }
    const postFailResponseNext = await request(app).post('/api/people/').send(blankName)
    expect(postFailResponseNext.statusCode).toBe(400)
  });
});

    describe('PUT to /api/dishes/:id', () => {
      it('should update a persons information', async () => {
        const potato = { name: 'potato', description: 'mashed potato', spoiled: false }
        const potatoDish = await Dish.create(potato)
        console.log(potatoDish.id)
        const potatoRes = await request(app).put(`/api/dishes/${potatoDish.id}`).send({ name: 'potato', description: 'mashed potato', spoiled: true })
        //test API Response
        expect(potatoRes.statusCode).toBe(200);
        expect(potatoRes.headers['content-type']).toEqual(
            expect.stringContaining('json')
            );
        const potatoResDish = potatoRes.body[0]
        expect(potatoResDish.name).toEqual('potato')
        expect(potatoResDish.description).toEqual('mashed potato')
        expect(potatoResDish.spoiled).toEqual(true)
  
        const apiPotato = await Dish.findAll({
          where: {
            name: potato.name,
          }
        });
        expect(apiPotato[0].name).toEqual('potato')
        expect(apiPotato[0].spoiled).toEqual(true)
      });
      it('should return a 400 if given an invalid id', async () => {
        const wrongUpdate = await request(app).put(`/api/dishes/23`)
        .send({ name: 'potato', description: 'mashed potato', spoiled: false })
        expect(wrongUpdate.statusCode).toBe(400)
      });
    });
  

    describe('DELETE to /api/people/:id', () => {
      it('should remove a person from the database', async () => {
        const pie = { name: 'pie', description: 'cherry', spoiled: true }
        const pieDish = await Dish.create(pie)
        //test API Response
        const pieResult = pieDish
        console.log(pieResult.name)
        expect(pieResult.name).toBe('pie')
        const deletepie = await request(app).delete(`/api/dishes/${pieResult.id}`)
        expect(deletepie .statusCode).toBe(200);
        
        let deletedpie  = await Dish.findAll()

        expect(deletedpie).not.toEqual(expect.objectContaining(pieResult))
      });
      it('should return a 400 if given an invalid id', async () => {
        const deleteErr = await request(app).delete(`/api/dishes/23`)
        expect(deleteErr.statusCode).toBe(400);
      });
    });
});