"use client";

import { useMemo, useState, type FormEvent } from "react";

type NewsletterState = "idle" | "success" | "error";

export function useNewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterState>("idle");

  const message = useMemo(() => {
    if (status === "success") {
      return "Subscribed. Daily digest will be sent to your inbox.";
    }

    if (status === "error") {
      return "Please enter a valid email address.";
    }

    return "";
  }, [status]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValidEmail = /\S+@\S+\.\S+/.test(email);

    if (!isValidEmail) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  }

  return {
    email,
    setEmail,
    status,
    message,
    submit
  };
}
