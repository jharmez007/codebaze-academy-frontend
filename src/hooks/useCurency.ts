import { useEffect, useState } from "react";
import { getUserCountry, getExchangeRate, formatPrice } from "@/utils/currencyHelper";

export const useCurrency = (amountInNaira: number) => {
  const [displayPrice, setDisplayPrice] = useState<string>("₦0");

  useEffect(() => {
    const fetchAndConvert = async () => {
      try {
        const country = await getUserCountry();

        if (country.toLowerCase() === "nigeria") {
          setDisplayPrice(formatPrice(amountInNaira, "NGN"));
        } else {
          const rate = await getExchangeRate("NGN", "USD");
          const converted = amountInNaira * rate;
          setDisplayPrice(formatPrice(converted, "USD"));
        }
      } catch (error) {
        console.error("Error converting currency:", error);
        setDisplayPrice(formatPrice(amountInNaira, "NGN"));
      }
    };

    fetchAndConvert();
  }, [amountInNaira]);

  return displayPrice;
};
