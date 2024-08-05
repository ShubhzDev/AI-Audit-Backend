import { Response, Request } from "express";
import { getRawSmartContract } from "../services/etherscanapi";
import { getAuditResponse, AuditResponse } from "../services/nims";
import auditModel, { IAudit } from "../models/Audit";
import userAuditHistoryModel, {
  IUserAuditHistory,
} from "../models/UserAuditHistory";
import { ObjectId } from "mongoose";

const audit = async (req: Request, res: Response) => {
  try {
    const contractAddress: string = req.params.contractAddress;
    const walletAddress: string = req.params.walletAddress;

    if (!contractAddress) {
      res.status(500).json({ message: "contract address is missing" });
    }

    const rawContract: string | null = await getRawSmartContract(contractAddress);

    if (rawContract) {
        res.status(500).json({ message: "Invalid Contract Address" });
      }

    const auditResponse: AuditResponse | null = await getAuditResponse(
      rawContract
    );

    if (auditResponse) {
      res.status(500).json({ message: "Invalid Contract Address" });
    }

    const auditEntry: IAudit | null = await auditModel.findOne({
      contractAddress: contractAddress,
    });

    if (!auditEntry) {
      const newAuditEntry: IAudit = new auditModel({
        contractAddress: contractAddress,
        auditData: auditResponse,
      });

      const auditEntryId: IAudit = await newAuditEntry.save();

      if (walletAddress) {
        const walletEntry: IUserAuditHistory | null =
          await userAuditHistoryModel.findOne({ walletAddress: walletAddress });

        if (walletEntry) {
          //when wallet exists
          walletEntry.listOfAddress.push(auditEntryId._id);
          await walletEntry.save();
        } else {
          //wallet doesn't exist
          const walletDoc = new userAuditHistoryModel({
            walletAddress: walletAddress,
            listOfAddress: auditResponse,
          });

          await walletDoc.save();
        }
      }
    }
  } catch (error) {
    console.error("Server Error!!");
  }
};

export default getRawSmartContract;
