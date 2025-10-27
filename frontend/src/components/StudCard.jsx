import { CardSpotlight } from "./ui/card-spotlight";

export function CardSpotlightDemo({ profile }) {
  if (!profile) return null;

  return (
    <CardSpotlight className="h-96 w-96 p-6 rounded-4xl">
     

      <div className="text-neutral-200 mt-4 relative z-20 space-y-2">
        <ProfileItem label="Name" value={profile.name} />
        <ProfileItem label="Roll No" value={profile.roll_no} />
        <ProfileItem label="Class" value={profile.class_name} />
        <ProfileItem label="Section" value={profile.section} />
      </div>

      <p className="text-neutral-300 mt-10 relative z-20 text-sm">
        Keep your profile information up to date.
      </p>
    </CardSpotlight>
  );
}

const ProfileItem = ({ label, value }) => (
  <div className="flex gap-2 items-start">
    <CheckIcon />
    <p className="text-white">
      <strong>{label}:</strong> {value}
    </p>
  </div>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4 text-blue-500 mt-1 shrink-0"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path
      d="M5 12l5 5l10 -10"
      fill="currentColor"
      strokeWidth="0"
    />
  </svg>
);
