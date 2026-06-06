import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManagerTeams from "@/pages/manager/Teams";
import ManagerMembers from "@/pages/manager/Members";
import ManagerInvites from "@/pages/manager/Invites";

export default function ManagerTeamsCombined() {
  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Teams</h1>
      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">Personen</TabsTrigger>
          <TabsTrigger value="invites">Einladungen</TabsTrigger>
        </TabsList>
        <TabsContent value="teams"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerTeams /></div></TabsContent>
        <TabsContent value="members"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerMembers /></div></TabsContent>
        <TabsContent value="invites"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerInvites /></div></TabsContent>
      </Tabs>
    </div>
  );
}
