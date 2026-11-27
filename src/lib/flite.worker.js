import fliteUrl from "@echogarden/flite-wasi/flite.wasm?url";
import { renderFlite } from "./flite.js";

let loading;

self.onmessage = async ({ data, ports: [port] }) => {
  try {
    loading ??= fetch(fliteUrl).then(async response => {
      if (!response.ok) throw new Error("Could not load the built-in voice.");
      return WebAssembly.compile(await response.arrayBuffer());
    });
    const wasm = await loading;
    const wave = await renderFlite(wasm, data.text, data.rate);
    port.postMessage({ wave }, [wave.buffer]);
  } catch {
    loading = null;
    port.postMessage({ error: true });
  } finally {
    port.close();
  }
};
