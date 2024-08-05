import mongoose ,{Schema,Document, Types, StringSchemaDefinition } from "mongoose"

export interface IAudit extends Document{
    _id: Types.ObjectId;
    contractAddress : string,
    auditData : string,
}

const auditSchema : Schema = new mongoose.Schema({
    contractAddress : {type : String,required : true,unique: true},
    auditData : { type : String,required: true}
})

const auditModel = mongoose.model<IAudit>("Audit",auditSchema);

export default auditModel;