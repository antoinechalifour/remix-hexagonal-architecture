import { useNavigate } from "remix";
import { useEffect } from "react";

export function useVerifyAccount() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);
}
