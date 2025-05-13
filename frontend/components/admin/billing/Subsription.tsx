import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    CreditCard,
    Download,
    FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { mockMillOwners } from "@/lib/mock-data"

export default function Subscription( ) {
    
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };
    

    return (
        <TabsContent value="subscriptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>Manage mill owner subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mill Owner</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMillOwners.map((owner) => (
                        <TableRow key={owner.id}>
                          <TableCell>
                            <div className="font-medium">{owner.name}</div>
                            <div className="text-sm text-muted-foreground">{owner.email}</div>
                          </TableCell>
                          <TableCell>
                            {owner.id === "1" || owner.id === "2"
                              ? "Premium"
                              : owner.id === "3"
                                ? "Standard"
                                : owner.id === "4"
                                  ? "Enterprise"
                                  : "Basic"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                owner.subscriptionStatus === "active"
                                  ? "default"
                                  : owner.subscriptionStatus === "pending"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {owner.subscriptionStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(
                              new Date(
                                new Date(owner.subscriptionExpiry).getTime() - 365 * 24 * 60 * 60 * 1000,
                              ).toString(),
                            )}
                          </TableCell>
                          <TableCell>{formatDate(owner.subscriptionExpiry)}</TableCell>
                          <TableCell>
                            {formatCurrency(
                              owner.id === "1" || owner.id === "2"
                                ? 75000
                                : owner.id === "3"
                                  ? 50000
                                  : owner.id === "4"
                                    ? 100000
                                    : 25000,
                            )}
                            /year
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Renew
                              </Button>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
    )
}