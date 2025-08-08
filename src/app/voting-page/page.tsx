import { Voting } from "@/components/voting/Voting";

export default function VotePage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start p-4 overflow-x-hidden">
      <header className="flex flex-col items-center justify-center w-full py-4 sm:py-6 lg:py-8">
        <div className="mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center">
            Vote
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-medium text-center">
            Make your voice heard.
          </p>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center w-full max-w-4xl">
        <Voting />
      </div>
    </div>
  );
}
