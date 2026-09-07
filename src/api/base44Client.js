import { localAuth, ensureGuest } from "./localAuth";
import { localEntities, seedIfNeeded } from "./localEntities";
import { localIntegrations } from "./localIntegrations";
import { invokeFunction } from "./localFunctions";
import { localOwner } from "./localOwner";

ensureGuest();
seedIfNeeded();

export const base44 = {
  auth: localAuth,
  entities: localEntities,
  integrations: localIntegrations,
  functions: {
    invoke: invokeFunction,
  },
  owner: localOwner,
  asServiceRole: {
    entities: localEntities,
    integrations: localIntegrations,
    functions: {
      invoke: invokeFunction,
    },
  },
};
