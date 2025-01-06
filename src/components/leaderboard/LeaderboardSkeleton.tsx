import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Banner Skeleton */}
      <div className="relative w-11/12 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[500px] 2xl:h-[500px] mx-auto">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>

      {/* Table Header Skeleton */}
      <div className="w-11/12 mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" /> {/* Search bar */}
          <Skeleton className="h-8 w-[100px]" /> {/* View selection */}
        </div>

        {/* Table Header */}
        <div className="border rounded-lg">
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50">
            <Skeleton className="h-6 w-[50px]" /> {/* Rank */}
            <Skeleton className="h-6 w-[120px]" /> {/* Address */}
            <Skeleton className="h-6 w-[100px]" /> {/* Points */}
            <Skeleton className="h-6 w-[150px]" /> {/* Identities */}
          </div>

          {/* Table Rows */}
          {[...Array(10)].map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4 border-t">
              <Skeleton className="h-6 w-[30px]" />
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-6 w-[80px]" />
              <Skeleton className="h-6 w-[120px]" />
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-8 w-[100px]" /> {/* Page size selector */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-[80px]" /> {/* Previous button */}
            <Skeleton className="h-8 w-[40px]" /> {/* Page number */}
            <Skeleton className="h-8 w-[80px]" /> {/* Next button */}
          </div>
        </div>
      </div>
    </div>
  );
}
