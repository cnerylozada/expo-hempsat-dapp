import type { FlowStep } from "@/components/shared/FlowProgress";
import type { PracticeType } from "@/server/models";

export type PracticeInfo = {
  id: PracticeType;
  name: string;
  /** One line shown on the option card. */
  summary: string;
  /** Everything the "what is this?" sheet shows. */
  info: {
    title: string;
    about: string;
    benefits: string[];
    /** What the forms will ask: a label and a short hint of the answer. */
    asks: { label: string; value: string }[];
  };
};

// The life of a practice, for FlowProgress.
export const PRACTICE_FLOW_STEPS: FlowStep[] = [
  {
    title: "Start",
    subtitle: "Choose a practice and tell us how your field looks today.",
    shortSubtitle: "Choose a practice",
  },
  {
    title: "Check in",
    subtitle: "Add photos and notes as the season goes on.",
    shortSubtitle: "Photos and notes",
  },
  {
    title: "Close",
    subtitle: "Finish it at harvest. Then you can start a new one.",
    shortSubtitle: "At harvest",
  },
];

// What the farmer should know before starting a practice.
export const PRACTICE_RULES = [
  "Only one practice at a time on each area.",
  "Once you sign it, the start of the practice can't be changed.",
];

export const PRACTICES: PracticeInfo[] = [
  {
    id: "mulching",
    name: "Mulching",
    summary: "Cover the soil with residue, straw or leaves.",
    info: {
      title: "What is mulching?",
      about:
        "You cover the bare soil with crop residue, straw or leaves. The cover keeps water in, holds the soil in place and slowly feeds it.",
      benefits: [
        "Less water lost from the soil.",
        "Rain and wind carry less soil away.",
        "Fewer weeds come up.",
      ],
      asks: [
        { label: "Material", value: "What you used" },
        { label: "Amount", value: "Kg or tonnes" },
        { label: "Coverage", value: "How much ground" },
        { label: "Photos", value: "1 to 10" },
      ],
    },
  },
  {
    id: "organic_amendments",
    name: "Organic amendments",
    summary: "Add compost or manure to feed the soil.",
    info: {
      title: "What are organic amendments?",
      about:
        "You spread compost, manure or other organic matter on the soil. It adds nutrients and gives the soil life a place to grow.",
      benefits: [
        "Richer soil with more organic matter.",
        "Plants get nutrients over a longer time.",
        "Soil holds water better.",
      ],
      asks: [
        { label: "Type", value: "Compost or manure" },
        { label: "Amount", value: "Kg or tonnes" },
        { label: "Coverage", value: "How much ground" },
        { label: "Photos", value: "1 to 10" },
      ],
    },
  },
  {
    id: "cover_crops",
    name: "Cover crops",
    summary: "Grow plants that protect the soil between harvests.",
    info: {
      title: "What are cover crops?",
      about:
        "You sow plants that are not for harvest between your main crops. Their roots and leaves protect the soil while it rests.",
      benefits: [
        "Roots hold the soil in place.",
        "Fewer weeds between harvests.",
        "Some plants add nitrogen back to the soil.",
      ],
      asks: [
        { label: "Species", value: "What you sowed" },
        { label: "Sowing date", value: "When you sowed" },
        { label: "Coverage", value: "How much ground" },
        { label: "Photos", value: "1 to 10" },
      ],
    },
  },
];
