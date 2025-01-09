import {
  useReadContract,
  useSendTransaction,
  useContractEvents,
} from "thirdweb/react";
import { VOTING_CONTRACT } from "@/lib/contracts";
import { useMemo } from "react";
import { prepareContractCall, prepareEvent } from "thirdweb";

export function useVoting() {
  // Get all proposals
  const { data: proposals, isPending: isLoadingProposals } = useReadContract({
    contract: VOTING_CONTRACT,
    method: "getAllProposals",
    params: [],
  });

  // Get voting period
  const { data: votingPeriod, isPending: isLoadingVotingPeriod } =
    useReadContract({
      contract: VOTING_CONTRACT,
      method: "votingPeriod",
      params: [],
    });

  // Get voting delay
  const { data: votingDelay, isPending: isLoadingVotingDelay } =
    useReadContract({
      contract: VOTING_CONTRACT,
      method: "votingDelay",
      params: [],
    });

  // Read functions
  const useProposalState = (proposalId: bigint) => {
    return useReadContract({
      contract: VOTING_CONTRACT,
      method: "state",
      params: [proposalId],
    });
  };

  const useProposalVotes = (proposalId: bigint) => {
    return useReadContract({
      contract: VOTING_CONTRACT,
      method: "proposalVotes",
      params: [proposalId],
    });
  };

  const useHasVoted = (proposalId: bigint, account: string) => {
    return useReadContract({
      contract: VOTING_CONTRACT,
      method: "hasVoted",
      params: [proposalId, account],
    });
  };

  const useVotingPower = (account: string, blockNumber: bigint) => {
    return useReadContract({
      contract: VOTING_CONTRACT,
      method: "getVotes",
      params: [account, blockNumber],
    });
  };

  const useQuorum = (blockNumber: bigint) => {
    return useReadContract({
      contract: VOTING_CONTRACT,
      method: "quorum",
      params: [blockNumber],
    });
  };

  const useProposalThreshold = () => {
    return useReadContract({
      contract: VOTING_CONTRACT,
      method: "proposalThreshold",
    });
  };

  // Write functions
  const useCastVote = (proposalId: bigint, support: number) => {
    const {
      mutate: sendTransaction,
      data,
      isPending,
      error,
    } = useSendTransaction();

    const castVote = () => {
      const transaction = prepareContractCall({
        contract: VOTING_CONTRACT,
        method: "castVote",
        params: [proposalId, support],
      }) as Parameters<typeof sendTransaction>[0];
      return sendTransaction(transaction);
    };

    return {
      castVote,
      data,
      isPending,
      error,
    };
  };

  const useCastVoteWithReason = (
    proposalId: bigint,
    support: number,
    reason: string
  ) => {
    const {
      mutate: sendTransaction,
      data,
      isPending,
      error,
    } = useSendTransaction();

    const castVoteWithReason = () => {
      const transaction = prepareContractCall({
        contract: VOTING_CONTRACT,
        method: "castVoteWithReason",
        params: [proposalId, support, reason],
      }) as Parameters<typeof sendTransaction>[0];
      return sendTransaction(transaction);
    };

    return {
      castVoteWithReason,
      data,
      isPending,
      error,
    };
  };

  const usePropose = () => {
    const {
      mutate: sendTransaction,
      data,
      isPending,
      error,
    } = useSendTransaction();

    const propose = (
      targets: string[],
      values: bigint[],
      calldatas: `0x${string}`[],
      description: string
    ) => {
      const transaction = prepareContractCall({
        contract: VOTING_CONTRACT,
        method: "propose",
        params: [targets, values, calldatas, description],
      }) as Parameters<typeof sendTransaction>[0];
      return sendTransaction(transaction);
    };

    return {
      propose,
      data,
      isPending,
      error,
    };
  };

  const useExecute = () => {
    const {
      mutate: sendTransaction,
      data,
      isPending,
      error,
    } = useSendTransaction();

    const execute = (
      targets: string[],
      values: bigint[],
      calldatas: `0x${string}`[],
      descriptionHash: `0x${string}`
    ) => {
      const transaction = prepareContractCall({
        contract: VOTING_CONTRACT,
        method: "execute",
        params: [targets, values, calldatas, descriptionHash],
      }) as Parameters<typeof sendTransaction>[0];
      return sendTransaction(transaction);
    };

    return {
      execute,
      data,
      isPending,
      error,
    };
  };

  // Admin hooks
  const useSetVotingDelay = () => {
    const {
      mutate: sendTransaction,
      data,
      isPending,
      error,
    } = useSendTransaction();

    const setVotingDelay = (newVotingDelay: bigint) => {
      const transaction = prepareContractCall({
        contract: VOTING_CONTRACT,
        method: "setVotingDelay",
        params: [newVotingDelay],
      }) as Parameters<typeof sendTransaction>[0];
      return sendTransaction(transaction);
    };

    return {
      setVotingDelay,
      data,
      isPending,
      error,
    };
  };

  const useSetVotingPeriod = () => {
    const {
      mutate: sendTransaction,
      data,
      isPending,
      error,
    } = useSendTransaction();

    const setVotingPeriod = (newVotingPeriod: bigint) => {
      const transaction = prepareContractCall({
        contract: VOTING_CONTRACT,
        method: "setVotingPeriod",
        params: [newVotingPeriod],
      }) as Parameters<typeof sendTransaction>[0];
      return sendTransaction(transaction);
    };

    return {
      setVotingPeriod,
      data,
      isPending,
      error,
    };
  };

  const useSetProposalThreshold = () => {
    const {
      mutate: sendTransaction,
      data,
      isPending,
      error,
    } = useSendTransaction();

    const setProposalThreshold = (newProposalThreshold: bigint) => {
      const transaction = prepareContractCall({
        contract: VOTING_CONTRACT,
        method: "setProposalThreshold",
        params: [newProposalThreshold],
      }) as Parameters<typeof sendTransaction>[0];
      return sendTransaction(transaction);
    };

    return {
      setProposalThreshold,
      data,
      isPending,
      error,
    };
  };

  const useUpdateQuorumNumerator = () => {
    const {
      mutate: sendTransaction,
      data,
      isPending,
      error,
    } = useSendTransaction();

    const updateQuorumNumerator = (newQuorumNumerator: bigint) => {
      const transaction = prepareContractCall({
        contract: VOTING_CONTRACT,
        method: "updateQuorumNumerator",
        params: [newQuorumNumerator],
      }) as Parameters<typeof sendTransaction>[0];
      return sendTransaction(transaction);
    };

    return {
      updateQuorumNumerator,
      data,
      isPending,
      error,
    };
  };

  // Event hooks
  const useInitializedEvents = (fromBlock?: bigint, toBlock?: bigint) => {
    const preparedEvent = prepareEvent({
      signature: "event Initialized(uint8 version)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useProposalCanceledEvents = (fromBlock?: bigint, toBlock?: bigint) => {
    const preparedEvent = prepareEvent({
      signature: "event ProposalCanceled(uint256 proposalId)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useProposalCreatedEvents = (fromBlock?: bigint, toBlock?: bigint) => {
    const preparedEvent = prepareEvent({
      signature:
        "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useProposalExecutedEvents = (fromBlock?: bigint, toBlock?: bigint) => {
    const preparedEvent = prepareEvent({
      signature: "event ProposalExecuted(uint256 proposalId)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useProposalThresholdSetEvents = (
    fromBlock?: bigint,
    toBlock?: bigint
  ) => {
    const preparedEvent = prepareEvent({
      signature:
        "event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useQuorumNumeratorUpdatedEvents = (
    fromBlock?: bigint,
    toBlock?: bigint
  ) => {
    const preparedEvent = prepareEvent({
      signature:
        "event QuorumNumeratorUpdated(uint256 oldQuorumNumerator, uint256 newQuorumNumerator)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useVoteCastEvents = (fromBlock?: bigint, toBlock?: bigint) => {
    const preparedEvent = prepareEvent({
      signature:
        "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useVoteCastWithParamsEvents = (
    fromBlock?: bigint,
    toBlock?: bigint
  ) => {
    const preparedEvent = prepareEvent({
      signature:
        "event VoteCastWithParams(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason, bytes params)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useVotingDelaySetEvents = (fromBlock?: bigint, toBlock?: bigint) => {
    const preparedEvent = prepareEvent({
      signature:
        "event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  const useVotingPeriodSetEvents = (fromBlock?: bigint, toBlock?: bigint) => {
    const preparedEvent = prepareEvent({
      signature:
        "event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod)",
    });

    return useContractEvents({
      contract: VOTING_CONTRACT,
      events: [preparedEvent],
    });
  };

  return {
    // Data
    proposals,
    votingPeriod,
    votingDelay,
    // Loading states
    isLoadingProposals,
    isLoadingVotingPeriod,
    isLoadingVotingDelay,
    // Read hooks
    useProposalState,
    useProposalVotes,
    useHasVoted,
    useVotingPower,
    useQuorum,
    useProposalThreshold,
    // Write hooks
    useCastVote,
    useCastVoteWithReason,
    usePropose,
    useExecute,
    // Admin hooks
    useSetVotingDelay,
    useSetVotingPeriod,
    useSetProposalThreshold,
    useUpdateQuorumNumerator,
    // Event hooks
    useProposalCreatedEvents,
    useProposalExecutedEvents,
    useProposalCanceledEvents,
    useVoteCastEvents,
    useVotingDelaySetEvents,
    useVotingPeriodSetEvents,
    useProposalThresholdSetEvents,
    useQuorumNumeratorUpdatedEvents,
    useInitializedEvents,
    useVoteCastWithParamsEvents,
  };
}
