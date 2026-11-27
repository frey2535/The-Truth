import { ConsoleStdout, File, OpenFile, PreopenDirectory, WASI } from "@bjorn3/browser_wasi_shim";

// Run Flite in a virtual directory. The scripture and generated WAV stay in memory.
export async function renderFlite(wasm, text, rate) {
  const output = new File(new Uint8Array());
  const args = ["flite", "-voice", "slt", "--setf", `duration_stretch=${1 / rate}`, "-t", text, "-o", "out.wav"];
  const quiet = () => ConsoleStdout.lineBuffered(() => {});
  const wasi = new WASI(args, [], [
    new OpenFile(new File(new Uint8Array())),
    quiet(),
    quiet(),
    new PreopenDirectory(".", [["out.wav", output]]),
  ]);
  const instance = await WebAssembly.instantiate(wasm, { wasi_snapshot_preview1: wasi.wasiImport });
  if (wasi.start(instance) !== 0 || output.data.length <= 44) {
    throw new Error("The built-in voice could not generate audio.");
  }
  return output.data;
}
