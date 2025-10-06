const NON_ALPHANUMERIC_PATTERN = /[^a-z0-9]+/g;
const MULTIPLE_HYPHENS_PATTERN = /-+/g;
const START_HYPHEN_PATTERN = /^-/;
const END_HYPHEN_PATTERN = /-$/;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_PATTERN, "-")
    .replace(MULTIPLE_HYPHENS_PATTERN, "-")
    .replace(START_HYPHEN_PATTERN, "")
    .replace(END_HYPHEN_PATTERN, "");
}

export const applyCurrencyMask = (
  value: string | number | undefined | null
): string => {
  if (value === undefined || value === null) {
    return "R$ 0,00";
  }

  const numericValue =
    typeof value === "string" ? value.replace(/\D/g, "") : value.toString();
  const formatted = (
    Number.parseInt(numericValue || "0", 10) / 100
  ).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return formatted;
};

export const removeCurrencyMask = (value: string | undefined | null): string =>
  value === undefined || value === null ? "" : value.replace(/[^\d]/g, "");

export const getLabelFromValue = (
  value: string,
  options: { label: string; value: string }[]
): string => {
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
};
