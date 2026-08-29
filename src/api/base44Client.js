import { localAuth, ensureGuest } from "./localAuth";
import { localEntities, seedIfNeeded } from "./localEntities";
import { localIntegrations } from "./localIntegrations";
import { invokeFunction } from "./localFunctions";

ensureGuest();
seedIfNeeded();

export const base44 = {
  auth: localAuth,
  entities: localEntities,
  integrations: localIntegrations,
  functions: {
    invoke: invokeFunction,
  },
  asServiceRole: {
    entities: localEntities,
    integrations: localIntegrations,
    functions: {
      invoke: invokeFunction,
    },
  },
};
