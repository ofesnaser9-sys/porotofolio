import type { ReactNode } from "react";

// Button label that rolls up to a duplicate on hover (pure CSS, see .roll in globals.css).
export default function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
