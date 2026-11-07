import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  title: string;
  intro: string;
  tone?: "light" | "dark";
};

export function SectionHeading({ id, title, intro, tone = "light" }: Props) {
  return (
    <div className="mb-[clamp(48px,6vw,88px)] grid grid-cols-12 items-end gap-y-7 wide:gap-x-7">
      <h2 id={id} className="col-span-full wide:col-span-7">
        {title}
      </h2>
      <p
        className={cn(
          "col-span-full max-w-[38ch] wide:col-span-4 wide:col-start-9",
          tone === "dark" ? "text-on-dark-muted" : "text-ink-muted",
        )}
      >
        {intro}
      </p>
    </div>
  );
}
