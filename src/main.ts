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
    const tab = getLastTab();

    if (!tab) {
        console.error("Could not find tab");
        return;
    }

    const cloned = tab.cloneNode(true) as HTMLAnchorElement;
    const cssClasses = cloned.classList;

    cssClasses.remove("selected");

    const newElement = document.createElement("button");
    newElement.classList.value = cssClasses.value;
    newElement.textContent = "💬 Copy to Slack";

    tab.parentNode?.insertBefore(newElement, tab.nextSibling);

    newElement.addEventListener("click", async () => {
        const message = getBranch();
        const repo = getRepo();
        const size = await promptler("Enter size", {
            type: "text",
            placeholder: "S",
        });

        if (!size) return;

        await navigator.clipboard.writeText(formatMessage(message, size, repo));
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
    return (
        document.querySelector("#partial-discussion-header > div.gh-header-show > div > h1 > bdi")
            ?.textContent ?? ""
    );
}

function getRepo() {
    return (
        document.querySelectorAll(".AppHeader-context-item-label")?.[1]?.textContent ?? "unify-mono"
    );
}

function formatMessage(branch: string, size: string, repo: string): string {
    return `*${size}*,_${repo}_: [${branch}](${window.location.href})`;
}
