import definePlugin from "@utils/types";

const MESSAGE_SELECTOR = ".messageListItem__5126c";
const GROUP_START_SELECTOR = ".groupStart__5126c";

function updateMessageGroups() {
    const msgs = [
        ...document.querySelectorAll<HTMLElement>(MESSAGE_SELECTOR)
    ];

    msgs.forEach((x, i) => {
        // Remove our old classifications first
        x.classList.remove(
            "lg-first",
            "lg-middle",
            "lg-last",
            "lg-continuation"
        );

        const start = !!x.querySelector(GROUP_START_SELECTOR);
        const next = msgs[i + 1];
        const nextStart = !!next?.querySelector(GROUP_START_SELECTOR);

        if (start && !nextStart && next) {
            // First message of a consecutive group
            x.classList.add("lg-first");
        }
        else if (!start && next && !nextStart) {
            // Middle message of a consecutive group
            x.classList.add("lg-middle", "lg-continuation");
        }
        else if (!start && (!next || nextStart)) {
            // Last message of a consecutive group
            x.classList.add("lg-last", "lg-continuation");
        }
    });
}

export default definePlugin({
    name: "LiquidGlassMessages",

    description:
        "Adds persistent classes to Discord message groups for Liquid Glass styling.",

    authors: [],

    start() {
        updateMessageGroups();

        let updateQueued = false;

        const observer = new MutationObserver(() => {
            if (updateQueued) return;

            updateQueued = true;

            requestAnimationFrame(() => {
                updateQueued = false;
                updateMessageGroups();
            });
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
            .querySelectorAll<HTMLElement>(MESSAGE_SELECTOR)
            .forEach(message => {
                message.classList.remove(
                    "lg-first",
                    "lg-middle",
                    "lg-last",
                    "lg-continuation"
                );
            });
    }
});
