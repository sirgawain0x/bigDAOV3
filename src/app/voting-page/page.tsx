import { Voting } from "@/components/voting/Voting";

export default function VotePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <header className="flex flex-col items-center justify-center w-full py-4">
        <div className="mx-auto">
          <h1 className="text-3xl mb-5 text-center">Vote</h1>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center w-full">
        <Voting />
      </div>
    </div>
  );
}
