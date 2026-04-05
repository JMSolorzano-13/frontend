export const getCFDICountFuzzySearch = (tab: keyof CFDICount, quantity: string) => {
  return {
    I: "",
    E: "",
    N: "",
    P: "",
    T: "",
    ALL: "",
    [tab]: quantity,
  };
};
