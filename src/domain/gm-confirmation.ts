export interface ProposedGMDecision<Input, Change> {
  readonly id: string;
  readonly revision: number;
  readonly inputs: Input;
  readonly change: Change;
}

export interface GMConfirmationRequest {
  readonly id: string;
  readonly revision: number;
  readonly userId: string;
}

export interface GMConfirmationGatewayOptions<Input, Change, Result> {
  readonly isAuthorizedGM: (userId: string) => boolean;
  readonly apply: (change: Change, confirmation: { readonly id: string; readonly revision: number; readonly inputs: Input; readonly userId: string }) => Result;
}

type PendingDecision<Input, Change> = Readonly<ProposedGMDecision<Input, Change>>;
type PendingResult<Input> = { readonly status: 'pending'; readonly id: string; readonly revision: number; readonly inputs: Input };
type RejectedResult = { readonly status: 'rejected'; readonly reason: 'malformed GM confirmation' | 'unauthorized GM confirmation' | 'stale GM confirmation' };

export interface GMConfirmationGateway<Input, Change, Result> {
  present(decision: ProposedGMDecision<Input, Change>): PendingResult<Input>;
  confirm(request: GMConfirmationRequest): { readonly status: 'confirmed'; readonly id: string; readonly revision: number; readonly inputs: Input; readonly result: Result } | RejectedResult;
  cancel(request: Pick<GMConfirmationRequest, 'id' | 'revision'>): { readonly status: 'cancelled'; readonly id: string; readonly revision: number } | RejectedResult;
}

const clone = <Value>(value: Value): Value => structuredClone(value);
const validId = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const validRevision = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0;
const validRequest = (value: unknown): value is GMConfirmationRequest => value !== null && typeof value === 'object' && validId((value as GMConfirmationRequest).id) && validRevision((value as GMConfirmationRequest).revision) && validId((value as GMConfirmationRequest).userId);

export function createGMConfirmationGateway<Input, Change, Result>({ isAuthorizedGM, apply }: GMConfirmationGatewayOptions<Input, Change, Result>): GMConfirmationGateway<Input, Change, Result> {
  const pending = new Map<string, PendingDecision<Input, Change>>();

  return {
    present(decision) {
      if (!validId(decision.id) || !validRevision(decision.revision)) throw new Error('A GM decision requires a non-empty id and non-negative integer revision.');
      if (pending.has(decision.id)) throw new Error('A GM decision with this id is already pending.');
      const snapshot = clone(decision);
      pending.set(snapshot.id, snapshot);
      return { status: 'pending', id: snapshot.id, revision: snapshot.revision, inputs: clone(snapshot.inputs) };
    },
    confirm(request) {
      if (!validRequest(request)) return { status: 'rejected', reason: 'malformed GM confirmation' };
      const decision = pending.get(request.id);
      if (decision === undefined || decision.revision !== request.revision) return { status: 'rejected', reason: 'stale GM confirmation' };
      if (!isAuthorizedGM(request.userId)) return { status: 'rejected', reason: 'unauthorized GM confirmation' };

      pending.delete(request.id);
      const inputs = clone(decision.inputs);
      const result = apply(clone(decision.change), { id: decision.id, revision: decision.revision, inputs: clone(inputs), userId: request.userId });
      return { status: 'confirmed', id: decision.id, revision: decision.revision, inputs, result };
    },
    cancel(request) {
      if (request === null || typeof request !== 'object' || !validId(request.id) || !validRevision(request.revision)) return { status: 'rejected', reason: 'malformed GM confirmation' };
      const decision = pending.get(request.id);
      if (decision === undefined || decision.revision !== request.revision) return { status: 'rejected', reason: 'stale GM confirmation' };
      pending.delete(request.id);
      return { status: 'cancelled', id: decision.id, revision: decision.revision };
    },
  };
}
