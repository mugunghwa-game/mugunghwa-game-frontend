import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set) => ({
    people: [],
    participant: [],
    difficulty: "",
    winner: "",
    preStartFirstParticipantPose: [],
    preStartSecondparticipantPose: [],
    firstParticipantPose: [],
    secondParticipantPose: [],
    isChildFirstParticipant: false,
    isChildSecondParticipant: false,
    fistParticipantPreparation: false,
    secondParticipantPreparation: false,

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
    updateParticipant: (item) =>
      set((state) => ({
        participant: state.participant.filter((each) => {
          if (each.id === item) {
            each.opportunity -= 1;
          }
        }),
      })),
    addPreStartFirstParticipantPose: (item) =>
      set((state) => ({
        preStartFirstParticipantPose:
          state.preStartFirstParticipantPose.length === 3
            ? [item]
            : [...state.preStartFirstParticipantPose, item],
      })),
    addPreStartSecondparticipantPose: (item) =>
      set((state) => ({
        preStartSecondparticipantPose:
          state.preStartSecondparticipantPose.length === 3
            ? [item]
            : [...state.preStartSecondparticipantPose, item],
      })),
    addFirstParticipantPose: (item) =>
      set((state) => ({
        firstParticipantPose:
          state.firstParticipantPose.length === 3
            ? [item]
            : [...state.firstParticipantPose, item],
      })),
    addSecondParticipantPose: (item) =>
      set((state) => ({
        secondParticipantPose:
          state.secondParticipantPose.length === 3
            ? [item]
            : [...state.secondParticipantPose, item],
      })),
    updateFirstChildParticipant: (item) =>
      set((state) => ({
        isChildFirstParticipant: true,
      })),
    updateSecondChildParticipant: (item) =>
      set((state) => ({
        isChildSecondParticipant: true,
      })),
    updateFirstParticipantPreparation: (item) =>
      set((state) => ({
        fistParticipantPreparation: true,
      })),
    updateSecondParticipantPreparation: (item) =>
      set((state) => ({
        secondParticipantPreparation: true,
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
        secondParticipantPose: [],
        preStartFirstParticipantPose: [],
        preStartSecondparticipantPose: [],
        isChildFirstParticipant: false,
        isChildSecondParticipant: false,
        fistParticipantPreparation: false,
        secondParticipantPreparation: false,
      })),
  }))
);

export default useStore;
