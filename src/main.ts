import { run } from "@banjoanton/spa-runner";
import { promptler } from "promptler";
import { toast } from "toastler";

window.addEventListener("load", () => {
    run(main, {
        runAtStart: true,
        urls: ["https://github.com/RDIT-DPS/unify-mono/pull/*"],
        isDebug: false,
    });
});

function main() {
    console.log("🪕%c Banjo | main.ts:12 |", "color: #E91E63", "started");
    const tab = getLastTab();

    if (!tab) {
        console.error("Could not find tab");
        return;
    }

    const cloned = tab.cloneNode(true) as HTMLAnchorElement;
    const cssClasses = cloned.classList;

    cssClasses.remove("selected");

    const newElement = document.createElement("div");
    newElement.classList.value = cssClasses.value;
    newElement.textContent = "💬 Copy to Slack";
    newElement.style.cursor = "pointer";

    tab.parentNode?.insertBefore(newElement, tab.nextSibling);

    newElement.addEventListener("click", async () => {
        const message = getBranch();
        const size = await promptler("Enter size", {
            type: "text",
            placeholder: "S",
        });

        if (!size) return;

        await navigator.clipboard.writeText(formatMessage(message, size));
        toast(`Copied to clipboard in Markdown`, {
            type: "success",
            duration: 2000,
        });
    });
}

function getLastTab() {
    const tabs = document.querySelectorAll("nav .tabnav-tab");
    return tabs[tabs.length - 1];
}

function getBranch() {
    const name =
        document.querySelector("#partial-discussion-header > div.gh-header-show > div > h1 > bdi")
            ?.textContent ?? "";

    return name;
}

function formatMessage(branch: string, size: string): string {
    return `*${size}*, _csp-mono_: [${branch}](${window.location.href})`;
}
