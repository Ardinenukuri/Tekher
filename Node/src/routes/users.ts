// import express from 'express';
// const router = express.Router();

// // In-memory "database"
// let users = [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' }
// ];

// // GET (all users)
// router.get('/', (req, res) => {
//   res.json(users);
// });

// // GET user by id
// router.get('/:id', (req, res, next) => {
//   const user = users.find(u => u.id === +req.params.id);
//   if (!user) {
//     const error = new Error('User not found');
//     error.status = 404;
//     return next(error);
//   }
//   res.json(user);
// });

// // GET user by name
// // router.get('/search', (req, res) => {
// //   const { name } = req.query;
  
// //   if (!name) {
// //     return res.status(400).json({ error: 'Query parameter "name" is required' });
// //   }

// //   const filteredUsers = users.filter(u =>
// //     u.name.toLowerCase().includes(name.toLowerCase().trim())
// //   );

// //   if (filteredUsers.length === 0) {
// //     return res.status(404).json({ error: 'No users found matching the name' });
// //   }

// //   res.json(filteredUsers);
// // });
// router.get('/search', (req, res) => {
//   const { name } = req.query;
//   const filtered = users.filter(u => u.name.toLowerCase().includes(name?.toLowerCase()||''));
//   res.json(filtered);
// });

// // POST (add new user)
// router.post('/', (req, res, next) => {
//   const { name } = req.body;
//   if (!name) {
//     const error = new Error('Name is required');
//     error.status = 400;
//     return next(error);
//   }
//   const newUser = {
//     id: users.length + 1, 
//     name
//   };
//   users.push(newUser);
//   res.status(201).json(newUser); 
// });

// // PUT (update user)
// router.put('/:id', (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   const userIndex = users.findIndex(u => u.id === +id);

//   if (userIndex === -1) {
//     const error = new Error('User not found');
//     error.status = 404;
//     return next(error);
//   }

//   if (!name) {
//     const error = new Error('Name is required');
//     error.status = 400;
//     return next(error);
//   }

//   users[userIndex] = { ...users[userIndex], name }; 
//   res.json(users[userIndex]);
// });

// // DELETE (delete user)
// router.delete('/:id', (req, res, next) => {
//   const userIndex = users.findIndex(u => u.id === +req.params.id);
//   if (userIndex === -1) {
//     const error = new Error('User not found');
//     error.status = 404;
//     return next(error);
//   }
//   const deletedUser = users.splice(userIndex, 1)[0];
//   res.json(deletedUser);
// });

// export default router;

// routes/users.ts
import express, { Request, Response, NextFunction, Router, RequestHandler } from 'express';

const router: Router = express.Router();

interface User {
  id: number;
  name: string;
}

// Sample in-memory database
const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// GET /users/search
router.get('/search', ((req: Request, res: Response) => {
  const name = req.query.name as string;
  if (name) {
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filtered);
  }
  res.json(users);
}) as RequestHandler);

// GET /users/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    const err: Error & { status?: number } = new Error('User not found');
    err.status = 404;
    return next(err);
  }
  
  res.json(user);
});

export default router;