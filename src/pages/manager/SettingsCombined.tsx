import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManagerSettings from "@/pages/manager/Settings";
import ManagerRules from "@/pages/manager/Rules";

export default function ManagerSettingsCombined() {
  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Einstellungen</h1>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Konto</TabsTrigger>
          <TabsTrigger value="rules">Regeln & Whitelist</TabsTrigger>
        </TabsList>
        <TabsContent value="account"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerSettings /></div></TabsContent>
        <TabsContent value="rules"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerRules /></div></TabsContent>
      </Tabs>
    </div>
  );
}
