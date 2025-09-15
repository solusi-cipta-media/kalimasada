// Type Imports
import type { ChildrenType, Direction } from "@core/types";

// Context Imports
import { VerticalNavProvider } from "@menu/contexts/verticalNavContext";
import { SettingsProvider } from "@core/contexts/settingsContext";
import { ProfileProvider } from "@core/contexts/profileContext";
import { TanstackQueryProvider } from "@core/contexts/queryClientContext";
import { LoadingProvider } from "@/@core/contexts/loadingContext";
import ThemeProvider from "@components/theme";

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from "@core/utils/serverHelpers";

type Props = ChildrenType & {
  direction: Direction;
};

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props;

  // Vars
  const mode = getMode();
  const settingsCookie = getSettingsFromCookie();
  const demoName = getDemoName();
  const systemMode = getSystemMode();

  return (
    <TanstackQueryProvider>
      <ProfileProvider>
        <VerticalNavProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              <LoadingProvider>{children}</LoadingProvider>
            </ThemeProvider>
          </SettingsProvider>
        </VerticalNavProvider>
      </ProfileProvider>
    </TanstackQueryProvider>
  );
};

export default Providers;
