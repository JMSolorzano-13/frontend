export function handleGetCompanyName(name: string | undefined, isReduced: boolean) {
  if (name) {
    if (isReduced) {
      const splittedName = name.split(" ");
      return splittedName[0];
    }
    return name;
  }
}
