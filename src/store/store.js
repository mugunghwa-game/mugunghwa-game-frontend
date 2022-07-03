import create from "zustand";

const useStore = create((set) => ({
  people: [],
  participant: [],
  difficulty: "",
  addPerson: (item) =>
    set((state) => ({
      people: [{ person: item.person, role: item.role }, ...state.people],
    })),
  addDifficulty: (item) =>
    set((state) => ({
      difficulty: item,
    })),
  addParticipant: (item) =>
    set((state) => ({
      participant: item,
    })),
  upadateParticipant: (item) =>
    set((state) => ({
      participant: state.participant.filter((each) => {
        if (each.id === item) {
          each.opportunity -= 1;
          console.log(each);
        }
      }),
    })),
}));

export default useStore;
