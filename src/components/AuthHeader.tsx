import { BrandLogo } from "./BrandLogo";

const AuthHeader = () => {

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
      </div>
    </header>
  );
};

export default AuthHeader;