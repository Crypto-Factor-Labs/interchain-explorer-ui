import { Pipe, PipeTransform } from '@angular/core';
import { TransactionStateEnum } from '../../shared/enums/transaction-state.enum.js';

@Pipe({ name: 'filterExecPartsByState', standalone: true, pure: true })
export class FilterExecPartsByStatePipe implements PipeTransform {
  transform<T extends { isRevert?: boolean | null }>(
    parts: T[] | null | undefined,
    state: number | null | undefined
  ): T[] {
    if (!Array.isArray(parts)) return [];

    const showReverts =
      state === TransactionStateEnum.REVERTING ||
      state === TransactionStateEnum.FAILED_REVERT ||
      state === TransactionStateEnum.SUCCESSFUL_REVERT;

    return parts.filter(p => Boolean(p.isRevert) === showReverts);
  }
}
