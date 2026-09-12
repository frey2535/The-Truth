import { useEffect, useState } from "react";
import { getAudibleState, isSpeechSupported, subscribeAudible } from "@/lib/audibleReader";

export default function useAudibleReader() {
  const [state, setState] = useState(getAudibleState);
  useEffect(() => subscribeAudible(setState), []);
  return { ...state, supported: isSpeechSupported() };
}
