const express = require('express')
const router = express.Router()
const userService = require( '../services/userService.js');
// const { protect } = require('../middleware/authMiddleware')


//auth0 dan gelen useri alip backend servicee gonderiyor. geriye servis status olarak geri bilgi veriyor
// router.post("/", async (req, res) => {
//   // const auth0User = req.body;
//   // const usermail = {
//   //   email: auth0User.email,
//   // };

//   const user = await userService.checkUser(usermail);
//   res.status(200).send(user);
// });

router.route('/').post(userService.addUser)
router.route('/check').post(userService.checkUser)
router.route('/').get(userService.getUsers)
router.route('/').put(userService.updateUser)
router.route('/:id').delete(userService.deleteUser)

module.exports = router;