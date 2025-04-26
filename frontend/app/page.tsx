"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { DemoPage } from "@/components/layout/DemoPage"
import { CustomerMessages, HTTP_STATUS_CODE } from "@/lib/contants"
import { userAuth } from "@/network/agent"
import { useGlobalContext } from "@/context/AuthContext"
import { AuthConstant, AppRouterConstant } from "@/lib/contants"

export default function Home() {
  const { login } = useGlobalContext();
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    userId: "",
    password: ""
  })



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

 

  useEffect(() => {
    console.log("local storage", localStorage.getItem(AuthConstant.TOKEN_KEY));
    const user = JSON.parse(localStorage.getItem(AuthConstant.USER_DATA) || '{}');
    const token =localStorage.getItem(AuthConstant.TOKEN_KEY);
    if(user && token) {
      login(token,user);
      const pushURl = `${(AppRouterConstant as any)[(user as any).role]}/dashboard`
      router.push(pushURl);
    }
  }, [])
  const handleLogin = async (role: string) => {
    setLoading(true)

    // TODO: Replace this with actual API call
    try {
      // Simulate API call
      const response = await userAuth.loginUser(formData);
      if (response.status === HTTP_STATUS_CODE.OK) {
        const userData = response.data.data;
        console.log("response--data", response.data.data);
        login(userData.token, userData.user);
        const pushURl = `${(AppRouterConstant as any)[userData.user.role]}/dashboard`
        router.push(pushURl);
        toast({
          title: "Login successful",
          description: `Logged in as ${role}.  Wait while redirect you`,
        });

      }
    } catch (error) {
      console.log("error occured while authenticating user----")
      toast({
        title: "Login failed",
        description: (error as any).response.data?.message || 'Please try again',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-t-4 border-t-blue-500">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sugar Mill Management</CardTitle>
            <CardDescription className="text-center">Labour Verification & Contract Management</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="demo">Quick Demo</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                      id="userId"
                      placeholder="Enter your user ID"
                      value={formData.userId}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleLogin("admin")}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Sign In"}
                  </Button>
                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => router.push("/customer/contact")}
                    >
                      {CustomerMessages.CONNECT_WITH_US}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* demo page redirect */}
              <DemoPage />
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center w-full">© 2024 Sugar Mill Management System</div>
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster />
    </div>
  )
}
