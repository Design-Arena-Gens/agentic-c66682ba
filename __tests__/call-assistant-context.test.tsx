import { renderHook, act } from "@testing-library/react";
import {
  CallAssistantProvider,
  useCallAssistant,
} from "@/context/call-assistant-context";

describe("CallAssistantProvider", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CallAssistantProvider>{children}</CallAssistantProvider>
  );

  it("queues new calls", () => {
    const { result } = renderHook(() => useCallAssistant(), { wrapper });
    const initial = result.current.callQueue.length;

    act(() => {
      result.current.scheduleCall({
        contactId: result.current.contacts[0].id,
        scheduledFor: new Date().toISOString(),
        objective: "Discovery",
        channel: "Zoom",
        prepNotes: ["Confirm scope"],
      });
    });

    expect(result.current.callQueue).toHaveLength(initial + 1);
    expect(result.current.callQueue.at(-1)?.objective).toBe("Discovery");
  });

  it("logs notes when completing calls", () => {
    const { result } = renderHook(() => useCallAssistant(), { wrapper });
    const target = result.current.callQueue[0];

    act(() => {
      result.current.completeCall({
        callId: target.id,
        summary: "Closed the loop",
        sentiment: "positive",
        nextStep: "Send recap",
      });
    });

    expect(result.current.callQueue.find((call) => call.id === target.id)?.status).toBe(
      "Completed"
    );
    expect(result.current.notes[0]).toMatchObject({ summary: "Closed the loop" });
  });
});
