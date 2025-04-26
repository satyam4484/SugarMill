'use client'
import { TabsContent } from "@radix-ui/react-tabs"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation" // Change this import

export const DemoPage = () => {
    const router = useRouter()

    const handleLogin = (role: string) => {
        const demoUrl = '/demo'

        switch (role) {
            case "admin":
              router.push(`${demoUrl}/admin/dashboard`)
              break
            case "mill-owner":
              router.push(`${demoUrl}/mill-owner/dashboard`)
              break
            case "contractor":
              router.push(`${demoUrl}/contractor/dashboard`)
              break
            case "supervisor":
              router.push(`${demoUrl}/supervisor/dashboard`)
              break
            case "biometric":
              router.push(`${demoUrl}/biometric`)
              break
            default:
              router.push(`${demoUrl}/admin/dashboard`)
          }
    }
    return (
        <TabsContent value="demo">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleLogin("admin")}>
                    Super Admin Demo
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleLogin("mill-owner")}>
                    Mill Owner Demo
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleLogin("contractor")}>
                    Labour Contractor Demo
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleLogin("supervisor")}>
                    Team Supervisor Demo
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleLogin("biometric")}>
                    Biometric Entry Demo
                  </Button>
                </div>
              </TabsContent>
    )
}