// Component Imports
import Providers from "@components/Providers";
import BlankLayout from "@layouts/BlankLayout";

// Util Imports
import { getServerMode, getSystemMode } from "@core/utils/serverHelpers";
import Forbidden from "@/views/Forbidden";

const ForbiddenPage = () => {
  // Vars
  const direction = "ltr";
  const mode = getServerMode();
  const systemMode = getSystemMode();

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <Forbidden mode={mode} />
      </BlankLayout>
    </Providers>
  );
};

export default ForbiddenPage;
