import mongoose,{Schema,Document, Types, Mongoose, mongo} from "mongoose";

export interface IUserAuditHistory extends Document{
    walletAddress : string,
    listOfAddress : Types.ObjectId[],
}

const userAuditHistorySchema : Schema = new mongoose.Schema({
    walletAddress : {type:String,required:true,unique:true},
    listOfAddress : { type: [mongoose.Schema.Types.ObjectId], ref: "Audit" },
})

const UserAuditHistoryModel = mongoose.model<IUserAuditHistory>("UserAuditHistory",userAuditHistorySchema,"UserAuditHistory");

export default UserAuditHistoryModel;