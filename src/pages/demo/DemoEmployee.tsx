import { useLocation } from "react-router-dom";
import EmployeeExperience from "@/components/focus/EmployeeExperience";
import DemoFocusTools from "@/components/demo/DemoFocusTools";
import { useDemoState, demoEmployee, demoActions } from "@/components/demo/focusStore";
import Seo from "@/components/Seo";
import { useFocusText } from "@/i18n/focus";

export default function DemoEmployee() {
  const state = useDemoState();
  const { t, lang } = useFocusText();
  const segment = useLocation().pathname.split("/").filter(Boolean).pop() ?? "";
  const view = ["progress", "ranking", "shop", "tools"].includes(segment) ? segment : "today";
  return <><Seo title={`TeamFokus · ${t("employee")}`} description={t("demoNote")} path="/demo/employee" /><EmployeeExperience data={demoEmployee(state, lang)} actions={demoActions} demo view={view} demoRound={{ unlocks: state.unlocks, settled: state.roundSettled }} focusTools={<DemoFocusTools settings={state.focus} />} /></>;
}
