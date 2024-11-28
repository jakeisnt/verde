import { ReactNode } from "react";

/** A Text component. Use this instead of a <p/>
 * as it's much easier to style the website from a single source of truth.
 */
function Text({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export default Text;
