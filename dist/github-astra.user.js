// ==UserScript==
// @name       github-astra
// @namespace  banjoanton
// @version    0.0.4
// @author     banjoanton
// @icon       https://vitejs.dev/logo.svg
// @match      https://github.com/*
// @run-at     document-end
// ==/UserScript==

(function () {
  'use strict';

  const Ee = (e) => e != null;
  const A$1 = (e, r) => (r || document).querySelector(e), ie = (e, r) => r ? !!A$1(e, r) : !!A$1(e), ae = (e, r) => Array.from((r || document).querySelectorAll(e));
  A$1.exists = ie;
  A$1.all = ae;
  const getLogger = (isDebug) => (statement) => {
    if (isDebug) {
      console.log("%cDEBUG SPA-RUNNER: " + statement, "color: blue");
    }
  };
  function matchWithWildcard(string, matcher) {
    const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    return new RegExp(
      "^" + matcher.split("*").map(escapeRegex).join(".*") + "$"
    ).test(string);
  }
  const WAIT_FOR_ELEMENT_TIMEOUT = 200;
  const WAIT_FOR_ELEMENT_MAXIMUM_TRIES = 10;
  const getRunner = (log, handler, config) => () => {
    log("Preparing handler...");
    if (config.waitForElement) {
      log("Waiting for element...");
      let tries = 0;
      const waitForElementInterval = setInterval(() => {
        const element = document.querySelector(config.waitForElement);
        if (!element && tries < WAIT_FOR_ELEMENT_MAXIMUM_TRIES) {
          log("Element not found, trying again...");
          tries++;
        } else if (element) {
          log("Element found...");
          clearInterval(waitForElementInterval);
          log("Running handler...");
          setTimeout(handler, config.timeoutBeforeHandlerInit);
          log("Handler done...");
        } else {
          log("Element not found, giving up...");
          clearInterval(waitForElementInterval);
        }
      }, WAIT_FOR_ELEMENT_TIMEOUT);
      return;
    }
    log("Running handler...");
    setTimeout(handler, config.timeoutBeforeHandlerInit);
    log("Handler done...");
  };
  const defaultConfig = {
    timeBetweenUrlLookup: 500,
    urls: [],
    timeoutBeforeHandlerInit: 0,
    timeoutBeforeRunnerInit: void 0,
    runAtStart: true,
    waitForElement: void 0,
    isDebug: false,
    runIfNotInDom: void 0
  };
  const run = (handler, config = defaultConfig) => {
    config = { ...defaultConfig, ...config };
    const logger = getLogger(config.isDebug ?? false);
    const runner = getRunner(logger, handler, config);
    if (config == null ? void 0 : config.runAtStart) {
      logger("Running at start...");
      runner();
    }
    let lastPath = window.location.pathname;
    let lastSearch = window.location.search;
    const runInterval = setInterval(() => {
      var _a;
      const isNewUrl = lastPath !== window.location.pathname || lastSearch !== window.location.search;
      const hasUrls = config.urls && config.urls.length > 0;
      const matchesUrl = hasUrls ? (_a = config.urls) == null ? void 0 : _a.some(
        (url) => matchWithWildcard(window.location.href, url)
      ) : true;
      if (Ee(config.runIfNotInDom) && !A$1.exists(config.runIfNotInDom)) {
        logger(
          "Could not find element that was supposed to be there, re-rendering..."
        );
        runner();
      }
      if (isNewUrl && matchesUrl) {
        logger("New url found, running handler...");
        lastPath = window.location.pathname;
        lastSearch = window.location.search;
        if (config.timeoutBeforeRunnerInit) {
          setTimeout(runner, config.timeoutBeforeRunnerInit);
        } else {
          runner();
        }
      } else if (isNewUrl) {
        lastPath = window.location.pathname;
        lastSearch = window.location.search;
        logger("New url found, but does not match...");
      }
    }, config.timeBetweenUrlLookup);
    return () => {
      logger("Stopping...");
      clearInterval(runInterval);
    };
  };
  var w$1 = () => typeof window != "undefined";
  new Set("0123456789");
  var b = window.matchMedia("(prefers-color-scheme: dark)").matches, k = () => {
    let e = document.createElement("div");
    return e.classList.add("banjo-modal"), e.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${b ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"};
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        display: none;
    `, e;
  }, C = () => {
    let e = document.createElement("div");
    return e.classList.add("banjo-prompt"), e.style.cssText = `
        background: ${b ? "#2d3748" : "#fff"};
        padding: 20px;
        border-radius: 5px;
        width: 400px;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `, e;
  }, j = (e) => {
    let t = document.createElement("div");
    return t.classList.add("banjo-prompt-header"), t.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `, t.appendChild(document.createTextNode(e)), t;
  }, T = () => {
    let e = document.createElement("div");
    return e.classList.add("banjo-prompt-content"), e.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    `, e;
  }, S = () => {
    let e = document.createElement("div");
    return e.classList.add("banjo-prompt-footer"), e.style.cssText = `
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
    `, e;
  }, A = (e, t) => {
    let o = t === "primary", c = (() => b ? o ? "#007bff" : "#2d3748" : o ? "#007bff" : "#fff")(), l = (() => b ? o ? "#fff" : "#cbd5e0" : o ? "#fff" : "#2d3748")(), n = document.createElement("button");
    return n.classList.add("banjo-prompt-button"), n.style.cssText = `
        background-color: ${c};
        font-weight: bold; 
        color: ${l};
        padding: 0.5rem 1rem; 
        border-radius: 0.25rem;
        border: ${o ? "none" : "1px solid #cbd5e0"};
        cursor: pointer;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);`, n.addEventListener("mouseover", function() {
      b ? n.style.backgroundColor = o ? "#0056b3" : "#2d3748" : n.style.backgroundColor = o ? "#0056b3" : "#f7fafc";
    }), n.addEventListener("mouseout", function() {
      b ? n.style.backgroundColor = o ? "#007bff" : "#2d3748" : n.style.backgroundColor = o ? "#007bff" : "#fff";
    }), n.textContent = e, n;
  }, p = { modal: k, prompt: C, header: j, content: T, footer: S, button: A };
  var x = (e) => {
    let t = p.modal();
    document.body.appendChild(t);
    let o = p.prompt();
    t.appendChild(o);
    let c = p.header(e);
    o.appendChild(c);
    let l = p.content();
    o.appendChild(l);
    let n = p.footer();
    o.appendChild(n);
    let f = p.button("Cancel", "secondary"), m = p.button("OK", "primary");
    return n.appendChild(f), n.appendChild(m), { modal: t, prompt: o, header: c, content: l, footer: n, cancelButton: f, okButton: m };
  };
  function E({ options: e, content: t, markAsDone: o }) {
    var h;
    let c = (h = e.default) != null ? h : "", l = () => "";
    switch (e.type) {
      case "select": {
        y();
        break;
      }
      case "checkbox": {
        m();
        break;
      }
      case "radio": {
        f();
        break;
      }
      default: {
        n();
        break;
      }
    }
    function n() {
      let r = document.createElement("input");
      r.classList.add("banjo-prompt-input"), c && typeof c == "string" && (r.value = c), r.type = e.type, e.placeholder && (r.placeholder = e.placeholder), r.style.cssText = `
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 10px;
                `, r.addEventListener("input", (a) => {
        c = a.target.value;
      }), t.appendChild(r), l = () => {
        o(c);
      }, setTimeout(() => {
        r.focus();
      }, 0);
    }
    function f() {
      var r;
      if (!e.entries)
        throw new Error("entries is required");
      e.entries.forEach((a) => {
        let i = document.createElement("div");
        i.classList.add("banjo-prompt-radio-container"), i.style.cssText = `
                        display: flex;
                        align-items: center;
                        width: 100%;
                        gap: 10px;
                        margin-bottom: 10px;
                    `, t.appendChild(i);
        let s = document.createElement("input");
        s.name = "banjo-prompt-radio", s.classList.add("banjo-prompt-radio"), s.type = "radio", s.value = a.value, s.addEventListener("input", (d) => {
          c = d.target.value;
        }), e.default === a.value && (s.checked = true), i.appendChild(s);
        let u = document.createElement("label");
        u.classList.add("banjo-prompt-label"), u.innerText = a.text, i.appendChild(u);
      }), l = () => {
        o(c);
      }, (r = t.querySelector("input")) == null || r.focus();
    }
    function m() {
      var r;
      if (!e.entries)
        throw new Error("entries is required");
      e.entries.forEach((a) => {
        var d;
        let i = document.createElement("div");
        i.classList.add("banjo-prompt-checkbox-container"), i.style.cssText = `
                        display: inline;
                        align-items: left;
                        justify-content: left;
                        width: 80%;
                        margin: 5px 0;
                    `, t.appendChild(i);
        let s = document.createElement("input");
        s.classList.add("banjo-prompt-checkbox"), s.type = "checkbox", s.value = a.value, s.addEventListener("input", (g) => {
          c = g.target.value;
        }), (e.default === a.value || ((d = e.default) == null ? void 0 : d.includes(a.value))) && (s.checked = true), i.appendChild(s);
        let u = document.createElement("label");
        u.classList.add("banjo-prompt-label"), u.innerText = a.text, i.appendChild(u);
      }), l = () => {
        let a = document.querySelectorAll(".banjo-prompt-checkbox:checked"), i = [];
        a.forEach((s) => {
          i.push(s.value);
        }), o(i);
      }, (r = t.querySelector("input")) == null || r.focus();
    }
    function y() {
      if (!e.entries)
        throw new Error("entries is required");
      let r = document.createElement("select");
      r.classList.add("banjo-prompt-select"), r.style.cssText = `
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 10px;
                    background: #fff;
                `, r.addEventListener("input", (a) => {
        c = a.target.value;
      }), setTimeout(() => {
        r.focus();
      }, 0), l = () => {
        o(c);
      }, t.appendChild(r), e.entries.forEach((a) => {
        let i = document.createElement("option");
        i.classList.add("banjo-prompt-option"), i.value = a.value, i.text = a.text, r.appendChild(i), e.default === a.value && (i.selected = true);
      });
    }
    return { okEvent: l };
  }
  var L = { type: "text", entries: [{ value: "1", text: "One" }, { value: "2", text: "Two" }, { value: "3", text: "Three" }] }, $ = async (e, t = L) => {
    if (!w$1())
      throw new Error("prompt is only available in browser");
    return t = { ...L, ...t }, new Promise((o, c) => {
      var u;
      let l = (u = t.default) != null ? u : void 0, { modal: n, content: f, okButton: m, cancelButton: y } = x(e), h = (d) => {
        n.remove(), o(d);
      }, r = () => h(l), a = () => h(l), i = () => n.style.display = "flex", { okEvent: s } = E({ options: t, content: f, markAsDone: h });
      r = s, n.addEventListener("click", (d) => {
        d.target === n && a();
      }), document.addEventListener("keydown", (d) => {
        let g = n.style.display === "flex";
        d.key === "Escape" && g && a(), d.key === "Enter" && g && r();
      }), m.addEventListener("click", r), y.addEventListener("click", a), i();
    });
  };
  const w = () => "undefined" != typeof window;
  const Y = (e, n) => (n || document).querySelector(e);
  Y.exists = (e, n) => n ? !!Y(e, n) : !!Y(e), Y.all = (e, n) => Array.from((n || document).querySelectorAll(e));
  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"/><path fill="none" d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585L14 21.591z"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2zm5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4l-1.6 1.6z"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14s14-6.3 14-14S23.7 2 16 2zm-1.1 6h2.2v11h-2.2V8zM16 25c-.8 0-1.5-.7-1.5-1.5S15.2 22 16 22s1.5.7 1.5 1.5S16.8 25 16 25z"/></svg>`
  };
  const backgroundColor = {
    success: "#bbf7d0",
    error: "#fecdd3",
    warning: "#fff3cd"
  };
  const color = {
    success: "#0f5132",
    error: "#842029",
    warning: "#664d03"
  };
  const defaultOptions = {
    duration: 5e3,
    type: "success",
    animationTiming: 300,
    fontSize: "1.2rem",
    width: "fit-content",
    useIcon: true
  };
  const toast = (message, options) => {
    if (!w())
      throw new Error("toast can only be used in a browser");
    const { duration, type, animationTiming, fontSize, width, useIcon } = {
      ...defaultOptions,
      ...options
    };
    const toast2 = document.createElement("div");
    toast2.classList.add("banjo-toast");
    toast2.dataset.type = type;
    toast2.dataset.duration = duration.toString();
    toast2.style.cssText = `
        transition: all ${animationTiming}ms ease;
        font-size: ${fontSize};
        width: ${width};
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        height: fit-content;
        transform: translateX(200%);
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        z-index: 9999;
        `;
    toast2.style.backgroundColor = backgroundColor[type];
    toast2.style.color = color[type];
    if (useIcon) {
      const icon = document.createElement("i");
      icon.classList.add("banjo-toast-icon");
      icon.innerHTML = icons[type];
      toast2.appendChild(icon);
    }
    toast2.appendChild(document.createTextNode(message));
    document.body.appendChild(toast2);
    const show = () => {
      toast2.style.transform = "translateX(0%)";
    };
    const hide = (element = toast2, beforeRemove = 5e3) => {
      element.style.transform = "translateX(200%)";
      setTimeout(() => {
        var _a;
        (_a = element.parentNode) == null ? void 0 : _a.removeChild(element);
      }, beforeRemove);
    };
    toast2.addEventListener("click", () => {
      hide();
    });
    if (Y.exists(".banjo-toast")) {
      const oldToasts = Y.all(".banjo-toast");
      oldToasts.forEach((oldToast) => {
        const dur = oldToast.dataset.duration;
        hide(oldToast, Number(dur) + animationTiming);
      });
    }
    setTimeout(show, animationTiming);
    setTimeout(hide, duration);
    return { hide: () => hide() };
  };
  window.addEventListener("load", () => {
    run(main, {
      runAtStart: true,
      urls: ["https://github.com/RDIT-DPS/unify-mono/pull/*"],
      isDebug: false
    });
  });
  function main() {
    var _a;
    const tab = getLastTab();
    if (!tab) {
      console.error("Could not find tab");
      return;
    }
    const cloned = tab.cloneNode(true);
    const cssClasses = cloned.classList;
    cssClasses.remove("selected");
    const newElement = document.createElement("button");
    newElement.classList.value = cssClasses.value;
    newElement.textContent = "💬 Copy to Slack";
    (_a = tab.parentNode) == null ? void 0 : _a.insertBefore(newElement, tab.nextSibling);
    newElement.addEventListener("click", async () => {
      const message = getBranch();
      const repo = getRepo();
      const size = await $("Enter size", {
        type: "text",
        placeholder: "S"
      });
      if (!size)
        return;
      await navigator.clipboard.writeText(formatMessage(message, size, repo));
      toast(`Copied to clipboard in Markdown`, {
        type: "success",
        duration: 2e3
      });
    });
  }
  function getLastTab() {
    const tabs = document.querySelectorAll("nav .tabnav-tab");
    return tabs[tabs.length - 1];
  }
  function getBranch() {
    var _a;
    return ((_a = document.querySelector("#partial-discussion-header > div.gh-header-show > div > h1 > bdi")) == null ? void 0 : _a.textContent) ?? "";
  }
  function getRepo() {
    var _a, _b, _c;
    return ((_c = (_b = (_a = document.querySelectorAll(".AppHeader-context-item-label")) == null ? void 0 : _a[1]) == null ? void 0 : _b.textContent) == null ? void 0 : _c.trim()) ?? "unify-mono";
  }
  function formatMessage(branch, size, repo) {
    return `*${size}*, _${repo}_: [${branch}](${window.location.href})`;
  }

})();
