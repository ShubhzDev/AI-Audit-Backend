import { Response, Request } from "express";
import { getRawSmartContractFromEtH } from "../services/etherscanapi";
import { getRawSmartContractFromBNB } from "../services/binanceapi";

import { getAuditResponse, AuditResponse } from "../services/openaiApi";
import AuditModel, { IAudit } from "../models/Audit";
import UserAuditHistoryModel, {
  IUserAuditHistory,
} from "../models/UserAuditHistory";

const audit = async (req: Request, res: Response) => {
  console.log("audit");
  // try {
  const contractAddress: string = req.params.contractAddress;
  const walletAddress: string = req.body.walletAddress;
  const network: string = req.body.network;

  if (!contractAddress || contractAddress.trim() === "") {
    return res.status(500).send({ message: "contract address is missing" });
  }

  let rawContract: string | null = null;

  if (network === "ETH") {
    rawContract = await getRawSmartContractFromEtH(contractAddress);
  } else if (network === "BNB") {
    rawContract = await getRawSmartContractFromBNB(contractAddress);
  } else {
    return res.status(500).send({ message: "Invalid Network!" });
  }

  if (!rawContract || rawContract.trim() === "") {
    console.log("rawContract null ");

    return res.status(500).send({ message: "Invalid Contract Address!" });
  }

  console.log("came here ");

  const auditResponse: AuditResponse | null = await getAuditResponse(
    rawContract
  );

  if (auditResponse === null) {
    return res.status(500).send({ message: "Invalid Contract Address!" });
  }

  const auditEntry: IAudit | null = await AuditModel.findOne({
    contractAddress: contractAddress,
  });

  // console.log("contractAddress", contractAddress);
  // console.log("auditData", auditResponse);

  if (!auditEntry) {
    const newAuditEntry: IAudit = new AuditModel({
      contractAddress: contractAddress,
      auditData: auditResponse,
      network:network,
    });

    const auditEntryId: IAudit = await newAuditEntry.save();
    // console.log("auditEntryId", auditEntryId);
    if (walletAddress) {
      const walletEntry: IUserAuditHistory | null =
        await UserAuditHistoryModel.findOne({ walletAddress: walletAddress });

      if (walletEntry) {
        if (!Array.isArray(walletEntry.listOfAddress)) {
          walletEntry.listOfAddress = []; // Initialize as an empty array if it's not an array
        }
        if (!walletEntry.listOfAddress.includes(auditEntryId.id)) {
          walletEntry.listOfAddress.push(auditEntryId.id); // Add id if it's not already present
        }

        await walletEntry.save();
      } else {
        //wallet doesn't exist
        const walletDoc = new UserAuditHistoryModel({
          walletAddress: walletAddress,
          listOfAddress: [auditEntryId._id],
        });

        await walletDoc.save();
      }
    }
    return res.status(200).send(newAuditEntry);
  } else {
    if (walletAddress) {
      const walletEntry: IUserAuditHistory | null =
        await UserAuditHistoryModel.findOne({ walletAddress: walletAddress });

      if (walletEntry) {
        //when wallet exists
        if (!Array.isArray(walletEntry.listOfAddress)) {
          walletEntry.listOfAddress = []; // Initialize as an empty array if it's not an array
        }
        if (!walletEntry.listOfAddress.includes(auditEntry.id)) {
          walletEntry.listOfAddress.push(auditEntry.id); // Add id if it's not already present
        }

        // Push the new audit entry ID into the list
        await walletEntry.save();
      } else {
        //wallet doesn't exist
        const walletDoc = new UserAuditHistoryModel({
          walletAddress: walletAddress,
          listOfAddress: [auditEntry._id],
        });

        await walletDoc.save();
      }
    }
    return res.status(200).send(auditEntry);
  }
  // } catch (error) {
  //   console.error("Server Error!!");
  // }
};

export default audit;
