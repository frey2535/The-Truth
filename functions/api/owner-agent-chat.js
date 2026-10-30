import { handleOwnerAgentChat } from "../../src/lib/ownerAgentChatApi.js";
import { loadInstallLedger, saveInstallLedger } from "../../src/lib/installStore.js";

export async function onRequest({ request, env }) {
  return handleOwnerAgentChat({
    request,
    env,
    load: () => loadInstallLedger(env),
    save: (ledger) => saveInstallLedger(env, ledger),
  });
}
