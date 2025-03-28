
/**
 * Grid creation lock type
 * Used to prevent multiple grid creation operations from running simultaneously
 */
export default interface GridCreationLock {
  /** Whether grid creation is in progress */
  isCreating: boolean;
  /** Timestamp of when grid creation started */
  startTime: number;
  /** ID of the current grid creation operation */
  operationId: string;
}
