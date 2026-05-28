type PlatformTrustNoticeProps = {
  className?: string;
  compact?: boolean;
};

export function PlatformTrustNotice({
  className = "",
  compact = false,
}: PlatformTrustNoticeProps) {
  return (
    <div
      className={`rounded-[8px] border border-[#25f4ee]/20 bg-[#25f4ee]/[0.07] p-4 text-sm leading-6 text-white/70 ${className}`}
    >
      <p className="font-semibold text-white">Independent service notice</p>
      <p className={compact ? "mt-1" : "mt-2"}>
        New People is an independent analytics and operations workspace. It is
        not TikTok, YouTube, Google, Instagram, Meta, or an official page of
        those companies.
      </p>
      {!compact && (
        <p className="mt-2">
          New People never asks for social media passwords, payment card
          numbers, or banking details. TikTok and YouTube authorization happens
          only on the official platform OAuth screens.
        </p>
      )}
    </div>
  );
}
