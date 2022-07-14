import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set) => ({
    people: [],
    participant: [],
    it: [],
    participantList: [],
    difficulty: "",
    winner: "",
    singleModeUserPose: [],
    preStartFirstParticipantPose: [],
    preStartSecondparticipantPose: [],
    firstParticipantPose: [],
    secondParticipantPose: [],
    firstVideo: [],
    secondVideo: [],
    isChildFirstParticipant: false,
    isChildSecondParticipant: false,
    fistParticipantPreparation: false,
    secondParticipantPreparation: false,
    showVideo: true,
    count: 0,
    vidoeNumber: 0,

    addCount: (item) =>
      set((state) => ({
        count: state.count + 1,
      })),
    addVideoNumber: (item) =>
      set((state) => ({
        vidoeNumber: state.vidoeNumber + 1,
      })),
    addfirstVideo: (item) =>
      set((state) => ({
        firstVideo: [item],
      })),
    addSecondVideo: (item) =>
      set((state) => ({
        secondVideo: [item],
      })),

    addPerson: (item) =>
      set((state) => ({
        people: [
          ...state.people.filter((person) => person.person !== item.person),
          { person: item.person, role: item.role },
        ],
      })),
    updatePerson: (id) =>
      set((state) => ({
        people: state.people.filter((person) => person.person !== id),
        participant: state.participant.filter((person) => person.id !== id),
        it: state.it.filter((itUser) => itUser !== id),
        participantList: state.participantList.filter((user) => user !== id),
      })),
    addIt: (item) =>
      set((state) => ({
        it: [item],
      })),
    updateShowVideo: (item) =>
      set((state) => ({
        showVideo: false,
      })),
    addDifficulty: (item) =>
      set((state) => ({
        difficulty: item,
      })),
    addParticipant: (item) =>
      set((state) => ({
        participant: [...state.participant, { id: item, opportunity: 3 }],
      })),
    addParticipantList: (item) =>
      set((state) => ({
        participantList: [...state.participantList, item],
      })),
    addUserVideo: (item) =>
      set((state) => ({
        allUserVideo: [...state.allUserVideo, item],
      })),
    updateParticipant: (item) =>
      set((state) => ({
        participant: state.participant.filter((each) => {
          if (each.id === item) {
            each.opportunity -= 1;
          }
        }),
      })),
    addSingleModeUserPose: (item) =>
      set((state) => ({
        singleModeUserPose:
          state.singleModeUserPose.length === 3
            ? [item]
            : [...state.singleModeUserPose, item],
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
        participantList: [],
        it: [],
        difficulty: "",
        firstParticipantPose: [],
        secondParticipantPose: [],
        preStartFirstParticipantPose: [],
        preStartSecondparticipantPose: [],
        firstVideo: [],
        secondVideo: [],
        isChildFirstParticipant: false,
        isChildSecondParticipant: false,
        fistParticipantPreparation: false,
        secondParticipantPreparation: false,
        showVideo: true,
        count: 0,
        vidoeNumber: 0,
      })),
  }))
);

export default useStore;
