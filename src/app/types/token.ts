import { TokenInfo } from "thirdweb/react";

interface Token extends TokenInfo {
  decimals: number;
}

export default Token;
