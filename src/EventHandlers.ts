/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  LensHubContract_Approval_loader,
  LensHubContract_Approval_handler,
  LensHubContract_ApprovalForAll_loader,
  LensHubContract_ApprovalForAll_handler,
  LensHubContract_Transfer_loader,
  LensHubContract_Transfer_handler,
} from "../generated/src/Handlers.gen";

import {
  ApprovalEntity,
  ApprovalForAllEntity,
  TransferEntity,
  EventsSummaryEntity
} from "./src/Types.gen";

const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  approvalsCount: BigInt(0),
  approvalForAllsCount: BigInt(0),
  transfersCount: BigInt(0),
};

LensHubContract_Approval_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LensHubContract_Approval_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    approvalsCount: currentSummaryEntity.approvalsCount + BigInt(1),
  };

  let approvalEntity: ApprovalEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    owner: event.params.owner,
    approved: event.params.approved,
    tokenId: event.params.tokenId,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Approval.set(approvalEntity);
});

LensHubContract_ApprovalForAll_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LensHubContract_ApprovalForAll_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    approvalForAllsCount: currentSummaryEntity.approvalForAllsCount + BigInt(1),
  };

  let approvalForAllEntity: ApprovalForAllEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    owner: event.params.owner,
    operator: event.params.operator,
    approved: event.params.approved,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ApprovalForAll.set(approvalForAllEntity);
});

LensHubContract_Transfer_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LensHubContract_Transfer_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    transfersCount: currentSummaryEntity.transfersCount + BigInt(1),
  };

  let transferEntity: TransferEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Transfer.set(transferEntity);
});

