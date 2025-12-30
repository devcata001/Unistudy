import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MaterialsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-10 w-[150px]" />
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-[120px]" />
            </div>

            {/* Materials List */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-16 w-16 rounded" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-[80px] rounded-full" />
                                        <Skeleton className="h-6 w-[100px] rounded-full" />
                                    </div>
                                </div>
                                <Skeleton className="h-9 w-[100px]" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
