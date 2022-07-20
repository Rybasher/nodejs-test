import e, { Router } from 'express';
import { withErrorHandler } from '../../config';
import { MEMORY_DB, userValidationSchema, accessTokenSecret } from '../../config';
import { getUserByEmail, getUserByUsername } from '../../services/users_serive';

const router = Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', 
  withErrorHandler(async ({ body: { username, email, type, password } }, res) => {
    try {
      if (await getUserByUsername(username)) throw new Error('user with this username already exists');
      if (await getUserByEmail(email)) throw new Error('User with this email already exists');
      const validationResult = await userValidationSchema.validateAsync({
        username: username,
        email: email,
        type: type, 
        password: password
      });
      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);
      
      MEMORY_DB[username] = {
        email: email,
        type: type,
        salt: salt,
        passwordhash: hashedPassword 
      }
      res.status(200).send();

    } catch (error) {
      res.status(400).send(error.message);
    }
  })
);

router.get('/all_users', (req, res) => {
  try {
    const token = (req.headers.authorization as string).split(' ')[1]; 
    jwt.verify(token, accessTokenSecret);
    res.status(200).send(JSON.stringify(MEMORY_DB))
  } catch (err) {
    res.status(401).send()
  }
})

router.post('/login', 
  withErrorHandler(async ({ body: { username, password } }, res) => {
    const user = await getUserByUsername(username);
    if (user && bcrypt.compareSync(password, user.passwordhash)) {
      let token;
      try {
        token = jwt.sign(
          {username: username, email: user.email},
          accessTokenSecret, 
          { expiresIn: "1h" }
        );
      } catch (err) {
        const error = new Error('Error! Something went wrong');
        res.send(error);
      }
      res.status(200).send({
        "token": token
      });
    }
    res.status(401).send();
  })
);

export { router };