import express from 'express';

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// router.get('/', auth, getEmployees);
// router.post('/', auth, roleMiddleware(['Admin', 'SuperAdmin']),  createEmployee);
// router.put('/:id', auth, roleMiddleware(['Admin', 'SuperAdmin']),  updateEmployee);
// router.delete('/:id', auth, roleMiddleware(['Admin', 'SuperAdmin']), deleteEmployee);
// router.post('/import', auth, roleMiddleware(['Admin', 'SuperAdmin']), upload.single('file'), importEmployees);
//router.get('/sample-excel', downloadSampleExcel);

export default router;