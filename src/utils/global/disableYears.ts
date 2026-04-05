export const disableYears = (dateTree: PeriodTree[]) => {
  return dateTree.map((dateItem) => ({ ...dateItem, selectable: false }));
};