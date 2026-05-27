import express from 'express';
import { catchAsync } from '../middleware/errorHandler.js';
import { validateExpression } from '../middleware/validateExpression.js';
import { calculateHandler } from '../controllers/calculateController.js';

const router = express.Router();

router.post('/', validateExpression, catchAsync(calculateHandler));

export default router;
