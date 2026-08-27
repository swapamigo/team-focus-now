import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManagerSettings from "@/pages/manager/Settings";
import ManagerRules from "@/pages/manager/Rules";
import { useT } from "@/i18n";

export default function ManagerSettingsCombined() {
  const t = useT();
  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">{t("manager.settings.title")}</h1>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account">{t("manager.settingscombined.tab_account")}</TabsTrigger>
          <TabsTrigger value="rules">{t("manager.settingscombined.tab_rules")}</TabsTrigger>
        </TabsList>
        <TabsContent value="account"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerSettings /></div></TabsContent>
        <TabsContent value="rules"><div className="-mx-5 md:-mx-8 -mt-2"><ManagerRules /></div></TabsContent>
      </Tabs>
    </div>
  );
}
