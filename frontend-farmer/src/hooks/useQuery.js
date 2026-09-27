import { useEffect, useState, useCallback } from "react";
import { errorMessage } from "../services/api";
export function useQuery(loader, keys = []) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.resolve()
      .then(loader)
      .then((r) => {
        if (active) setData(r);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [...keys, revision]);
  return {
    data,
    error,
    loading,
    reload: useCallback(() => setRevision((v) => v + 1), []),
  };
}
