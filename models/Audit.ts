import mongoose ,{Schema,Document, StringSchemaDefinition } from "mongoose"

interface IAudit extends Document{
    contractAddress : string,
    auditData : string,
}

const auditSchema : Schema = new mongoose.Schema({
    contractAddress : {type : String,required : true,unique: true},
    auditData : { type : String,required: true}
})

const auditModel = mongoose.model<IAudit>("Audit",auditSchema);

export default auditModel;