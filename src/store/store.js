import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set) => ({
    people: [],
    participant: [],
    difficulty: "",
    winner: "",
    firstParticipantPose: [],

    addPerson: (item) =>
      set((state) => ({
        people: [
          ...state.people.filter((person) => person.person !== item.person),
          { person: item.person, role: item.role },
        ],
      })),
    addDifficulty: (item) =>
      set((state) => ({
        difficulty: item,
      })),
    addParticipant: (item) =>
      set((state) => ({
        participant: [...state.participant, { id: item, opportunity: 3 }],
      })),
    upadateParticipant: (item) =>
      set((state) => ({
        participant: state.participant.filter((each) => {
          if (each.id === item) {
            each.opportunity -= 1;
          }
        }),
      })),
    addFirstParticipantPose: (item) =>
      set((state) => ({
        firstParticipantPose:
          state.firstParticipantPose.length === 3
            ? [item]
            : [...state.firstParticipantPose, item],
      })),
    addWinner: (item) =>
      set((state) => ({
        winner: item,
      })),
    removeAll: () =>
      set(() => ({
        people: [],
        participant: [],
        difficulty: "",
        firstParticipantPose: [],
      })),
  }))
);

export default useStore;
