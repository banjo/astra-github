import { defineConfig } from "hoks";

export default defineConfig({
    installOnLockChange: true,
    staged: {
        "*": ["nr format", "nr lint"],
    },
    syncBeforePush: true,
    enforceConventionalCommits: true,
});
