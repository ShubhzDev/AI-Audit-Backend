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
  }>;
}

export const getRawSmartContract = async(contractAddress: string): Promise<string | null> => {
  try {
    const etherScanUrl = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.Etherscan_api}`;

    const response = await axios.get<EtherscanResponse>(etherScanUrl);
    const data = response.data;

    if (data.status === "1") {
      return data.result[0].SourceCode;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error caught : " + error);
    return null;
  }
}
