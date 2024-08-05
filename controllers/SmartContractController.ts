import { Response,Request } from "express";
import { getRawSmartContract } from "../services/etherscanapi";
import { getAuditResponse ,AuditResponse} from "../services/nims";
import  auditModel , {IAudit} from "../models/Audit";
import userAuditHistoryModel , {IUserAuditHistory} from "../models/UserAuditHistory";
import { ObjectId } from 'mongoose';

const audit = async(res:Request,req:Response)=>{
    const contractAddress : string = res.params.contractAddress;
    const walletAddress : string = res.params.walletAddress;

    const rawContract : string = await getRawSmartContract(contractAddress);

    const auditResponse : AuditResponse = await getAuditResponse(rawContract);

    const auditEntry : IAudit | null = await auditModel.findOne({contractAddress:contractAddress});

    if(!auditEntry){
        const newAuditEntry : IAudit = new auditModel({
            contractAddress: contractAddress,
            auditData: auditResponse,
        });

        const auditEntryId : IAudit = await newAuditEntry.save();

        if(walletAddress){
            const walletEntry : IUserAuditHistory | null = await userAuditHistoryModel.findOne({walletAddress:walletAddress});

            if(walletEntry){
                //when wallet exists
                walletEntry.listOfAddress.push(auditEntryId._id);
                await walletEntry.save();
            }
            else{
                //wallet doesn't exist
                const walletDoc = new userAuditHistoryModel({
                    walletAddress:walletAddress,
                    listOfAddress: auditResponse,
                });

                await walletDoc.save();
            }
        }

    }
}

export default getRawSmartContract;