/** @jest-environment node */

import { POST } from "@/app/api/call-playbook/route";
import { contactsSeed } from "@/lib/mock-data";

describe("call playbook API", () => {
  it("returns tailored guidance for discovery objective", async () => {
    const contact = contactsSeed[0];
    const request = new Request("http://localhost/api/call-playbook", {
      method: "POST",
      body: JSON.stringify({
        contact,
        objective: "Discovery",
        tone: "Advisor",
        challenge: "Manual onboarding",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json();

    expect(payload.opener).toContain(contact.name.split(" ")[0]);
    expect(Array.isArray(payload.discovery)).toBe(true);
    expect(payload.discovery.length).toBeGreaterThanOrEqual(3);
    expect(payload.nextSteps).toEqual(
      expect.arrayContaining([expect.stringContaining(contact.company)])
    );
  });
});
