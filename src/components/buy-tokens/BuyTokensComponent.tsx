"use client";
import { useState, useEffect } from "react";
import { BuyBigCoinComponent } from "@/components/buy-big-coin/BuyBigCoinComponent";
import { BuyReinaComponent } from "@/components/buy-reina/BuyReinaComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp } from "lucide-react";
import Image from "next/image";

type TokenType = "bigcoin" | "reina";

// Hook to fetch REINA price data
const useReinaPrice = () => {
  const [priceData, setPriceData] = useState<{
    buyPrice: string;
    volume24Hr: string;
    marketCap: string;
    priceDeltas: {
      "24h": string;
      "6h": string;
      "1h": string;
      "5m": string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/trading-info?clubId=197&chain=base');
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.buyPrice) {
        setPriceData({
          buyPrice: data.buyPrice,
          volume24Hr: data.volume24Hr || "0",
          marketCap: data.marketCap || "0",
          priceDeltas: data.priceDeltas || {
            "24h": "0",
            "6h": "0", 
            "1h": "0",
            "5m": "0"
          }
        });
      } else {
        throw new Error("Invalid price data received");
      }
    } catch (err) {
      console.error("Error fetching REINA price:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch price");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData();
    
    // Refresh price data every 30 seconds
    const interval = setInterval(fetchPriceData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { priceData, isLoading, error, refetch: fetchPriceData };
};

export const BuyTokensComponent = () => {
  const [selectedToken, setSelectedToken] = useState<TokenType>("bigcoin");
  const { priceData, isLoading: priceLoading } = useReinaPrice();

  const tokens = [
    {
      id: "bigcoin" as TokenType,
      name: "BigCoin",
      symbol: "BIG",
      description: "Fixed pricing (cbBTC)",
      price: "0.0002 cbBTC",
      priceType: "fixed",
      icon: "/icons/BigDAO512.png",
    },
    {
      id: "reina" as TokenType,
      name: "Reina Coin",
      symbol: "$REINA",
      description: "Real-time pricing (USDC)",
      price: priceData ? `$${priceData.buyPrice} USDC` : "Loading...",
      priceType: "dynamic",
      icon: "/icons/REINA_final.png", // You can add a specific Reina icon
    },
  ];

  const handleTokenSelect = (tokenId: TokenType) => {
    setSelectedToken(tokenId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Token Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Select Token to Buy
          </CardTitle>
          <CardDescription>
            Choose between BigCoin (cbBTC payment) and Reina (USDC payment)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokens.map((token) => (
              <Button
                key={token.id}
                variant={selectedToken === token.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start gap-2 relative"
                onClick={() => handleTokenSelect(token.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <Image
                    src={token.icon}
                    alt={token.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{token.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {token.description}
                    </div>
                  </div>
                  <Badge 
                    variant={token.priceType === "fixed" ? "secondary" : "default"}
                    className="flex-shrink-0"
                  >
                    {token.priceType === "fixed" ? "Fixed" : "Dynamic"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground w-full text-left">
                  Price: {token.price}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Purchase Component */}
      <div className="w-full">
        {selectedToken === "bigcoin" ? (
          <BuyBigCoinComponent />
        ) : (
          <BuyReinaComponent />
        )}
      </div>

      {/* Market Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">BigCoin (BIG)</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Price Type:</span>
                  <span className="font-medium">Fixed</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium">0.0002 cbBTC per token</span>
                </div>
                <div className="flex justify-between">
                  <span>Contract:</span>
                  <span className="font-mono text-xs">0x3A8df31105Ef1e653EDF8B1B5EE486eB78803266</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Reina Coin (REINA)</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Price Type:</span>
                  <span className="font-medium">Dynamic</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium">
                    {priceLoading ? "Loading..." : priceData ? `$${priceData.buyPrice} USDC` : "Dynamic (USDC)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Contract:</span>
                  <span className="font-mono text-xs">0x8468f9ee7c2275313979c3042166f325b1da5094</span>
                </div>
                {priceData && (
                  <>
                    <div className="flex justify-between">
                      <span>24h Volume:</span>
                      <span className="font-medium">${parseInt(priceData.volume24Hr).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Cap:</span>
                      <span className="font-medium">${parseInt(priceData.marketCap).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
