import mongoose ,{Schema,Document, Types, StringSchemaDefinition } from "mongoose"

import { AuditResponse } from "../services/nims";

export interface IAudit extends Document{
    contractAddress : string,
    auditData : AuditResponse,
}

const severitySchema: Schema = new Schema({
    level: { type: String, required: true },
    description: { type: String, required: true },
    recomendation: { type: String, required: true },
});

const auditResponseSchema: Schema = new Schema({
    score: { type: String, required: true },
    severity: { type: [severitySchema], required: true },
});

const auditSchema : Schema = new mongoose.Schema({
    contractAddress : {type : String,required : true,unique: true},
    auditData : { type : auditResponseSchema,required: true}
})

const AuditModel = mongoose.model<IAudit>("Audit",auditSchema,"Audit");

export default AuditModel;