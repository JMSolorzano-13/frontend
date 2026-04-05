import CFDIContainer from "../CFDIContainer";

export default function CFDIReceived() {
  const MODULE_ID: CFDIModule = "received";

  return <CFDIContainer moduleID={MODULE_ID} />;
}
