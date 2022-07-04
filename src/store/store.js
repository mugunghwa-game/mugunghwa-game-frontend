import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set) => ({
    people: [],
    participant: [],
    difficulty: "",

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
    removeAll: () =>
      set(() => ({
        people: [],
        participant: [],
        difficulty: "",
      })),
  }))
);

export default useStore;
