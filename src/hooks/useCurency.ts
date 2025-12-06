import { useEffect, useState } from "react";
import { getUserCountry, getExchangeRate, formatPrice } from "@/utils/currencyHelper";

interface CurrencyResult {
  displayPrice: string;
  currencyCode: string;
}

export const useCurrency = (amountInNaira: number): CurrencyResult => {
  const [result, setResult] = useState<CurrencyResult>({
    displayPrice: "₦0",
    currencyCode: "NGN",
  });

  useEffect(() => {
    const fetchAndConvert = async () => {
      try {
        const country = await getUserCountry();

        if (country.toLowerCase() === "nigeria") {
          setResult({
            displayPrice: formatPrice(amountInNaira, "NGN"),
            currencyCode: "NGN",
          });
        } else {
          const rate = await getExchangeRate("NGN", "USD");
          const converted = amountInNaira * rate;
          setResult({
            displayPrice: formatPrice(converted, "USD"),
            currencyCode: "USD",
          });
        }
      } catch (error) {
        console.error("Error converting currency:", error);
        setResult({
          displayPrice: formatPrice(amountInNaira, "NGN"),
          currencyCode: "NGN",
        });
      }
    };

    fetchAndConvert();
  }, [amountInNaira]);

  return result;
};
