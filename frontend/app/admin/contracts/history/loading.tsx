import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <div>
          <Skeleton className="h-8 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-5 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-full" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
