import { BrandLogo } from "./BrandLogo";
import { MainMenu } from "./MainMenu";
import { UserMenu } from "./UserMenu";

const MainHeader = () => {

  return (
    <header
      className="
        flex justify-between items-center
        px-6 py-3
        bg-white dark:bg-gray-950
        border-b border-gray-200 dark:border-gray-800
      "
    >
      {/* Left */}
      <div className="flex items-center gap-6">
        <BrandLogo name="IPMS" size="md" />
        <MainMenu />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <UserMenu />
      </div>
    </header>
  );
};

export default MainHeader;