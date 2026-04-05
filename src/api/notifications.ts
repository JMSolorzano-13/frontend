import http from "./_http";

export const getNotifications = async (workspace: string | null) => {
  if (!workspace) {
    throw new Error("No workspace for fetching license");
  }

  const { data } = await http.get(`/License/${workspace}`);

  const { freeTrialActivationDate, status } = data?.data ?? data;

  // Estados donde NO debe mostrarse nada
  if (status === 2 || status === 3) {
    return {
      trialRemainingDays: 0,
      isFreeTrialNotificationView: false,
      isAfterDaysNotificationsView: false,
    };
  }

  if (!freeTrialActivationDate) {
    return {
      trialRemainingDays: 0,
      isFreeTrialNotificationView: false,
      isAfterDaysNotificationsView: false,
    };
  }

  // Cálculo de días transcurridos
  const startDate = new Date(freeTrialActivationDate);
  const today = new Date();

  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const remainingDays = Math.abs(diffDays - 15);

  // Escenario 1: Día 0 - 7
  if (diffDays >= 0 && diffDays <= 7) {
    return {
      trialRemainingDays: remainingDays,
      isFreeTrialNotificationView: true,
      isAfterDaysNotificationsView: false,
    };
  }

  // Escenario 2: Día 8 - 14
  if (diffDays >= 8 && diffDays <= 14) {
    return {
      trialRemainingDays: remainingDays,
      isFreeTrialNotificationView: false,
      isAfterDaysNotificationsView: true,
    };
  }

  // Fuera de la prueba
  return {
    trialRemainingDays: remainingDays,
    isFreeTrialNotificationView: false,
    isAfterDaysNotificationsView: false,
  };
};
