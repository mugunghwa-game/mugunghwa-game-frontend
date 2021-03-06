import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set) => ({
    it: [],
    participantList: [],
    difficulty: "",
    winner: "",
    preStartFirstParticipantPose: [],
    preStartSecondparticipantPose: [],
    firstParticipantPose: [],
    secondParticipantPose: [],
    isChildFirstParticipant: false,
    isChildSecondParticipant: false,
    firstParticipantPreparation: false,
    secondParticipantPreparation: false,
    count: 0,

    addCount: (item) =>
      set((state) => ({
        count: state.count + 1,
      })),
    addIt: (item) =>
      set((state) => ({
        it: [item],
      })),
    addDifficulty: (item) =>
      set((state) => ({
        difficulty: item,
      })),
    addParticipantList: (item) =>
      set((state) => ({
        participantList: [...state.participantList, item],
      })),
    deleteParticipantList: (item) =>
      set((state) => ({
        participantList: [...state.participantList.filter((id) => id !== item)],
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
        firstParticipantPreparation: true,
      })),
    updateSecondParticipantPreparation: (item) =>
      set((state) => ({
        secondParticipantPreparation: true,
      })),
    addWinner: (item) =>
      set((state) => ({
        winner: item,
      })),
    resetPreparation: () =>
      set(() => ({
        firstParticipantPreparation: false,
        secondParticipantPreparation: false,
      })),
    removeAll: () =>
      set(() => ({
        participantList: [],
        it: [],
        difficulty: "",
        firstParticipantPose: [],
        secondParticipantPose: [],
        preStartFirstParticipantPose: [],
        preStartSecondparticipantPose: [],
        isChildFirstParticipant: false,
        isChildSecondParticipant: false,
        firstParticipantPreparation: false,
        secondParticipantPreparation: false,
        count: 0,
      })),
  }))
);

export default useStore;
