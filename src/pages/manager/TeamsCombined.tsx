import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManagerTeams from "@/pages/manager/Teams";
import ManagerMembers from "@/pages/manager/Members";
import ManagerInvites from "@/pages/manager/Invites";
import { useT } from "@/i18n";

export default function ManagerTeamsCombined() {
  const t = useT();
  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">{t("manager.teams.title")}</h1>
      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="teams">{t("manager.teamscombined.tab_teams")}</TabsTrigger>
          <TabsTrigger value="members">{t("manager.teamscombined.tab_members")}</TabsTrigger>
          <TabsTrigger value="invites">{t("manager.teamscombined.tab_invites")}</TabsTrigger>
        </TabsList>
        <TabsContent value="teams"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerTeams /></div></TabsContent>
        <TabsContent value="members"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerMembers /></div></TabsContent>
        <TabsContent value="invites"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerInvites /></div></TabsContent>
      </Tabs>
    </div>
  );
}
