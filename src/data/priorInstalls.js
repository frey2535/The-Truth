/**
 * Known home-screen installs from before the live counter.
 * Each row is merged into the owner ledger on every load so Cache eviction
 * cannot drop them. Add more here when you already know a device installed.
 *
 * device: stable id, at least 8 characters
 * platform: ios | android | desktop
 * at: ISO date when they installed, if known
 */
export const PRIOR_INSTALLS = [];
