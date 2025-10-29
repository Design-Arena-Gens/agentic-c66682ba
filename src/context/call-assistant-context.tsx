"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import {
  CallNote,
  CallTask,
  ContactRecord,
  callNotesSeed,
  callQueueSeed,
  contactsSeed,
  PersonaArchetype,
} from "@/lib/mock-data";

type SchedulePayload = {
  contactId: string;
  scheduledFor: string;
  objective: CallTask["objective"];
  channel: CallTask["channel"];
  prepNotes?: string[];
};

type CompletePayload = {
  callId: string;
  summary: string;
  sentiment: CallNote["sentiment"];
  nextStep: string;
};

type UpdateContactPayload = {
  contactId: string;
  status: ContactRecord["status"];
  lastInteraction?: string;
};

type AddPersonaNotePayload = {
  contactId: string;
  persona: PersonaArchetype;
  insight: string;
};

type Action =
  | { type: "SCHEDULE_CALL"; payload: SchedulePayload }
  | { type: "COMPLETE_CALL"; payload: CompletePayload }
  | { type: "UPDATE_CONTACT"; payload: UpdateContactPayload }
  | { type: "ADD_NOTE"; payload: CallNote }
  | { type: "ADD_PERSONA_INSIGHT"; payload: AddPersonaNotePayload };

type State = {
  contacts: ContactRecord[];
  callQueue: CallTask[];
  notes: CallNote[];
};

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 10)}`;

const initialState: State = {
  contacts: contactsSeed,
  callQueue: callQueueSeed,
  notes: callNotesSeed,
};

const CallAssistantContext = createContext<
  (State & {
    scheduleCall: (payload: SchedulePayload) => void;
    completeCall: (payload: CompletePayload) => void;
    updateContact: (payload: UpdateContactPayload) => void;
    addNote: (payload: CallNote) => void;
    addPersonaInsight: (payload: AddPersonaNotePayload) => void;
  })
 | null
>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SCHEDULE_CALL": {
      const newTask: CallTask = {
        id: generateId(),
        contactId: action.payload.contactId,
        scheduledFor: action.payload.scheduledFor,
        objective: action.payload.objective,
        channel: action.payload.channel,
        status: "Scheduled",
        prepNotes: action.payload.prepNotes ?? [],
      };
      return {
        ...state,
        callQueue: [...state.callQueue, newTask].sort(
          (a, b) =>
            new Date(a.scheduledFor).getTime() -
            new Date(b.scheduledFor).getTime()
        ),
      };
    }
    case "COMPLETE_CALL": {
      const { callId, summary, sentiment, nextStep } = action.payload;
      const call = state.callQueue.find((item) => item.id === callId);
      if (!call) return state;

      const updatedQueue = state.callQueue.map((item): CallTask =>
        item.id === callId
          ? {
              ...item,
              status: "Completed",
            }
          : item
      );

      const note: CallNote = {
        id: generateId(),
        contactId: call.contactId,
        summary,
        sentiment,
        nextStep,
        createdAt: new Date().toISOString(),
      };

      return {
        ...state,
        callQueue: updatedQueue,
        notes: [note, ...state.notes],
      };
    }
    case "UPDATE_CONTACT": {
      const { contactId, status, lastInteraction } = action.payload;
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === contactId
            ? {
                ...contact,
                status,
                lastInteraction: lastInteraction ?? new Date().toISOString(),
              }
            : contact
        ),
      };
    }
    case "ADD_NOTE": {
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      };
    }
    case "ADD_PERSONA_INSIGHT": {
      const { contactId, persona, insight } = action.payload;
      const updatedContacts = state.contacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              tags: Array.from(new Set([...contact.tags, persona, insight])),
            }
          : contact
      );
      return {
        ...state,
        contacts: updatedContacts,
      };
    }
    default:
      return state;
  }
}

export function CallAssistantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const scheduleCall = useCallback(
    (payload: SchedulePayload) => {
      dispatch({ type: "SCHEDULE_CALL", payload });
    },
    []
  );

  const completeCall = useCallback(
    (payload: CompletePayload) => {
      dispatch({ type: "COMPLETE_CALL", payload });
    },
    []
  );

  const updateContact = useCallback((payload: UpdateContactPayload) => {
    dispatch({ type: "UPDATE_CONTACT", payload });
  }, []);

  const addNote = useCallback((payload: CallNote) => {
    dispatch({ type: "ADD_NOTE", payload });
  }, []);

  const addPersonaInsight = useCallback((payload: AddPersonaNotePayload) => {
    dispatch({ type: "ADD_PERSONA_INSIGHT", payload });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      scheduleCall,
      completeCall,
      updateContact,
      addNote,
      addPersonaInsight,
    }),
    [state, scheduleCall, completeCall, updateContact, addNote, addPersonaInsight]
  );

  return (
    <CallAssistantContext.Provider value={value}>
      {children}
    </CallAssistantContext.Provider>
  );
}

export function useCallAssistant() {
  const context = useContext(CallAssistantContext);
  if (!context) {
    throw new Error(
      "useCallAssistant must be used within a CallAssistantProvider"
    );
  }
  return context;
}
