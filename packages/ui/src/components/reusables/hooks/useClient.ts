import { useEffect } from "react";
import { useCustomStates } from "./useCustomState";

export default function useClient() {
  const { isClient, setIsClient } = useCustomStates({
    client: false,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
