import { useLocation } from "react-router-dom";
import ManagerExperience from "@/components/focus/ManagerExperience";
import { useDemoState, demoManager, demoActions } from "@/components/demo/focusStore";
import Seo from "@/components/Seo";
import { useFocusText } from "@/i18n/focus";

export default function DemoManager() {
  const state = useDemoState();
  const { t } = useFocusText();
  const segment = useLocation().pathname.split("/").filter(Boolean).pop() ?? "";
  const view = ["rewards", "verify"].includes(segment) ? segment : "overview";
  return <><Seo title={`TeamFokus · ${t("manager")}`} description={t("demoNote")} path="/demo/manager" /><ManagerExperience data={demoManager(state)} actions={demoActions} demo view={view} /></>;
}
