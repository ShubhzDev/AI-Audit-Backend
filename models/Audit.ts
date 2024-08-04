import mongoose ,{Schema,Document, StringSchemaDefinition } from "mongoose"

interface IAudit extends Document{
    contractAddress : string,
    auditData : string,
}
