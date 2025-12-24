type AvatarProps = {
  size?: number;
};

export const Avatar = ({ size = 32 }: AvatarProps) => {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-200 
                 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
      style={{ width: size, height: size }}
    >
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
      </svg>
    </div>
  );
};
