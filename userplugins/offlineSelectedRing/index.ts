import definePlugin from "@utils/types";
import { Devs } from "@utils/constants";

const MEMBERS_SELECTOR = ".members_c8ffbb";
const MEMBER_SELECTOR = ".member__5d473";
const SELECTED_SELECTOR = ".selected__91a9d";
const FIX_CLASS = "offline-selected-fix";

let observer: MutationObserver | null = null;
let members: Element | null = null;
let updating = false;

function isOfflineMember(member: Element): boolean {
    let node = member.previousElementSibling;

    while (node) {
        if (node.tagName === "H3") {
            return node.textContent?.includes("Offline") ?? false;
        }

        node = node.previousElementSibling;
    }

    return false;
}

function update(): void {
    if (updating || !members)
        return;

    updating = true;

    try {
        const selected = members.querySelector(
            `${MEMBER_SELECTOR}${SELECTED_SELECTOR}`
        );

        const current = members.querySelector(
            `.${FIX_CLASS}`
        );

        // No selected member
        if (!selected) {
            current?.classList.remove(FIX_CLASS);
            return;
        }

        // Selected member is in the Offline group
        if (isOfflineMember(selected)) {
            if (current !== selected) {
                current?.classList.remove(FIX_CLASS);
                selected.classList.add(FIX_CLASS);
            }

            return;
        }

        // Selected member isn't offline
        current?.classList.remove(FIX_CLASS);
    } finally {
        updating = false;
    }
}

function findMemberList(): Element | null {
    return document.querySelector(MEMBERS_SELECTOR);
}

export default definePlugin({
    name: "OfflineSelectedRing",
    description: "Keeps the offline status ring when an offline server member is selected.",
    authors: [Devs.Ven],

    start() {
        members = findMemberList();

        if (!members) {
            console.log(
                "[OfflineSelectedRing] Member list not found."
            );

            return;
        }

        update();

        observer = new MutationObserver(() => {
            update();
        });

        observer.observe(members, {
            subtree: true,
            attributes: true,
            attributeFilter: [
                "class",
                "aria-selected"
            ]
        });

        console.log(
            "[OfflineSelectedRing] Started."
        );
    },

    stop() {
        observer?.disconnect();
        observer = null;

        members
            ?.querySelectorAll(`.${FIX_CLASS}`)
            .forEach(el => {
                el.classList.remove(FIX_CLASS);
            });

        members = null;

        console.log(
            "[OfflineSelectedRing] Stopped."
        );
    }
});
