import { Response, Request } from "express";
import UserAuditHistoryModel, {
  IUserAuditHistory,
} from "../models/UserAuditHistory";
import AuditModel, { IAudit } from "../models/Audit";

const walletAuditHistory = async (req: Request, res: Response) => {
  console.log("audit");
  const walletAddress: string = req.params.walletAddress;

  if (walletAddress) {
    const walletEntry: IUserAuditHistory | null =
      await UserAuditHistoryModel.findOne({ walletAddress: walletAddress });


    //   const audit : IAudit | null = await AuditModel.findById(_id:walletEntry.listOfAddress.)

    if (walletEntry) {
      //when wallet exists
      return res.status(200).send(walletEntry.listOfAddress);
    } else {
      //wallet doesn't exist
      return res.status(404).send({ message: "No Data!" });
    }
  }
};

export default walletAuditHistory;
