// ==UserScript==
// @name       github-astra
// @namespace  banjoanton
// @version    0.0.1
// @author     banjoanton
// @icon       https://vitejs.dev/logo.svg
// @match      https://github.com/*
// @run-at     document-end
// ==/UserScript==

(function () {
  'use strict';

  const Ee = (e) => e != null;
  const A = (e, r) => (r || document).querySelector(e), ie = (e, r) => r ? !!A(e, r) : !!A(e), ae = (e, r) => Array.from((r || document).querySelectorAll(e));
  A.exists = ie;
  A.all = ae;
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
      if (Ee(config.runIfNotInDom) && !A.exists(config.runIfNotInDom)) {
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
  var y = () => typeof window != "undefined";
  new Set("0123456789");
  var L = () => {
    let e = document.createElement("div");
    return e.classList.add("banjo-modal"), e.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        display: none;
    `, e;
  }, k = () => {
    let e = document.createElement("div");
    return e.classList.add("banjo-prompt"), e.style.cssText = `
        background: #fff;
        padding: 20px;
        border-radius: 5px;
        width: 400px;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `, e;
  }, C = (e) => {
    let t = document.createElement("div");
    return t.classList.add("banjo-prompt-header"), t.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `, t.appendChild(document.createTextNode(e)), t;
  }, j = () => {
    let e = document.createElement("div");
    return e.classList.add("banjo-prompt-content"), e.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    `, e;
  }, T = () => {
    let e = document.createElement("div");
    return e.classList.add("banjo-prompt-footer"), e.style.cssText = `
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
    `, e;
  }, S = (e, t) => {
    let i = t === "primary", r = document.createElement("button");
    return r.classList.add("banjo-prompt-button"), r.style.cssText = `
        background-color: ${i ? "#007bff" : "#fff"}; 
        font-weight: bold; 
        color: ${i ? "#fff" : "#2d3748"}; 
        padding: 0.5rem 1rem; 
        border-radius: 0.25rem;
        border: ${i ? "none" : "1px solid #cbd5e0"};
        cursor: pointer;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);`, r.addEventListener("mouseover", function() {
      r.style.backgroundColor = i ? "#0056b3" : "#f7fafc";
    }), r.addEventListener("mouseout", function() {
      r.style.backgroundColor = i ? "#007bff" : "#fff";
    }), r.textContent = e, r;
  }, p = { modal: L, prompt: k, header: C, content: j, footer: T, button: S };
  var w$1 = (e) => {
    let t = p.modal();
    document.body.appendChild(t);
    let i = p.prompt();
    t.appendChild(i);
    let r = p.header(e);
    i.appendChild(r);
    let l = p.content();
    i.appendChild(l);
    let c = p.footer();
    i.appendChild(c);
    let f = p.button("Cancel", "secondary"), m = p.button("OK", "primary");
    return c.appendChild(f), c.appendChild(m), { modal: t, prompt: i, header: r, content: l, footer: c, cancelButton: f, okButton: m };
  };
  function x({ options: e, content: t, markAsDone: i }) {
    var h;
    let r = (h = e.default) != null ? h : "", l = () => "";
    switch (e.type) {
      case "select": {
        v();
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
        c();
        break;
      }
    }
    function c() {
      let n = document.createElement("input");
      n.classList.add("banjo-prompt-input"), r && typeof r == "string" && (n.value = r), n.type = e.type, e.placeholder && (n.placeholder = e.placeholder), n.style.cssText = `
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 10px;
                `, n.addEventListener("input", (o) => {
        r = o.target.value;
      }), t.appendChild(n), l = () => {
        i(r);
      }, setTimeout(() => {
        n.focus();
      }, 0);
    }
    function f() {
      var n;
      if (!e.entries)
        throw new Error("entries is required");
      e.entries.forEach((o) => {
        let a = document.createElement("div");
        a.classList.add("banjo-prompt-radio-container"), a.style.cssText = `
                        display: flex;
                        align-items: center;
                        width: 100%;
                        gap: 10px;
                        margin-bottom: 10px;
                    `, t.appendChild(a);
        let s = document.createElement("input");
        s.name = "banjo-prompt-radio", s.classList.add("banjo-prompt-radio"), s.type = "radio", s.value = o.value, s.addEventListener("input", (d) => {
          r = d.target.value;
        }), e.default === o.value && (s.checked = true), a.appendChild(s);
        let u = document.createElement("label");
        u.classList.add("banjo-prompt-label"), u.innerText = o.text, a.appendChild(u);
      }), l = () => {
        i(r);
      }, (n = t.querySelector("input")) == null || n.focus();
    }
    function m() {
      var n;
      if (!e.entries)
        throw new Error("entries is required");
      e.entries.forEach((o) => {
        var d;
        let a = document.createElement("div");
        a.classList.add("banjo-prompt-checkbox-container"), a.style.cssText = `
                        display: inline;
                        align-items: left;
                        justify-content: left;
                        width: 80%;
                        margin: 5px 0;
                    `, t.appendChild(a);
        let s = document.createElement("input");
        s.classList.add("banjo-prompt-checkbox"), s.type = "checkbox", s.value = o.value, s.addEventListener("input", (g) => {
          r = g.target.value;
        }), (e.default === o.value || ((d = e.default) == null ? void 0 : d.includes(o.value))) && (s.checked = true), a.appendChild(s);
        let u = document.createElement("label");
        u.classList.add("banjo-prompt-label"), u.innerText = o.text, a.appendChild(u);
      }), l = () => {
        let o = document.querySelectorAll(".banjo-prompt-checkbox:checked"), a = [];
        o.forEach((s) => {
          a.push(s.value);
        }), i(a);
      }, (n = t.querySelector("input")) == null || n.focus();
    }
    function v() {
      if (!e.entries)
        throw new Error("entries is required");
      let n = document.createElement("select");
      n.classList.add("banjo-prompt-select"), n.style.cssText = `
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 10px;
                    background: #fff;
                `, n.addEventListener("input", (o) => {
        r = o.target.value;
      }), setTimeout(() => {
        n.focus();
      }, 0), l = () => {
        i(r);
      }, t.appendChild(n), e.entries.forEach((o) => {
        let a = document.createElement("option");
        a.classList.add("banjo-prompt-option"), a.value = o.value, a.text = o.text, n.appendChild(a), e.default === o.value && (a.selected = true);
      });
    }
    return { okEvent: l };
  }
  var E = { type: "text", entries: [{ value: "1", text: "One" }, { value: "2", text: "Two" }, { value: "3", text: "Three" }] }, q = async (e, t = E) => {
    if (!y())
      throw new Error("prompt is only available in browser");
    return t = { ...E, ...t }, new Promise((i, r) => {
      var u;
      let l = (u = t.default) != null ? u : void 0, { modal: c, content: f, okButton: m, cancelButton: v } = w$1(e), h = (d) => {
        c.remove(), i(d);
      }, n = () => h(l), o = () => h(l), a = () => c.style.display = "flex", { okEvent: s } = x({ options: t, content: f, markAsDone: h });
      n = s, c.addEventListener("click", (d) => {
        d.target === c && o();
      }), document.addEventListener("keydown", (d) => {
        let g = c.style.display === "flex";
        d.key === "Escape" && g && o(), d.key === "Enter" && g && n();
      }), m.addEventListener("click", n), v.addEventListener("click", o), a();
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
    const newElement = document.createElement("div");
    newElement.classList.value = cssClasses.value;
    newElement.textContent = "💬 Copy to Slack";
    newElement.style.cursor = "pointer";
    (_a = tab.parentNode) == null ? void 0 : _a.insertBefore(newElement, tab.nextSibling);
    newElement.addEventListener("click", async () => {
      const message = getBranch();
      const size = await q("Enter size", {
        type: "text",
        placeholder: "S"
      });
      if (!size)
        return;
      await navigator.clipboard.writeText(formatMessage(message, size));
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
    const name = ((_a = document.querySelector("#partial-discussion-header > div.gh-header-show > div > h1 > bdi")) == null ? void 0 : _a.textContent) ?? "";
    return name;
  }
  function formatMessage(branch, size) {
    return `*${size}*, _csp-mono_: [${branch}](${window.location.href})`;
  }

})();
