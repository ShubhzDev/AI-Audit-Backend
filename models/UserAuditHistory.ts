import mongoose,{Schema,Document, Types, Mongoose, mongo} from "mongoose";

interface IUserAuditHistory extends Document{
    walletAddress : string,
    listOfAddress : Types.ObjectId[],
}

const userAuditHistorySchema : Schema = new mongoose.Schema({
    walletAddress : {type:String,required:true,unique:true},
    listOfAddrress : {type: String,required : true},
})

const userAuditHistoryModel = mongoose.model<IUserAuditHistory>("UserAuditHistory",userAuditHistorySchema);

export default userAuditHistoryModel;