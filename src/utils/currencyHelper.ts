import axios from "axios";
import currency from "currency.js";

export const getUserCountry = async (): Promise<string> => {
  try {
    const cached = localStorage.getItem("userCountry");
    if (cached) return cached;

    const { data } = await axios.get("https://ipapi.co/json/");
    const country = data.country_name || "Unknown";

    localStorage.setItem("userCountry", country);
    return country;
  } catch (error) {
    console.error("Failed to get location:", error);
    return "Unknown";
  }
};

export const getExchangeRate = async (base = "NGN", target = "USD"): Promise<number> => {
  try {
    const cached = localStorage.getItem("exchangeRate");
    if (cached) return Number(cached);

    const { data } = await axios.get(
      `https://api.exchangerate.host/latest?base=${base}&symbols=${target}`
    );
    const rate = data.rates[target];

    localStorage.setItem("exchangeRate", rate.toString());
    return rate;
  } catch (error) {
    console.error("Failed to get exchange rate:", error);
    return 0.001; // fallback
  }
};

export const formatPrice = (amount: number, currencyCode: string) => {
  return currency(amount, {
    symbol: currencyCode === "NGN" ? "₦" : "$",
    precision: 0,
  }).format();
};
