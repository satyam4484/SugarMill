import mongoose, { Schema, Document } from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../../uploads');

export interface IDocument extends Document {
    aadhar: {
        aadharNumber: string;
        aadharPhoto: string;
    },
    pancard: {
        panNumber: string;
        panPhoto: string;
    }
}

const aadharSchema = new Schema({
    aadharNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v: string) {
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhar number must be 12 digits'
        }
    },
    aadharPhoto: {
        type: String,
        required: true
    }
   
});

const pancardSchema = new Schema({
    panNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        validate: {
            validator: function(v: string) {
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
            },
            message: 'Invalid PAN number format'
        }
    },
    panPhoto: {
        type: String,
        required: true
    }
});

const documentSchema = new Schema({
    aadhar: aadharSchema,
    pancard: pancardSchema,
}, {
    timestamps: true
});

// Define indexes only once using schema.index()
documentSchema.index({ 'aadhar.aadharNumber': 1 }, { unique: true });
documentSchema.index({ 'pancard.panNumber': 1 }, { unique: true });

// Add pre-remove hook to delete files when document is deleted
// documentSchema.pre(['remove', 'deleteOne'], async function(next) {
//     try {
//         const document = this as IDocument;
        
//         // Delete aadhar photo if it exists
//         if (document.aadhar?.aadharPhoto) {
//             const aadharPhotoPath = path.join(uploadsDir, document.aadhar.aadharPhoto);
//             if (fs.existsSync(aadharPhotoPath)) {
//                 fs.unlinkSync(aadharPhotoPath);
//                 console.log(`Deleted aadhar photo: ${aadharPhotoPath}`);
//             }
//         }
        
//         // Delete pancard photo if it exists
//         if (document.pancard?.panPhoto) {
//             const panPhotoPath = path.join(uploadsDir, document.pancard.panPhoto);
//             if (fs.existsSync(panPhotoPath)) {
//                 fs.unlinkSync(panPhotoPath);
//                 console.log(`Deleted pancard photo: ${panPhotoPath}`);
//             }
//         }
        
//         next();
//     } catch (error) {
//         console.error('Error deleting document files:', error);
//         next(error as Error);
//     }
// });

// Also handle findOneAndDelete and findByIdAndDelete operations
documentSchema.pre('findOneAndDelete', async function(next) {
    try {
        const document = await this.model.findOne(this.getFilter());
        if (document) {
            await document.remove();
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});

// documentSchema.pre('findByIdAndDelete', async function(next) {
//     try {
//         const document = await this.model.findOne(this.getFilter());
//         if (document) {
//             await document.remove();
//         }
//         next();
//     } catch (error) {
//         next(error as Error);
//     }
// });

export default mongoose.model<IDocument>('Documents', documentSchema);




