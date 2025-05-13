import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller.js';

const router = Router();

// Admin routes
router.get('/', InvoiceController.getAll);
router.post('/', InvoiceController.create);
router.get('/mill-owner/:millOwnerId', InvoiceController.getMillOwnerInvoices);
router.patch('/:id/mark-paid', InvoiceController.markAsPaid);
router.delete('/:id', InvoiceController.delete);

// Mill owner routes
// router.get('/my-invoices', validateMillOwner, (req, res) => {
//   req.params.millOwnerId = req.user.id; // Assuming req.user is set by auth middleware
//   return InvoiceController.getMillOwnerInvoices(req, res);
// });

// Common routes
router.get('/:id', InvoiceController.getById);
router.put('/:id', InvoiceController.update);

export default router;