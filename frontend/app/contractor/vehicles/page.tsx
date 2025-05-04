"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarIcon, Plus, Truck } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockVehicles, mockMillOwners, VehicleType, VehicleStatus, type Vehicle } from "@/lib/mock-data"
import withAuth from "@/hocs/withAuth"
import { vehiclesApi, millOwnersApi } from "@/network/agent"
import { HTTP_STATUS_CODE } from "@/lib/contants"

function ContractorVehiclesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [millOwner, setMillOwners] = useState<any>([]);

  const [isLoadingMillOwners, setIsLoadingMillOwners] = useState(false);

  const getMillOwnersHandler = async () => {
    try {
      setIsLoadingMillOwners(true);
      const response = await millOwnersApi.getAllMillOwners();
      if (response.status === HTTP_STATUS_CODE.OK) {
        setMillOwners(response.data);
      }
    } catch (error) {
      toast({
        title: "Failed to fetch mill owners",
        description: "Could not load mill owners. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMillOwners(false);
    }
  };

  useEffect(() => {
    getMillOwnersHandler();
  }, []);


  const [isLoading, setIsLoading] = useState(false);

  const getAllVehiclesHandler = async () => {
    try {
      setIsLoading(true);
      const response = await vehiclesApi.getAllVehicles();
      if (response.status === HTTP_STATUS_CODE.OK) {
        setVehicles(response.data);
      }
    } catch (error) {
      toast({
        title: "Failed to fetch vehicles",
        description: "Could not load your vehicles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllVehiclesHandler();
  }, []);

  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: "",
    vehicleType: VehicleType.TRUCK,
  })

  const [rentalDetails, setRentalDetails] = useState({
    millId: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    rentalRate: 0,
  })

  const handleAddVehicle = async () => {
    if (!newVehicle.vehicleNumber) {
      toast({
        title: "Error",
        description: "Vehicle number is required",
        variant: "destructive",
      })
      return
    }

    const newVehicleObj: any = {
      vehicleNumber: newVehicle.vehicleNumber.toUpperCase(),
      vehicleType: newVehicle.vehicleType,
      status: VehicleStatus.AVAILABLE,
      rentalHistory: [],
    }
    try {
      setIsAddingVehicle(true);
      const createResponse = await vehiclesApi.createVehicle(newVehicleObj);
      if (createResponse.status === HTTP_STATUS_CODE.CREATED) {
        setVehicles([...vehicles, createResponse.data])
        toast({
          title: "Vehicle Added",
          description: `Vehicle ${newVehicleObj.vehicleNumber} has been added successfully.`,
        })
        setIsAddVehicleOpen(false)
        setNewVehicle({
          vehicleNumber: "",
          vehicleType: VehicleType.TRUCK,
        })
      }
    } catch (error) {
      console.log("eriii=---", error)
      toast(({
        title: "Failed to Add Vehicle",
        description: `Vehicle ${newVehicleObj.vehicleNumber} Failed to add.`,
        variant: "destructive"
      }))
    } finally {
      setIsAddingVehicle(false);
    }
  }

  const handleRentVehicle = async () => {
    if (!selectedVehicle) return;

    if (!rentalDetails.millId || rentalDetails.rentalRate <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedMillOwner = millOwner.find((m: any) => m._id === rentalDetails.millId);

    if (!selectedMillOwner) {
      toast({
        title: "Error",
        description: "Selected mill owner not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await vehiclesApi.rentToMill(selectedVehicle._id, {
        millId: rentalDetails.millId,
        startDate: rentalDetails.startDate.toISOString().split("T")[0],
        endDate: rentalDetails.endDate.toISOString().split("T")[0],
        rentalRate: rentalDetails.rentalRate,
      });

      if (response.status === HTTP_STATUS_CODE.OK) {
        const updatedVehicles = vehicles.map((vehicle) => {
          if (vehicle._id === selectedVehicle._id) {
            return {
              ...vehicle,
              status: VehicleStatus.RENTED,
              currentRental: {
                millId: rentalDetails.millId,
                millName: selectedMillOwner.user.name,
                startDate: rentalDetails.startDate.toISOString().split("T")[0],
                endDate: rentalDetails.endDate.toISOString().split("T")[0],
                rentalRate: rentalDetails.rentalRate,
              },
            };
          }
          return vehicle;
        });

        setVehicles(updatedVehicles);
        setIsRentDialogOpen(false);
        setSelectedVehicle(null);

        toast({
          title: "Vehicle Rented",
          description: `Vehicle ${selectedVehicle.vehicleNumber} has been rented to ${selectedMillOwner.user.name}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Rent Vehicle",
        description: `Could not rent vehicle ${selectedVehicle.vehicleNumber}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const [isEndingRental, setIsEndingRental] = useState(false);

  const handleEndRental = async (vehicle: Vehicle) => {
    if (!vehicle.currentRental) return;

    try {
      setIsEndingRental(true);
      const response = await vehiclesApi.endRental(vehicle._id);

      if (response.status === HTTP_STATUS_CODE.OK) {
        const updatedVehicles = vehicles.map((v) => {
          if (v._id === vehicle._id) {
            const rentalHistory = [...(v.rentalHistory || []), v.currentRental!];
            return {
              ...v,
              status: VehicleStatus.AVAILABLE,
              currentRental: undefined,
              rentalHistory,
            };
          }
          return v;
        });

        setVehicles(updatedVehicles as Vehicle[]);

        toast({
          title: "Rental Ended",
          description: `Rental for vehicle ${vehicle.vehicleNumber} has been ended.`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to End Rental",
        description: `Could not end rental for vehicle ${vehicle.vehicleNumber}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsEndingRental(false);
    }
  };


  const handleAssignPermanently = async (vehicle: Vehicle) => {
    try {
      const response = await vehiclesApi.assignPermanently(vehicle._id);

      if (response.status === HTTP_STATUS_CODE.OK) {
        const updatedVehicles = vehicles.map((v) => {
          if (v._id === vehicle._id) {
            return {
              ...v,
              status: VehicleStatus.PERMANENT,
              currentRental: undefined,
            }
          }
          return v
        })

        setVehicles(updatedVehicles)

        toast({
          title: "Vehicle Assigned",
          description: `Vehicle ${vehicle.vehicleNumber} has been assigned permanently.`,
        })
      }
    } catch (error) {
      toast({
        title: "Failed to Assign Vehicle",
        description: `Could not assign vehicle ${vehicle.vehicleNumber} permanently.`,
        variant: "destructive"
      })
    } 
  }

  const getStatusBadgeColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.PERMANENT:
        return "bg-green-100 text-green-800"
      case VehicleStatus.RENTED:
        return "bg-blue-100 text-blue-800"
      case VehicleStatus.AVAILABLE:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVehicleTypeIcon = (type: VehicleType) => {
    switch (type) {
      case VehicleType.TRUCK:
        return <Truck className="h-4 w-4 mr-1" />
      case VehicleType.TRACTOR:
        return <Truck className="h-4 w-4 mr-1" />
      case VehicleType.HARVESTER:
        return <Truck className="h-4 w-4 mr-1" />
      default:
        return <Truck className="h-4 w-4 mr-1" />
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your vehicles and their rental status</p>
        </div>
        <Button onClick={() => setIsAddVehicleOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="permanent">Permanent</TabsTrigger>
          <TabsTrigger value="rented">Rented</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onRent={() => {
                    setSelectedVehicle(vehicle)
                    setIsRentDialogOpen(true)
                  }}
                  onEndRental={() => handleEndRental(vehicle)}
                  onAssignPermanently={() => handleAssignPermanently(vehicle)}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getVehicleTypeIcon={getVehicleTypeIcon}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="permanent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles
              .filter((vehicle) => vehicle.status === VehicleStatus.PERMANENT)
              .map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onRent={() => {
                    setSelectedVehicle(vehicle)
                    setIsRentDialogOpen(true)
                  }}
                  onEndRental={() => handleEndRental(vehicle)}
                  onAssignPermanently={() => handleAssignPermanently(vehicle)}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getVehicleTypeIcon={getVehicleTypeIcon}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rented" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles
              .filter((vehicle) => vehicle.status === VehicleStatus.RENTED)
              .map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onRent={() => {
                    setSelectedVehicle(vehicle)
                    setIsRentDialogOpen(true)
                  }}
                  onEndRental={() => handleEndRental(vehicle)}
                  onAssignPermanently={() => handleAssignPermanently(vehicle)}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getVehicleTypeIcon={getVehicleTypeIcon}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles
              .filter((vehicle) => vehicle.status === VehicleStatus.AVAILABLE)
              .map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onRent={() => {
                    setSelectedVehicle(vehicle)
                    setIsRentDialogOpen(true)
                  }}
                  onEndRental={() => handleEndRental(vehicle)}
                  onAssignPermanently={() => handleAssignPermanently(vehicle)}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getVehicleTypeIcon={getVehicleTypeIcon}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>Enter the details of the new vehicle to add it to your fleet.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicleNumber" className="text-right">
                Vehicle Number
              </Label>
              <Input
                id="vehicleNumber"
                placeholder="MH12AB1234"
                className="col-span-3"
                value={newVehicle.vehicleNumber}
                onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicleType" className="text-right">
                Vehicle Type
              </Label>
              <Select
                value={newVehicle.vehicleType}
                onValueChange={(value) => setNewVehicle({ ...newVehicle, vehicleType: value as VehicleType })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VehicleType.TRUCK}>Truck</SelectItem>
                  <SelectItem value={VehicleType.TRACTOR}>Tractor</SelectItem>
                  <SelectItem value={VehicleType.HARVESTER}>Harvester</SelectItem>
                  <SelectItem value={VehicleType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVehicle} disabled={isAddingVehicle}>
              {isAddingVehicle ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Adding...
                </>
              ) : (
                'Add Vehicle'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rent Vehicle Dialog */}
      <Dialog open={isRentDialogOpen} onOpenChange={setIsRentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rent Vehicle to Mill</DialogTitle>
            <DialogDescription>
              {selectedVehicle && <span>Rent vehicle {selectedVehicle.vehicleNumber} to a sugar mill.</span>}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="millOwner" className="text-right">
                Mill Owner
              </Label>
              <Select
                value={rentalDetails.millId}
                onValueChange={(value) => setRentalDetails({ ...rentalDetails, millId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select mill owner" />
                </SelectTrigger>
                <SelectContent>
                  {millOwner.map((mill: any) => (
                    <SelectItem key={mill._id} value={mill._id}>
                      {mill.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !rentalDetails.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rentalDetails.startDate ? format(rentalDetails.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={rentalDetails.startDate}
                      onSelect={(date) => date && setRentalDetails({ ...rentalDetails, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !rentalDetails.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rentalDetails.endDate ? format(rentalDetails.endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={rentalDetails.endDate}
                      onSelect={(date) => date && setRentalDetails({ ...rentalDetails, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rentalRate" className="text-right">
                Rental Rate (₹/day)
              </Label>
              <Input
                id="rentalRate"
                type="number"
                placeholder="2500"
                className="col-span-3"
                value={rentalDetails.rentalRate || ""}
                onChange={(e) =>
                  setRentalDetails({ ...rentalDetails, rentalRate: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRentVehicle}>Rent Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

interface VehicleCardProps {
  vehicle: Vehicle
  onRent: () => void
  onEndRental: () => void
  onAssignPermanently: () => void
  getStatusBadgeColor: (status: VehicleStatus) => string
  getVehicleTypeIcon: (type: VehicleType) => React.ReactNode
}

function VehicleCard({
  vehicle,
  onRent,
  onEndRental,
  onAssignPermanently,
  getStatusBadgeColor,
  getVehicleTypeIcon,
}: VehicleCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{vehicle.vehicleNumber}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              {getVehicleTypeIcon(vehicle.vehicleType)}
              {vehicle.vehicleType}
            </CardDescription>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(vehicle.status)}`}>
            {vehicle.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {vehicle && vehicle.status === VehicleStatus.RENTED && vehicle.currentRental && (
          <div className="mb-4 space-y-2">
            <div className="text-sm font-medium">Current Rental</div>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mill:</span>
                <span>{(vehicle as any).currentRental?.mill.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period:</span>
                <span>
                  {new Date(vehicle.currentRental.startDate).toLocaleDateString()} -{" "}
                  {new Date(vehicle.currentRental.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate:</span>
                <span>₹{vehicle.currentRental.rentalRate}/day</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Manage Vehicle</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {vehicle.status !== VehicleStatus.RENTED && (
                <DropdownMenuItem onClick={onRent}>Rent to Mill</DropdownMenuItem>
              )}
              {vehicle.status === VehicleStatus.RENTED && (
                <DropdownMenuItem onClick={onEndRental}>End Rental</DropdownMenuItem>
              )}
              {vehicle.status !== VehicleStatus.PERMANENT && (
                <DropdownMenuItem onClick={onAssignPermanently}>Assign Permanently</DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/contractor/vehicles/${vehicle._id}/history`}>View Rental History</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

export default withAuth(ContractorVehiclesPage);
