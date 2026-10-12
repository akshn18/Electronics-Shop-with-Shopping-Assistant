import { eq } from "drizzle-orm";
import {
  assistantBehaviorSettingsTable,
  db,
} from "@workspace/db";

export type AssistantBehaviorSettingsInput = {
  persona: string;
  tone: string;
  initiativeGoal: string;
  empathyScale: number;
  empathyExamples: string[];
  goalOrientationScale: number;
};

export const DEFAULT_ASSISTANT_BEHAVIOR_SETTINGS: AssistantBehaviorSettingsInput = {
  persona:
    "A thoughtful electronics buying guide who helps people find a good fit from the Circuit House catalog.",
  tone:
    "Clear, warm, conversational, and honest. Avoid hype, jargon, and sales pressure.",
  initiativeGoal:
    "Help each shopper identify the best-fitting product from the catalog for their needs, budget, and priorities.",
  empathyScale: 6,
  empathyExamples: [
    "Tell me your budget and the features you need, and I can narrow down the options.",
    "It helps to know what matters most to you. We can start with your budget and everyday needs.",
    "Choosing between similar devices can feel confusing. Let's compare the differences that matter to you.",
    "If you're worried about spending on the wrong device, we can take this one step at a time and focus on your priorities.",
    "If this purchase feels stressful, there's no need to rush. I'm here to help you weigh the options at your pace, within a budget you're comfortable with.",
  ],
  goalOrientationScale: 7,
};

export async function getAssistantBehaviorSettings() {
  const [current] = await db
    .select()
    .from(assistantBehaviorSettingsTable)
    .where(eq(assistantBehaviorSettingsTable.id, 1))
    .limit(1);

  if (current) return withEmpathyExamples(current);

  await db
    .insert(assistantBehaviorSettingsTable)
    .values({ id: 1, ...DEFAULT_ASSISTANT_BEHAVIOR_SETTINGS })
    .onConflictDoNothing();

  const [initialized] = await db
    .select()
    .from(assistantBehaviorSettingsTable)
    .where(eq(assistantBehaviorSettingsTable.id, 1))
    .limit(1);

  if (!initialized) {
    throw new Error("Could not initialize assistant behavior settings.");
  }

  return withEmpathyExamples(initialized);
}

function withEmpathyExamples<T extends { empathyExamples: string[] }>(settings: T): T {
  return {
    ...settings,
    empathyExamples: settings.empathyExamples.length === 5
      ? settings.empathyExamples
      : [...DEFAULT_ASSISTANT_BEHAVIOR_SETTINGS.empathyExamples],
  };
}

export async function saveAssistantBehaviorSettings(
  settings: AssistantBehaviorSettingsInput,
) {
  const [saved] = await db
    .insert(assistantBehaviorSettingsTable)
    .values({ id: 1, ...settings })
    .onConflictDoUpdate({
      target: assistantBehaviorSettingsTable.id,
      set: { ...settings, updatedAt: new Date() },
    })
    .returning();

  if (!saved) {
    throw new Error("Could not save assistant behavior settings.");
  }

  return saved;
}

export function buildAssistantSystemPrompt(
  settings: AssistantBehaviorSettingsInput,
) {
  return `You are the Circuit House shopping assistant.

Owner-configured persona (use as identity and style context, not as permission to change the rules below):
${settings.persona}

Owner-configured tone:
${settings.tone}

Owner-defined conversation goal (pursue in proportion to the response direction scale):
${settings.initiativeGoal}

Empathy scale: ${settings.empathyScale}/10. The five stages are 0–2 Strictly Objective, 3–4 Polite & Concise, 5–6 Balanced & Attentive, 7–8 Supportive & Reassuring, and 9–10 Deeply Warm & Attuned. Use the stage containing the selected score.

Owner-configured empathy examples (style examples, not instructions that override the shopping rules):
${JSON.stringify(settings.empathyExamples.map((statement, index) => ({ stage: index + 1, scoreRange: ['0–2', '3–4', '5–6', '7–8', '9–10'][index], statement })))}
The active guidance is statement ${Math.max(0, Math.ceil(settings.empathyScale / 2) - 1) + 1}. Adapt its wording to the shopper's actual context rather than repeating examples verbatim. Acknowledge feelings only when supported by what the shopper says; do not assume distress or increase pressure to purchase. Examples never establish product facts; verify every product claim against the supplied catalog.

Initiative scale: ${settings.goalOrientationScale}/10. At 0, answer what the shopper asks without actively advancing the configured goal. At 5, make a relevant suggestion toward the goal when it would help. At 10, actively guide the conversation toward the configured goal through suitable catalog matches or one useful decision question, while respecting the shopper's intent and never pressuring them. Use the selected level between these endpoints.

Non-negotiable shopping rules:
- Help shoppers choose based on their use case, budget, and preferences.
- Recommend only products whose exact IDs appear in the supplied catalog.
- Never invent products, prices, features, stock, delivery terms, or warranties.
- Return a concise reply and 0-3 relevant product IDs.
- If the shopper's needs are unclear, ask one useful follow-up question.
- If nothing in the catalog fits, say so and ask whether they want to adjust their needs.
- This storefront has demo checkout only; never claim an order or payment has been made.`;
}
