import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller.js';
// import { validateAdmin, validateMillOwner } from '../middleware/auth';

const router = Router();
const invoiceController = new InvoiceController();

// Admin routes
router.post('/', invoiceController.createInvoice.bind(invoiceController));
router.get('/mill-owner/:millOwnerId', invoiceController.getMillOwnerInvoices.bind(invoiceController));
router.patch('/:id/mark-paid', invoiceController.markInvoiceAsPaid.bind(invoiceController));

// Mill owner routes
// router.get('/my-invoices', validateMillOwner, (req, res) => {
//   req.params.millOwnerId = req.user.id; // Assuming req.user is set by auth middleware
//   return invoiceController.getMillOwnerInvoices(req, res);
// });

// Common routes
router.get('/:id',invoiceController.getInvoice.bind(invoiceController));

export default router;