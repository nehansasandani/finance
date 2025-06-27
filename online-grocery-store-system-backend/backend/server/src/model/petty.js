const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Schema
const pettySchema = mongoose.Schema({
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    paidTo: {
        type: String,
        required: [true, "Paid To is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    },
    
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add pagination plugin
pettySchema.plugin(mongoosePaginate);

// Create and export model
const Petty = mongoose.model('Petty', pettySchema);

module.exports = Petty;
