export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | RefugeeWork Connect` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | RefugeeWork Connect` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
export const countries = ["United Kingdom", "Canada", "Germany", "Kenya"] as const;
export type Country = (typeof countries)[number];
export const officialSources = {
  "United Kingdom": {
    name: "GOV.UK · Refugee support",
    url: "https://www.gov.uk/government/publications/claiming-universal-credit-and-other-benefits-if-you-are-a-refugee/refugee-guide-urgent-things-you-need-to-do",
  },
  Canada: {
    name: "Government of Canada · Refugees",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees.html",
  },
  Germany: {
    name: "BAMF · Integration",
    url: "https://www.bamf.de/EN/Themen/Integration/integration-node.html",
  },
  Kenya: { name: "UNHCR Kenya · Help", url: "https://help.unhcr.org/kenya/" },
};
export const situations = ["Preparing to apply", "I have a job offer", "Already employed"] as const;
export function getDocuments(country: string, situation: string) {
  if (!countries.some((c) => c === country) || !situations.some((s) => s === situation)) return [];
  const rows = [
    {
      id: "identity",
      title: "Identity or status documentation",
      detail: "Check which current identity or status evidence is accepted for your circumstances.",
    },
    {
      id: "work",
      title: "Evidence of permission to work",
      detail:
        country === "United Kingdom"
          ? "Review your eVisa and the official right-to-work process. Refugee status and a pending asylum claim have different rules."
          : "Confirm your status and any employment conditions with the relevant authority.",
    },
    {
      id: "qualifications",
      title: "CV and qualification records",
      detail: "Prepare your CV. Regulated professions may require recognition or licensing.",
    },
  ];
  if (situation !== "Preparing to apply")
    rows.push({
      id: "offer",
      title: "Job offer or employment contract",
      detail: "Keep a written record of the role, pay, hours, and employer details.",
    });
  if (situation === "Already employed")
    rows.push({
      id: "salary",
      title: "Salary payment details",
      detail:
        "Confirm a safe, accepted way to receive wages with your employer and financial institution.",
    });
  return rows;
}
export function readiness(completed: string[], required: { id: string }[]) {
  return required.length
    ? Math.round(
        (required.filter((row) => completed.includes(row.id)).length / required.length) * 100,
      )
    : 0;
}
