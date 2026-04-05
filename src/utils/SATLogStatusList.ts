type SATStatusListType = {
  [key: string]: {
    tagInfo: {
      color: string;
      text: string;
    };
    description: string;
  };
};

export const SATStatusList: SATStatusListType = {
  DRAFT: {
    tagInfo: { color: "default", text: "Creado" },
    description: "Se ha creado la petición para ser enviada al SAT",
  },
  SENT: {
    tagInfo: { color: "warning", text: "Petición enviada" },
    description: "La petición se ha enviado al SAT",
  },
  SPLITTED: {
    tagInfo: { color: "orange", text: "Descarga Dividida" },
    description:
      "La petición ha sido dividida en varias peticiones más pequeñas para asegurar su procesamiento",
  },
  TO_SCRAP: {
    tagInfo: { color: "orange", text: "Descarga Scrap" },
    description:
      "Se intentará la descarga por medio de la pagina del SAT, debido a que el Webservice ha tardado mucho en responder a la solicitud",
  },
  TO_DOWNLOAD: {
    tagInfo: { color: "blue", text: "En proceso" },
    description:
      "La solicitud ha sido aceptada por el SAT y ha iniciado la espera del paquete de CFDIs",
  },
  SCRAPPED: {
    tagInfo: { color: "processing", text: "Scrap Completado" },
    description:
      "El paquete ha sido descargado por medio de la página del SAT, en breve se iniciará su procesamiento",
  },
  DOWNLOADED: {
    tagInfo: { color: "processing", text: "Procesando" },
    description:
      "Se ha recibido el paquete y se está procesando la información en tu base de datos",
  },
  PROCESSING: {
    tagInfo: { color: "orange", text: "En proceso" },
    description:
      "El paquete continúa en proceso, en breve se actualizará el estado dependiendo el resultado del procesamiento",
  },
  DELAYED: {
    tagInfo: { color: "gold", text: "Procesamiento Pospuesto" },
    description:
      "El paquete se ha recibido pero el procesamiento ha sido pospuesto y se realizará en cualquier momento",
  },
  PROCESSED: {
    tagInfo: { color: "success", text: "Finalizada" },
    description: "Se ha finalizado el procesamiento de los CFDIs en tu base de datos",
  },
  ERROR: {
    tagInfo: { color: "error", text: "Error" },
    description:
      "Algo inesperado ha sucedido con la petición, se hará un nuevo intento con otra petición",
  },
  INFORMATION_NOT_FOUND: {
    tagInfo: { color: "default", text: "Sin datos" },
    description: "La petición no ha encontrado información en el SAT para ser descargada",
  },
  INCOMPLETE: {
    tagInfo: { color: "orange", text: "Incompleta" },
    description: "Faltaron algunos datos por descargarse",
  },
  COMPLETE: {
    tagInfo: { color: "green", text: "Finalizada" },
    description: "La descarga se ha completado",
  },
  MANUALLY_CANCELLED: {
    tagInfo: { color: "volcano", text: "Cancelado" },
    description:
      "La petición ha sido cancelada debido a detalles técnicos, pero se hará un nuevo intento en otra petición",
  },
  IN_PROGRESS: {
    tagInfo: { color: "blue", text: "En proceso" },
    description: "La descarga se está procesando",
  },
  MAY_HAVE_MISSING: {
    tagInfo: { color: "orange", text: "Incompleta" },
    description: "La descarga puede no estar finalizada del todo",
  },
  EMPTY: {
    tagInfo: { color: "default", text: "Sin datos" },
    description: "La descarga no tiene datos",
  },
};

export const addManualSyncToList = (payload: LastManualSyncType) => {
  const lastSyncs = localStorage.getItem("lastSATManualSync");
  const syncList = JSON.parse(lastSyncs !== null ? lastSyncs : "[]") as LastManualSyncType[];
  const found = syncList.find((item) => payload.companyId === item.companyId);
  if (found) {
    const updatedSync = syncList.map((item) => {
      if (payload.companyId === item.companyId) {
        return {
          ...item,
          lastSyncDate: new Date(),
          amountOfDailyRequest: item.amountOfDailyRequest + 1,
        };
      }
      return item;
    });
    localStorage.setItem("lastSATManualSync", JSON.stringify(updatedSync));
  } else {
    // un nuevo valor
    localStorage.setItem(
      "lastSATManualSync",
      JSON.stringify([
        {
          ...payload,
          amountOfDailyRequest: 1,
        },
        ...syncList,
      ])
    );
  }
};

export const resetManualSync = () => {
  localStorage.setItem("lastSATManualSync", JSON.stringify([]));
};

export const updateManualSyncLimit = (companyId: string) => {
  const lastSyncs = localStorage.getItem("lastSATManualSync");
  const syncList = JSON.parse(lastSyncs !== null ? lastSyncs : "[]") as LastManualSyncType[];

  const found = syncList.find((item) => item.companyId === companyId);

  if (found) {
    const newLastSync = syncList.map((item) => {
      if (item.companyId === companyId) {
        return { ...item, amountOfDailyRequest: 2 };
      }
      return item;
    });
    localStorage.setItem("lastSATManualSync", JSON.stringify(newLastSync));
  }
};
