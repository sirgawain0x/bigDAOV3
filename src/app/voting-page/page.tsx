import { Voting } from "@/components/voting/Voting";

export default function VotePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-6xl mb-5">The Board Voting</h1>
      <div className="flex flex-col items-center justify-center w-full">
        <Voting />
      </div>
    </div>
  );
}
