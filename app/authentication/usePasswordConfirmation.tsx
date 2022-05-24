import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

function useForceUpdate() {
  const [, updateState] = useState<any>();
  return useCallback(() => updateState({}), []);
}

export function usePasswordConfirmation() {
  const forceUpdate = useForceUpdate();

  const [passwordInput, setPasswordInput] = useState<HTMLInputElement | null>(
    null
  );
  const [confirmationInput, setConfirmationInput] =
    useState<HTMLInputElement | null>(null);
  const password = useRef<string | null>(null);
  const confirmation = useRef<string | null>(null);
  const confirmationTouched = useRef<boolean | null>(false);

  useEffect(() => {
    if (passwordInput == null) return;

    const rerender = debounce(forceUpdate, 0);
    const onInput = (e: Event) => {
      password.current = (e.target as HTMLInputElement).value;
      if (confirmationTouched.current) rerender();
    };

    passwordInput.addEventListener("input", onInput);

    return () => {
      passwordInput.removeEventListener("input", onInput);
    };
  }, [forceUpdate, passwordInput]);

  useEffect(() => {
    if (confirmationInput == null) return;

    const rerender = debounce(forceUpdate, 400);
    const onInput = (e: Event) => {
      confirmation.current = (e.target as HTMLInputElement).value;
      confirmationTouched.current = true;
      rerender();
    };

    confirmationInput.addEventListener("input", onInput);
    confirmationInput.addEventListener("blur", forceUpdate);

    return () => {
      confirmationInput.removeEventListener("input", onInput);
      confirmationInput.removeEventListener("blur", forceUpdate);
    };
  }, [confirmationInput, forceUpdate]);

  return {
    password: setPasswordInput,
    confirmation: setConfirmationInput,
    matches: confirmation.current === password.current,
  };
}
