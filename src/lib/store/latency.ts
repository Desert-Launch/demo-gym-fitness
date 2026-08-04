/**
 * Fake network latency. Every feature api.ts awaits this so loading skeletons,
 * pending buttons and optimistic updates are real states you can demo, not
 * code paths that never run.
 */
export function sleep(ms = 120): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
