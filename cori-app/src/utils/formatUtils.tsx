// Utility functions for formatting data

// Format phone number
const formatPhone = (phoneNumber: string) => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Cut off any extra digits
  const trimmed = cleaned.slice(0, 10);

  // Format: +27 12 345 6789
  return `+27 ${trimmed.slice(1, 3)} ${trimmed.slice(3, 6)} ${trimmed.slice(6)}`;
};

// Format to Rand Amount (E.g. 12312345678900 -> R123,123,456,789.00)
const formatRandAmount = (amount: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
};

export { formatPhone, formatRandAmount };
