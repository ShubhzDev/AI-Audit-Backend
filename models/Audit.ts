import mongoose ,{Schema,Document, Types, StringSchemaDefinition } from "mongoose";
// import AutoIncrement from "mongoose-sequence"; // Import the plugin

// // Pass the mongoose instance to the AutoIncrement function
// const AutoIncrementPlugin = AutoIncrement(mongoose);

import { AuditResponse } from "../services/nims";
const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface IAudit extends Document{
    contractAddress : string,
    auditData : AuditResponse,
}

const severitySchema: Schema = new Schema({
    level: { type: String, required: true },
    description: { type: String, required: true },
    recomendation: { type: String, required: true },
}
// ,{
//     _id: true, // Enable auto-incrementing _id field
//     autoIndex: true // Create indexes automatically
// }
);

// Apply the auto-increment plugin to the severity schema
// severitySchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1 }); // Start from 1

// Counter schema to keep track of the sequence
const counterSchema = new Schema({
    sequenceValue: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequenceValue(sequenceName: string): Promise<number> {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.sequenceValue;
}

const auditResponseSchema: Schema = new Schema({
    id : { type: Number,required:true,unique:true},
    score: { type: String, required: true },
    high: { type: String, required: true },
    medium: { type: String, required: true },
    low: { type: String, required: true },
    severity: { type: [severitySchema], required: true },
});

auditResponseSchema.pre<IAudit>('save', async function(next) {
    if (this.isNew) {
        this._id = await getNextSequenceValue('auditResponseId'); // Use a unique identifier for the counter
    }
    next();
});

const auditSchema : Schema = new mongoose.Schema({
    contractAddress : {type : String,required : true,unique: true},
    auditData : { type : auditResponseSchema,required: true}
})

const AuditModel = mongoose.model<IAudit>("Audit",auditSchema,"Audit");

export default AuditModel;