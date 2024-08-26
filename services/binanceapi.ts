import axios from "axios";

interface EtherscanResponse {
  status: string;
  message: string;
  result: Array<{
    SourceCode: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    DeployedBytecode: string;
    Bytecode: string;
    SourceCodeLink: string;
    ABI:string,
  }>;
}

export const getRawSmartContractFromBNB = async(contractAddress: string): Promise<string | null> => {
  try {
    const etherScanUrl = `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.Binance_Scan_Api}`;

    const response = await axios.get<EtherscanResponse>(etherScanUrl);
    const data = response.data;
    // console.log(data);

    if (data.status === "1") {
      if(data.result[0].ABI==="Contract source code not verified"){
        return "Contract source code not verified";
      }
      else if(data.result[0].SourceCode.trim() != ""){
        return data.result[0].SourceCode;
      }
      else{
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log("bnb");

    console.error("Error caught : " + error);
    return null;
  }
}
