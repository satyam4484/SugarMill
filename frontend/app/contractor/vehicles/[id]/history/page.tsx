"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import withAuth from "@/hocs/withAuth"
import { vehiclesApi } from "@/network/agent"
import { useToast } from "@/components/ui/use-toast"
import { HTTP_STATUS_CODE } from "@/lib/contants"

function VehicleHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const vehicleId = params.id as string
  const [vehicle, setVehicle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getVehicleDetails = async () => {
      try {
        const response = await vehiclesApi.getVehicleById(vehicleId)
        if (response.status === HTTP_STATUS_CODE.OK) {
          setVehicle(response.data.data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch vehicle details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    getVehicleDetails()
  }, [vehicleId, toast])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  if (!vehicle) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold mb-2">Vehicle Not Found</h1>
          <p className="text-muted-foreground mb-4">The vehicle you are looking for does not exist.</p>
          <Button onClick={() => router.push("/contractor/vehicles")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vehicles
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/contractor/vehicles")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{vehicle.vehicleNumber}</h1>
          <p className="text-muted-foreground">Rental history and details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Basic information about this vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Vehicle Number</dt>
                <dd className="text-sm font-semibold">{vehicle.vehicleNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Vehicle Type</dt>
                <dd className="text-sm font-semibold">{vehicle.vehicleType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Current Status</dt>
                <dd className="text-sm font-semibold">{vehicle.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Added On</dt>
                <dd className="text-sm font-semibold">{new Date(vehicle.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Rental History</CardTitle>
            <CardDescription>Past and current rental records</CardDescription>
          </CardHeader>
          <CardContent>
            {vehicle.currentRental && (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Current Rental</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Mill</p>
                          <p className="font-medium">{vehicle.currentRental.mill.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Rental Rate</p>
                          <p className="font-medium">₹{vehicle.currentRental.rentalRate}/day</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                          <p className="font-medium">
                            {new Date(vehicle.currentRental.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">End Date</p>
                          <p className="font-medium">{new Date(vehicle.currentRental.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Separator className="my-4" />
              </>
            )}

            <h3 className="text-lg font-semibold mb-2">Past Rentals</h3>
            {vehicle.rentalHistory && vehicle.rentalHistory.length > 0 ? (
              <div className="space-y-4">
                {vehicle.rentalHistory.map((rental: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Mill</p>
                          <p className="font-medium">{rental.mill.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Rental Rate</p>
                          <p className="font-medium">₹{rental.rentalRate}/day</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                          <p className="font-medium">{new Date(rental.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">End Date</p>
                          <p className="font-medium">{new Date(rental.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No past rental records found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(VehicleHistoryPage)