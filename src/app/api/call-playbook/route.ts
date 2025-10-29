import { NextResponse } from "next/server";
import type { ContactRecord } from "@/lib/mock-data";
import { personaPlaybooks } from "@/lib/mock-data";

const objectiveBlueprint: Record<
  string,
  {
    opener: (contact: ContactRecord, tone?: string) => string;
    discovery: (challenge?: string) => string[];
    differentiation: (contact: ContactRecord) => string[];
    closing: (contact: ContactRecord) => string;
    nextSteps: (contact: ContactRecord) => string[];
  }
> = {
  Discovery: {
    opener: (contact, tone) =>
      `Hey ${contact.name.split(" ")[0]}, appreciate you carving out time today. I'll keep this ${tone ?? "calibrated"} and focused on what could move the needle fastest for ${contact.company}.`,
    discovery: (challenge) => {
      const topic = challenge?.toLowerCase() ?? "the current process";
      return [
        `Walk me through how ${topic} shows up in your week right now?`,
        "When that bottleneck hits, who else is pulled in and what gets deprioritized?",
        "If we solved this in the next 30 days, what other initiative could accelerate?",
      ];
    },
    differentiation: (contact) => [
      `Translate our automation outcomes to ${contact.company}'s north-star KPIs.`,
      "Highlight the control dashboard with live instrumentation for their operators.",
      "Show how we embed success rituals so the team never reverts back to manual chaos.",
    ],
    closing: (contact) =>
      `Suggest a rapid workflow teardown session with your ops partner so we can model the exact impact for ${contact.company}.`,
    nextSteps: (contact) => [
      `Send 2-slide diagnostic summary tailored to ${contact.company}.`,
      "Book validation demo with real use-case artifacts.",
      "Co-create success metrics in shared doc before next call.",
    ],
  },
  Qualification: {
    opener: (contact, tone) =>
      `${contact.name}, thanks for looping me in. I'll stay ${tone ?? "measured"} and give you the data points you need to vet us fast.`,
    discovery: (challenge) => {
      const blocker = challenge?.toLowerCase() ?? "this roadblock";
      return [
        `What's the current approval path when you invest to eliminate ${blocker}?`,
        "Who ultimately signs the agreement and what do they care about most?",
        "Are there parallel initiatives we should align the timeline with?",
      ];
    },
    differentiation: () => [
      "We map responsibilities to your team to reduce lift during onboarding.",
      "Our success pods share instrumentation weekly so stakeholders stay informed.",
      "We de-risk with a milestone-based investment schedule tied to outcomes.",
    ],
    closing: (contact) =>
      `Confirm the stakeholder matrix and secure calendar holds for each decision-maker at ${contact.company}.`,
    nextSteps: (_contact) => [
      "Email qualification summary with budget guardrails.",
      "Send security + compliance pack for procurement review.",
      "Lock demo session with technical evaluator.",
    ],
  },
  "Product Demo": {
    opener: (contact) =>
      `${contact.name}, excited to tailor this build for you. We'll start with the exact workflow your team lives in daily.`,
    discovery: () => [
      "Confirm the must-have outcomes for success.",
      "Identify where hand-offs currently break down.",
      "Surface any red lines we need to avoid.",
    ],
    differentiation: (contact) => [
      `Demonstrate live automation using ${contact.company}'s data blueprint.`,
      "Show exec dashboard that broadcasts impact in real time.",
      "Spotlight white-glove support and template library for fast ramp.",
    ],
    closing: (contact) =>
      `Gain verbal confirmation on value alignment and schedule proposal workshop for ${contact.company}.`,
    nextSteps: (_contact) => [
      "Deliver replay with highlights clipped to decisions.",
      "Share ROI calculator pre-populated with their data.",
      "Confirm pilot configuration preferences.",
    ],
  },
  "Proposal Review": {
    opener: (contact) =>
      `${contact.name}, let's walk the numbers together so you leave ready to green-light without surprises.`,
    discovery: () => [
      "Validate the problem statement still matches their urgency.",
      "Check executive expectations on timeline and deliverables.",
      "Confirm financial guardrails and payment structure.",
    ],
    differentiation: () => [
      "Outline phased deployment to minimize bandwidth.",
      "Show the economic story tied to each milestone.",
      "Emphasize executive reporting cadence and concierge support.",
    ],
    closing: (contact) =>
      `Gain consensus on scope and align legal kickoff date for ${contact.company}.`,
    nextSteps: (_contact) => [
      "Email redline-ready agreement immediately after call.",
      "Share onboarding runway plan with responsibilities.",
      "Book executive sponsor handshake within 48 hours.",
    ],
  },
  Negotiation: {
    opener: (contact) =>
      `${contact.name}, appreciate you being direct. Let's engineer the package that protects outcomes and keeps ${contact.company} confident.`,
    discovery: (challenge) => {
      const friction = challenge?.toLowerCase() ?? "the current blockers";
      return [
        `What conditions need to be met before you can approve despite ${friction}?`,
        "Is there a budget reshuffle or procurement policy we should consider?",
        "What does a perfect win look like for you personally?",
      ];
    },
    differentiation: () => [
      "Lock in value anchors tied to risk removal.",
      "Offer accelerators that compress time-to-value.",
      "Position give/get matrix with clear concessions.",
    ],
    closing: (contact) =>
      `Secure a verbal yes contingent on refined terms and book legal handoff for ${contact.company}.`,
    nextSteps: (_contact) => [
      "Deliver updated commercial terms before end of day.",
      "Loop in CFO/finance champion for alignment.",
      "Schedule celebration call post-signature to map launch.",
    ],
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact, objective, tone, challenge } = body as {
      contact: ContactRecord;
      objective: keyof typeof objectiveBlueprint;
      tone: string;
      challenge: string;
    };

    if (!contact || !objectiveBlueprint[objective]) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    const blueprint = objectiveBlueprint[objective];
    const persona = personaPlaybooks[contact.persona];
    const normalizedTone = tone?.toLowerCase() ?? "calibrated";

    const response = {
      opener: `${blueprint.opener(contact, normalizedTone)} ${persona.headline}.`,
      discovery: [
        ...blueprint.discovery(challenge),
        `Inject persona insight: ${persona.keyPoints[0]}`,
      ],
      differentiation: [
        persona.keyPoints[1],
        ...blueprint.differentiation(contact).slice(0, 2),
      ],
      closing: `${blueprint.closing(contact)} ${persona.closingStyle}`,
      nextSteps: blueprint.nextSteps(contact),
    } satisfies {
      opener: string;
      discovery: string[];
      differentiation: string[];
      closing: string;
      nextSteps: string[];
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to synthesize plan" },
      { status: 500 }
    );
  }
}
