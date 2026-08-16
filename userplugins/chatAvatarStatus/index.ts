import definePlugin from "@utils/types";
import { PresenceStore } from "@webpack/common";

const AVATAR_SELECTOR = ".avatar_c19a55";

function getStatus(userId: string): string {
    const status = PresenceStore.getStatus(userId);

    switch (status) {
        case "online":
            return "online";
        case "idle":
            return "idle";
        case "dnd":
            return "dnd";
        case "offline":
        case "invisible":
        default:
            return "offline";
    }
}

function updateAvatar(avatar: HTMLImageElement) {
    const messageItem = avatar.closest(
        ".messageListItem__5126c"
    ) as HTMLElement | null;

    if (!messageItem) return;

    const userId = messageItem.getAttribute("data-author-id");

    if (!userId) return;

    avatar.setAttribute("data-chat-status", getStatus(userId));
}

function updateAll() {
    document
        .querySelectorAll<HTMLImageElement>(AVATAR_SELECTOR)
        .forEach(updateAvatar);
}

export default definePlugin({
    name: "ChatAvatarStatus",

    description:
        "Adds status-colored borders to avatars in chat messages.",

    authors: [],

    start() {
        updateAll();

        const observer = new MutationObserver(() => {
            updateAll();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        (this as any).observer = observer;
    },

    stop() {
        (this as any).observer?.disconnect();

        document
            .querySelectorAll("[data-chat-status]")
            .forEach(element => {
                element.removeAttribute("data-chat-status");
            });
    }
});
