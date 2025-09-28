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
