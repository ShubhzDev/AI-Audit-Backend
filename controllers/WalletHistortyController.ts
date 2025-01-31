import { Response, Request } from "express";
import UserAuditHistoryModel, {
  IUserAuditHistory,
} from "../models/UserAuditHistory";

const walletAuditHistory = async (req: Request, res: Response) => {
  console.log("audit");
  const walletAddress: string = req.params.walletAddress;

  if(!walletAddress || walletAddress.trim() === ""){
    return res.status(500).send({ message: "Invalid walletAddress!" });
  }

  if (walletAddress) {
    const walletEntry: IUserAuditHistory | null = await UserAuditHistoryModel.findOne({ walletAddress: walletAddress }).populate('listOfAddress');

    if (walletEntry) {
      //when wallet exists
      return res.status(200).send(walletEntry);
    } else {
      //wallet doesn't exist
      const walletDoc = new UserAuditHistoryModel({
        walletAddress: walletAddress,
        listOfAddress: [],
      });

      await walletDoc.save();
      return res.status(200).send(walletDoc);
    }
  }
  
};

export default walletAuditHistory;
