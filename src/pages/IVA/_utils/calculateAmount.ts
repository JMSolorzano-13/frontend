export function calculateAmount(response: IVAResponse | undefined, isYearly: boolean) {
  if (response) {
    const amount = isYearly
      ? response.exercise.transferred.total
      : response.period.transferred.total;
    return amount;
  }
  return 0;
}

export function getTranslatedIVATotal(data: IVAResponse | undefined) {
  if (data) {
    return data.period.transferred.total;
  }
  return 0;
}

export function getCreditableIVATotal(data: IVAResponse | undefined) {
  if (data) {
    return data.period.creditable.total;
  }
  return 0;
}

export function getExerciseTranslatedIVATotal(data: IVAResponse | undefined) {
  if (data) {
    return data.exercise.transferred.total;
  }
  return 0;
}

export function getExerciseCreditableIVATotal(data: IVAResponse | undefined) {
  if (data) {
    return data.exercise.creditable.total;
  }
  return 0;
}
