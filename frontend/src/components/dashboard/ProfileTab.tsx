import { Clock, ImagePlus, Mail, MapPin, Phone } from "lucide-react";
import type { StoreProfile } from "./types";
import { IconInput } from "./IconInput";
import { LabeledInput } from "./LabeledInput";

interface ProfileTabProps {
    draft: StoreProfile;
    setDraft: (p: StoreProfile) => void;
    onSave: () => void;
    saved: boolean;
}

export function ProfileTab({ draft, setDraft, onSave, saved }: ProfileTabProps) {
    const field = (key: keyof StoreProfile, value: string) =>
        setDraft({ ...draft, [key]: value });

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Store profile
            </h1>
            <p className="mt-1.5 text-sm text-[#5B6472]">
                This is what shoppers see when they find your store.
            </p>

            <div className="mt-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-[#D7DCE3] bg-[#F7F8FA] text-[#9CA3AF]">
                    <ImagePlus size={20} />
                </div>
                <button className="rounded-lg border border-[#D7DCE3] px-3 py-2 text-xs font-medium text-[#5B6472] hover:bg-[#F7F8FA]">
                    Upload logo
                </button>
            </div>

            <div className="mt-6 space-y-4">
                <LabeledInput label="Store name" value={draft.name} onChange={(v) => field("name", v)} />
                <LabeledInput label="Category" value={draft.category} onChange={(v) => field("category", v)} />
                <div>
                    <label className="text-xs font-medium text-[#5B6472]">Description</label>
                    <textarea
                        value={draft.description}
                        onChange={(e) => field("description", e.target.value)}
                        rows={3}
                        className="mt-1.5 w-full resize-none rounded-lg border border-[#D7DCE3] px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                    />
                </div>
                <IconInput icon={<MapPin size={16} />} label="Address" value={draft.address} onChange={(v) => field("address", v)} />
                <IconInput icon={<Phone size={16} />} label="Phone" value={draft.phone} onChange={(v) => field("phone", v)} />
                <IconInput icon={<Mail size={16} />} label="Email" value={draft.email} onChange={(v) => field("email", v)} />
                <IconInput icon={<Clock size={16} />} label="Hours" value={draft.hours} onChange={(v) => field("hours", v)} />
            </div>

            <div className="mt-8 flex items-center gap-3">
                <button onClick={onSave} className="rounded-lg bg-[#E2542D] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c4471f]">
                    Save changes
                </button>
                {saved && <span className="text-sm text-[#5B6472]">Saved.</span>}
            </div>
        </div>
    );
}