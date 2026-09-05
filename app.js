(function () {
  "use strict";

  /* =========================================================================
     COLORADO STATE ROLEPLAY — STAFF APPLICATION FORM
     -------------------------------------------------------------------------
     HOW TO EDIT THE FORM (no coding knowledge needed):
     Edit the `sections` array in FORM_CONFIG below. Each section is a
     Google-Forms-style page: a colored band with the section title + a
     description + its questions. The form shows ONE section at a time with
     Back / Next buttons (Submit on the last page).

     Question types (type):
       "text"             short answer (single line)
       "paragraph"        long answer (multi-line)
       "multiple_choice"  radio buttons (pick ONE)
       "checkboxes"       checkboxes (pick MULTIPLE)
       "dropdown"         drop-down list
       "linear_scale"     rating row from 1..N
       "country"          type-ahead country picker (flag + timezone)

     Question fields:
       id                unique string, e.g. "q1"  (do not repeat ids)
       type              one of the types above
       title             the question text
       description       optional helper text under the title
       required          true / false
       placeholder       optional, for "text" / "paragraph" / "country"
       inputType         optional, for "text": text, email, number, tel, url, date
       min / max         optional, for number inputs
       options           for multiple_choice / checkboxes / dropdown
       scaleMax          for linear_scale
       scaleLabels       optional for linear_scale, e.g. ["Poor","Excellent"]
       identityProvider  optional: "discord" | "roblox" — when the identity
                         fields are filled we look the user up and show
                         "Is this the correct user?" (Yes/No) before continuing.

     Identity lookups are configured in FORM_CONFIG.identities below:
       fields = question ids that must be filled before looking up
       host   = the question whose card shows the confirmation block

     Country data (flag + timezone for ~250 places) is served by the backend
     at /api/countries. All API calls (/api/*) are handled by server.py.
     ========================================================================= */

  var RP_TERMS = ["RDM", "VDM", "FRP", "NITRP", "metagaming", "powergaming",
                  "NLR", "combat logging", "LTAP", "SZRDM"];
  var RP_DESC = "Explain it with at least 2+ sentences with an example, and then tell what's the punishment for it.";

  var FORM_CONFIG = {
    title: "Colorado State Roleplay Staff Application Form",
    description: "Thank you for your interest in joining the Colorado State Roleplay staff team. Please complete the application below. Your answers are saved automatically on this device, so you can close this page and come back anytime.",
    logo: "assets/logo2.png",
    storageKey: "colorado-rp:staff-application:draft",
    submittedKey: "colorado-rp:staff-application:submitted",

    identities: {
      discord: { label: "Discord", fields: ["q1", "q2"], host: "q2" },
      roblox:  { label: "Roblox",  fields: ["q3"],      host: "q3" }
    },

    sections: [
      {
        id: "s1",
        title: "Personal Information",
        description: "This section is to contact you if you passed or didn't pass the application.",
        questions: [
          {
            id: "q1", type: "text", inputType: "text", identityProvider: "discord",
            title: "What's your discord username?", required: true,
            placeholder: "e.g. colorado_rp_user"
          },
          {
            id: "q2", type: "text", inputType: "text", identityProvider: "discord",
            title: "What's your discord user ID?", required: true,
            placeholder: "e.g. 123456789012345678",
            description: "Discord Settings → Advanced → Developer Mode, then right-click your profile and copy your User ID."
          },
          {
            id: "q3", type: "text", inputType: "text", identityProvider: "roblox",
            title: "What's your Roblox username?", required: true,
            placeholder: "e.g. Builderman"
          },
          {
            id: "q4", type: "text", inputType: "number", min: 13, max: 99,
            title: "What's your age?", required: true,
            placeholder: "e.g. 18"
          },
          {
            id: "q5", type: "country",
            title: "Which country are you in?", required: true
          },
          {
            id: "q6", type: "paragraph",
            title: "Do you have any past moderation experience? If yes, what server and rank was them?",
            required: false,
            placeholder: "Your answer"
          },
          {
            id: "q7", type: "multiple_choice",
            title: "How active are you?", required: true,
            options: ["1 hour a day", "2 hours a day", "3 hours a day", "4+ hours a day"]
          }
        ]
      },
      {
        id: "s2",
        title: "General Questions & Knowledge",
        description: "",
        questions: [
          {
            id: "gk1", type: "paragraph",
            title: "Why do you want to join the Colorado State Roleplay staff community?",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "gk2", type: "paragraph",
            title: "What's your difference between other applicants and why should we pick you?",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "gk3", type: "paragraph",
            title: "In your opinion, what is the main task of being a staff?",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "gk4", type: "paragraph",
            title: "Do you trust yourself and why?",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "gk5", type: "multiple_choice",
            title: "Are you dedicated to work 4 hours a week in-game?",
            required: true,
            options: ["Yes", "No"]
          }
        ]
      },
      {
        id: "s3",
        title: "RP Terms",
        description: "This section is to determine your information about roleplay terms.",
        questions: RP_TERMS.map(function (term, i) {
          return {
            id: "rp" + (i + 1),
            type: "paragraph",
            title: "What does " + term + " mean?",
            description: RP_DESC,
            required: true,
            placeholder: "Your answer"
          };
        })
      },
      {
        id: "s4",
        title: "Custom Scenarios",
        description: "",
        questions: [
          {
            id: "cs1", type: "paragraph",
            title: "You are patrolling and someone is going from the wrong lane of the road with 140 MPH, what would you do?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "cs2", type: "paragraph",
            title: "Someone called mod and they're saying that someone RDM'ed them, they don't have a clip but they're demanding you to check kill logs. What would you do?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "cs3", type: "paragraph",
            title: "You are patrolling in spawn, and someone just killed another person in front of you. What would you do?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "cs4", type: "paragraph",
            title: "Someone is roleplaying as a K-9 dog, and someone else called mod and said that is unrealistic, but the other person said it's realistic, I'm just roleplaying as a K-9 dog. What would you do?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "cs5", type: "paragraph",
            title: "You're checking the roleplay requests channel and someone requested permission for Suicide RP, what would you do, deny it or accept it, and why?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "cs6", type: "paragraph",
            title: "You were going to punish someone for VDM, and then they just left the game. What would you do?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "cs7", type: "paragraph",
            title: "Someone did a serious crash with their car, then they just got back in their car and acted like nothing happened. What would you do?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "cs8", type: "paragraph",
            title: "Someone was roleplaying normally and shooting the police in the RP, and when you were walking behind the cops, they killed you and they said they thought you were one of them. What would you do?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          },
          {
            id: "cs9", type: "paragraph",
            title: "Someone is doing a hostage RP, but they didn't request permissions for it in the roleplay-requests channel. What would you do?",
            description: "Answer in detail.",
            required: true,
            placeholder: "Your answer"
          }
        ]
      }
    ]
  };
  /* ========================================================================= */

  var QUESTIONS = [];

  function flattenQuestions() {
    QUESTIONS = [];
    FORM_CONFIG.sections.forEach(function (sec) {
      (sec.questions || []).forEach(function (q) { QUESTIONS.push(q); });
    });
  }

  function $(sel) { return document.querySelector(sel); }

  /* ---------- Safe storage wrapper ---------- */
  var storage = (function () {
    var ok = false;
    try {
      localStorage.setItem("__probe__", "1");
      localStorage.removeItem("__probe__");
      ok = true;
    } catch (e) { ok = false; }
    return {
      available: ok,
      get: function (key, fallback) {
        try {
          var raw = localStorage.getItem(key);
          return raw === null ? fallback : JSON.parse(raw);
        } catch (e) { return fallback; }
      },
      set: function (key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch (e) { return false; }
      },
      remove: function (key) {
        try { localStorage.removeItem(key); } catch (e) {}
      }
    };
  })();

  var state = { draft: storage.get(FORM_CONFIG.storageKey, {}), currentSection: 0, countries: [] };
  var identityTimers = {};

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function findQuestion(qid) {
    for (var i = 0; i < QUESTIONS.length; i++) {
      if (QUESTIONS[i].id === qid) return QUESTIONS[i];
    }
    return null;
  }

  function getCard(qid) {
    return document.querySelector('[data-qid="' + qid + '"]');
  }

  function isIdentityHost(q) {
    var idc = q.identityProvider && FORM_CONFIG.identities[q.identityProvider];
    return !!(idc && idc.host === q.id);
  }

  /* ---------- Identity (Discord / Roblox) ---------- */
  function idFieldValues(provider) {
    return FORM_CONFIG.identities[provider].fields.map(function (f) {
      var q = findQuestion(f);
      return q ? String(getValue(q) || "").trim() : "";
    });
  }

  function idKey(provider) { return idFieldValues(provider).join("|"); }

  function getIdRec(provider) {
    return (state.draft._identity || {})[provider] || null;
  }

  function setIdRec(provider, rec) {
    state.draft._identity = state.draft._identity || {};
    if (rec === null) { delete state.draft._identity[provider]; }
    else { state.draft._identity[provider] = rec; }
    scheduleSave();
  }

  function isConfirmed(provider) {
    var rec = getIdRec(provider);
    return !!(rec && rec.confirmed && rec.valueKey === idKey(provider));
  }

  function hideIdentity(provider) {
    var card = getCard(FORM_CONFIG.identities[provider].host);
    if (card) {
      var block = card.querySelector(".identity-wrap");
      if (block) block.hidden = true;
    }
  }

  function renderIdentityState(card, provider) {
    var rec = getIdRec(provider);
    var block = card.querySelector(".identity-wrap");
    if (!block) return;
    if (!rec) { block.hidden = true; return; }

    var loading = block.querySelector(".identity-loading");
    var result = block.querySelector(".identity-result");
    var confirmed = block.querySelector(".identity-confirmed");
    var ask = block.querySelector(".identity-ask");
    var btns = block.querySelector(".identity-btns");
    var err = block.querySelector(".identity-error");
    var av = block.querySelector(".identity-avatar");
    var disp = block.querySelector(".identity-display");
    var uname = block.querySelector(".identity-username");

    block.hidden = false;
    loading.hidden = true;
    err.hidden = true;
    result.hidden = false;

    if (rec.avatarUrl) { av.src = rec.avatarUrl; av.hidden = false; }
    else { av.hidden = true; }
    disp.textContent = rec.displayName || rec.username || "";
    uname.textContent = rec.username ? ("@" + rec.username) : "";

    if (rec.confirmed) {
      ask.hidden = true;
      btns.hidden = true;
      confirmed.hidden = false;
    } else {
      ask.hidden = false;
      btns.hidden = false;
      confirmed.hidden = true;
    }
  }

  function renderIdentityBlock(card, provider) {
    var label = FORM_CONFIG.identities[provider].label;
    var block = document.createElement("div");
    block.className = "identity-wrap";
    block.hidden = true;
    block.innerHTML =
      '<div class="identity-loading" hidden><span class="spinner"></span><span>Checking ' + esc(label) + ' user…</span></div>' +
      '<div class="identity-result" hidden>' +
        '<div class="identity-user">' +
          '<img class="identity-avatar" alt="" hidden>' +
          '<div class="identity-meta">' +
            '<div class="identity-display"></div>' +
            '<div class="identity-username"></div>' +
          '</div>' +
        '</div>' +
        '<div class="identity-ask">Is this the correct user?</div>' +
        '<div class="identity-btns">' +
          '<button type="button" class="btn-yes">Yes</button>' +
          '<button type="button" class="btn-no">No</button>' +
        '</div>' +
        '<div class="identity-confirmed" hidden>✓ Verified</div>' +
      '</div>' +
      '<div class="identity-error" hidden></div>';

    card.querySelector(".q-body").appendChild(block);

    block.querySelector(".btn-yes").addEventListener("click", function () {
      var rec = getIdRec(provider);
      if (rec) { rec.confirmed = true; setIdRec(provider, rec); }
      renderIdentityState(card, provider);
      clearError(findQuestion(FORM_CONFIG.identities[provider].host));
    });

    block.querySelector(".btn-no").addEventListener("click", function () {
      setIdRec(provider, null);
      FORM_CONFIG.identities[provider].fields.forEach(function (f) {
        var q = findQuestion(f);
        if (q) { setValue(q, ""); state.draft[f] = ""; }
      });
      persist();
      hideIdentity(provider);
      var err = block.querySelector(".identity-error");
      err.textContent = "User not confirmed. Please re-enter your details.";
      err.hidden = false;
      var firstCard = getCard(FORM_CONFIG.identities[provider].fields[0]);
      if (firstCard) {
        var inp = firstCard.querySelector(".field-text");
        if (inp) inp.focus();
      }
    });
  }

  /* ---------- Identity lookup (via backend /api/discord, /api/roblox) ---------- */
  function fetchIdentity(provider) {
    var idc = FORM_CONFIG.identities[provider];
    var card = getCard(idc.host);
    if (!card) return;

    var rec = getIdRec(provider);
    if (rec && rec.valueKey === idKey(provider) && rec.confirmed) {
      renderIdentityState(card, provider);
      return;
    }

    var block = card.querySelector(".identity-wrap");
    if (!block) return;
    block.hidden = false;
    var loading = block.querySelector(".identity-loading");
    var result = block.querySelector(".identity-result");
    var err = block.querySelector(".identity-error");
    loading.hidden = false;
    result.hidden = true;
    err.hidden = true;

    var url;
    if (provider === "discord") {
      url = "/api/discord?user_id=" + encodeURIComponent(idFieldValues(provider)[1]);
    } else if (provider === "roblox") {
      url = "/api/roblox?username=" + encodeURIComponent(idFieldValues(provider)[0]);
    } else {
      return;
    }

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) {
          setIdRec(provider, {
            valueKey: idKey(provider),
            confirmed: false,
            displayName: d.user.display_name,
            username: d.user.username,
            avatarUrl: d.avatar_url
          });
          renderIdentityState(card, provider);
        } else {
          loading.hidden = true;
          err.textContent = (d && d.message) ? d.message : "User not found. Please check and try again.";
          err.hidden = false;
        }
      })
      .catch(function () {
        loading.hidden = true;
        err.textContent = "Could not verify this user right now. Please try again.";
        err.hidden = false;
      });
  }

  function handleIdentityInput(q) {
    var provider = q.identityProvider;
    if (!provider) return;
    var vals = idFieldValues(provider);
    var allFilled = vals.every(function (v) { return v !== ""; });
    var key = vals.join("|");
    var rec = getIdRec(provider);

    if (!allFilled) {
      if (rec) setIdRec(provider, null);
      hideIdentity(provider);
      return;
    }
    if (rec && rec.valueKey === key) return;
    if (rec) { setIdRec(provider, null); hideIdentity(provider); }

    clearTimeout(identityTimers[provider]);
    identityTimers[provider] = setTimeout(function () {
      if (idFieldValues(provider).every(function (v) { return v !== ""; })) {
        fetchIdentity(provider);
      }
    }, 500);
  }

  /* ---------- Country picker ---------- */
  function loadCountries() {
    fetch("/api/countries")
      .then(function (r) { return r.json(); })
      .then(function (list) { state.countries = list || []; })
      .catch(function () { state.countries = []; });
  }

  function normalizeStr(s) {
    return String(s || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i");
  }

  function tzOffsetLabel(tz) {
    try {
      var dtf = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" });
      var parts = dtf.formatToParts(new Date());
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === "timeZoneName") return parts[i].value; // e.g. "GMT+3"
      }
    } catch (e) {}
    return tz;
  }

  function countryMatches(query) {
    var q = normalizeStr(query);
    if (!q) return [];
    var scored = [];
    state.countries.forEach(function (c) {
      var name = normalizeStr(c.name);
      var aliases = (c.aliases || []).map(normalizeStr);
      var words = c.name.split(/\s+/).map(normalizeStr);
      var score = null;
      if (name === q) score = 0;
      else if (name.indexOf(q) === 0) score = 1;
      else if (aliases.indexOf(q) !== -1) score = 0;
      else if (aliases.some(function (a) { return a.indexOf(q) === 0; })) score = 1;
      else if (words.some(function (w) { return w.indexOf(q) === 0; })) score = 2;
      else if (name.indexOf(q) > -1) score = 3;
      else if (aliases.some(function (a) { return a.indexOf(q) > -1; })) score = 3;
      else if ((c.code || "").toLowerCase().indexOf(q) === 0) score = 4;
      if (score !== null) scored.push({ c: c, score: score });
    });
    scored.sort(function (a, b) {
      return a.score - b.score || a.c.name.localeCompare(b.c.name);
    });
    return scored.slice(0, 8).map(function (s) { return s.c; });
  }

  function findExactCountry(val) {
    var nq = normalizeStr(val);
    var found = null;
    state.countries.forEach(function (c) {
      if (found) return;
      if (normalizeStr(c.name) === nq) { found = c; return; }
      if ((c.aliases || []).some(function (a) { return normalizeStr(a) === nq; })) found = c;
    });
    return found;
  }

  function countrySelected(q) {
    return (state.draft._country && state.draft._country.name) ? state.draft._country : null;
  }

  function renderCountryInput(q, value) {
    var block = getCard(q.id);
    if (!block) return;
    var input = block.querySelector(".country-input");
    var sugg = block.querySelector(".country-suggestions");
    var sel = block.querySelector(".country-selected");
    input.value = value || "";
    input.hidden = false;
    sugg.hidden = true;
    sugg.innerHTML = "";
    sel.hidden = true;
  }

  function makeFlagElement(rec, big) {
    var span = document.createElement("span");
    span.className = big ? "country-flag-lg" : "country-flag";
    var img = document.createElement("img");
    img.className = big ? "country-flag-img-lg" : "country-flag-img";
    img.alt = "";
    img.loading = "lazy";
    if (rec.img) img.src = rec.img;
    img.onerror = function () {
      // Fall back to the emoji flag if the image cannot load
      span.textContent = rec.flag || "";
      img.remove();
    };
    span.appendChild(img);
    return span;
  }

  function renderCountrySelected(q, rec) {
    var block = getCard(q.id);
    if (!block) return;
    var input = block.querySelector(".country-input");
    var sugg = block.querySelector(".country-suggestions");
    var sel = block.querySelector(".country-selected");
    var flagBox = block.querySelector(".country-flag-box");
    var name = block.querySelector(".country-name");
    var tz = block.querySelector(".country-tz");
    flagBox.innerHTML = "";
    flagBox.appendChild(makeFlagElement(rec, true));
    name.textContent = rec.name || "";
    tz.textContent = rec.offset || rec.tz || "";
    input.hidden = true;
    sugg.hidden = true;
    sugg.innerHTML = "";
    sel.hidden = false;
  }

  function selectCountry(q, c) {
    var rec = {
      name: c.name,
      flag: c.flag,
      img: c.img,
      tz: c.tz,
      offset: tzOffsetLabel(c.tz)
    };
    state.draft[q.id] = c.name;
    state.draft._country = rec;
    persist();
    scheduleSave();
    renderCountrySelected(q, rec);
    clearError(q);
  }

  function initCountry(block, q) {
    var input = block.querySelector(".country-input");
    var sugg = block.querySelector(".country-suggestions");
    var edit = block.querySelector(".country-edit");

    function showSuggestions(list) {
      if (!list.length) { sugg.hidden = true; sugg.innerHTML = ""; return; }
      sugg.innerHTML = "";
      list.forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "country-suggestion";
        b.appendChild(makeFlagElement(c, false));
        var nameSpan = document.createElement("span");
        nameSpan.textContent = c.name;
        b.appendChild(nameSpan);
        b.addEventListener("mousedown", function (ev) { ev.preventDefault(); });
        b.addEventListener("click", function () { selectCountry(q, c); });
        sugg.appendChild(b);
      });
      sugg.hidden = false;
    }

    input.addEventListener("input", function () {
      var val = input.value;
      var list = countryMatches(val);
      showSuggestions(list);
      // Auto-lock when the typed name matches exactly (Turkish or English)
      if (val.trim() !== "") {
        var exact = findExactCountry(val);
        if (exact) { selectCountry(q, exact); return; }
      }
      // typing a new value invalidates a previous selection
      if (state.draft[q.id]) {
        delete state.draft[q.id];
        delete state.draft._country;
        persist();
        scheduleSave();
      }
    });

    input.addEventListener("focus", function () {
      if (input.value.trim() === "") {
        var list = state.countries.slice().sort(function (a, b) {
          return a.name.localeCompare(b.name);
        }).slice(0, 8);
        showSuggestions(list);
      } else {
        showSuggestions(countryMatches(input.value));
      }
    });

    input.addEventListener("blur", function () {
      setTimeout(function () { sugg.hidden = true; }, 150);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var list = countryMatches(input.value);
        if (list.length) { selectCountry(q, list[0]); e.preventDefault(); }
      }
    });

    edit.addEventListener("click", function () {
      var prev = state.draft._country ? state.draft._country.name : "";
      delete state.draft[q.id];
      delete state.draft._country;
      persist();
      scheduleSave();
      renderCountryInput(q, prev);
      var inp = block.querySelector(".country-input");
      if (inp) inp.focus();
    });
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    $("#form-title").textContent = FORM_CONFIG.title;
    $("#form-desc").textContent = FORM_CONFIG.description;
    $("#form-logo").setAttribute("src", FORM_CONFIG.logo);
    var base = storage.available
      ? "Your progress is saved automatically on this device."
      : "Automatic saving is unavailable in this embedded preview — open the live preview to enable it.";
    $("#meta-note").textContent = base + " One response is allowed per IP address every 48 hours.";
  }

  /* ---------- Question rendering ---------- */
  function buildInput(q) {
    var html = "";
    if (q.type === "text") {
      var it = q.inputType || "text";
      var attrs = 'class="field-text" type="' + it + '" data-qid="' + esc(q.id) + '"' +
        ' placeholder="' + esc(q.placeholder || "Your answer") + '" autocomplete="off"';
      if (q.min != null) attrs += ' min="' + esc(q.min) + '"';
      if (q.max != null) attrs += ' max="' + esc(q.max) + '"';
      html = '<input ' + attrs + '>';
    } else if (q.type === "paragraph") {
      html = '<textarea class="field-textarea" rows="1" data-qid="' + esc(q.id) + '"' +
             ' placeholder="' + esc(q.placeholder || "Your answer") + '"></textarea>';
    } else if (q.type === "multiple_choice" || q.type === "checkboxes") {
      var inputType = q.type === "multiple_choice" ? "radio" : "checkbox";
      var opts = (q.options || []).map(function (o) {
        return '<label class="option">' +
               '<input type="' + inputType + '" name="' + esc(q.id) + '" value="' + esc(o) + '" data-qid="' + esc(q.id) + '">' +
               '<span>' + esc(o) + '</span></label>';
      }).join("");
      html = '<div class="option-list" role="group">' + opts + '</div>';
    } else if (q.type === "dropdown") {
      var opts2 = ['<option value="" disabled selected hidden>Choose</option>']
        .concat((q.options || []).map(function (o) {
          return '<option value="' + esc(o) + '">' + esc(o) + '</option>';
        })).join("");
      html = '<select class="field-select" data-qid="' + esc(q.id) + '">' + opts2 + '</select>';
    } else if (q.type === "linear_scale") {
      var max = q.scaleMax || 5;
      var cols = "";
      for (var n = 1; n <= max; n++) {
        cols += '<label class="scale-opt">' +
                '<input type="radio" name="' + esc(q.id) + '" value="' + n + '" data-qid="' + esc(q.id) + '">' +
                '<span>' + n + '</span></label>';
      }
      var labels = "";
      if (q.scaleLabels && q.scaleLabels.length === 2) {
        labels = '<div class="scale-labels"><span>' + esc(q.scaleLabels[0]) + '</span><span>' + esc(q.scaleLabels[1]) + '</span></div>';
      }
      html = '<div class="scale">' + cols + '</div>' + labels;
    } else if (q.type === "country") {
      html =
        '<div class="country-box">' +
          '<input class="field-text country-input" type="text" data-qid="' + esc(q.id) + '" autocomplete="off">' +
          '<div class="country-suggestions" hidden></div>' +
          '<div class="country-selected" hidden>' +
            '<div class="country-selected-main">' +
              '<div class="country-flag-box"></div>' +
              '<div class="country-meta">' +
                '<div class="country-name"></div>' +
                '<div class="country-tz"></div>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="country-edit">Edit</button>' +
          '</div>' +
        '</div>';
    }
    return html;
  }

  /* Render ONE section (page), Google-Forms style: colored band + questions. */
  function renderSection(i) {
    var container = $("#questions");
    container.innerHTML = "";
    var sec = FORM_CONFIG.sections[i];
    if (!sec) return;

    var card = document.createElement("div");
    card.className = "card section-card";
    var html = '<div class="section-band">' + esc(sec.title) + '</div>';
    if (sec.description) html += '<div class="section-desc">' + esc(sec.description) + '</div>';
    card.innerHTML = html;
    container.appendChild(card);

    (sec.questions || []).forEach(function (q) {
      var block = document.createElement("div");
      block.className = "q-block";
      block.setAttribute("data-qid", q.id);

      var head = '<div class="q-title">' + esc(q.title);
      if (q.required) head += '<span class="req" aria-label="required">*</span>';
      head += '</div>';
      if (q.description) head += '<div class="q-desc">' + esc(q.description) + '</div>';

      block.innerHTML =
        head +
        '<div class="q-body">' + buildInput(q) + '</div>' +
        '<div class="q-error">This is a required question</div>';

      card.appendChild(block);

      if (q.type === "country") {
        initCountry(block, q);
        var rec = countrySelected(q);
        if (Object.prototype.hasOwnProperty.call(state.draft, q.id) && rec) {
          renderCountrySelected(q, rec);
        }
      } else {
        if (Object.prototype.hasOwnProperty.call(state.draft, q.id)) {
          setValue(q, state.draft[q.id]);
        }
        if (q.identityProvider && isIdentityHost(q)) {
          renderIdentityBlock(block, q.identityProvider);
        }
      }
    });

    card.querySelectorAll(".field-textarea").forEach(autoResize);

    // Restore / re-verify identity confirmations for this section
    (sec.questions || []).forEach(function (q) {
      if (q.identityProvider && isIdentityHost(q)) {
        var idc = FORM_CONFIG.identities[q.identityProvider];
        var filled = idc.fields.every(function (f) {
          var fq = findQuestion(f);
          return fq && String(getValue(fq) || "").trim() !== "";
        });
        if (filled) fetchIdentity(q.identityProvider);
      }
    });
  }

  /* ---------- Read / write values ---------- */
  function getValue(q) {
    var card = getCard(q.id);
    if (q.type === "country") {
      return state.draft[q.id] || "";
    }
    if (!card) return "";
    if (q.type === "checkboxes") {
      var vals = [];
      card.querySelectorAll('input[type="checkbox"]:checked').forEach(function (el) {
        vals.push(el.value);
      });
      return vals;
    }
    if (q.type === "multiple_choice" || q.type === "linear_scale") {
      var r = card.querySelector('input[type="radio"]:checked');
      return r ? r.value : "";
    }
    if (q.type === "dropdown") {
      var s = card.querySelector("select");
      return s ? s.value : "";
    }
    var el = card.querySelector(".field-text, .field-textarea");
    return el ? el.value : "";
  }

  function setValue(q, value) {
    var card = getCard(q.id);
    if (q.type === "country") {
      var val = value || "";
      if (val) {
        var found = null;
        state.countries.forEach(function (c) { if (c.name === val) found = c; });
        if (found) {
          state.draft[q.id] = val;
          state.draft._country = {
            name: found.name, flag: found.flag, img: found.img,
            tz: found.tz, offset: tzOffsetLabel(found.tz)
          };
          renderCountrySelected(q, state.draft._country);
        } else {
          state.draft[q.id] = val;
          state.draft._country = { name: val, flag: "", img: "", tz: "", offset: "" };
          renderCountrySelected(q, state.draft._country);
        }
      } else {
        delete state.draft[q.id];
        delete state.draft._country;
        renderCountryInput(q, "");
      }
      return;
    }
    if (!card) return;
    if (q.type === "checkboxes") {
      var arr = Array.isArray(value) ? value : [];
      card.querySelectorAll('input[type="checkbox"]').forEach(function (el) {
        el.checked = arr.indexOf(el.value) !== -1;
      });
      return;
    }
    if (q.type === "multiple_choice" || q.type === "linear_scale") {
      card.querySelectorAll('input[type="radio"]').forEach(function (el) {
        el.checked = String(el.value) === String(value);
      });
      return;
    }
    if (q.type === "dropdown") {
      var s = card.querySelector("select");
      if (s) s.value = value || "";
      return;
    }
    var el = card.querySelector(".field-text, .field-textarea");
    if (el) {
      el.value = value || "";
      if (el.tagName === "TEXTAREA") autoResize(el);
    }
  }

  function autoResize(ta) {
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }

  /* ---------- Autosave ---------- */
  var saveTimer = null;

  function setSaveStatus(mode) {
    var el = $("#save-status");
    var txt = $("#save-status-text");
    if (!el || !txt) return;
    if (mode === "saving") {
      txt.textContent = "Saving…";
      el.classList.add("show");
    } else if (mode === "saved") {
      txt.textContent = "Saved";
      el.classList.add("show");
    } else {
      el.classList.remove("show");
    }
  }

  function persist() {
    storage.set(FORM_CONFIG.storageKey, state.draft);
  }

  function scheduleSave() {
    setSaveStatus("saving");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      persist();
      setSaveStatus("saved");
    }, 400);
  }

  function saveNow() {
    clearTimeout(saveTimer);
    persist();
  }

  /* ---------- Validation ---------- */
  function checkQuestion(q) {
    var v = getValue(q);
    var empty = q.type === "checkboxes"
      ? (!Array.isArray(v) || v.length === 0)
      : (v === "" || v === null || v === undefined || String(v).trim() === "");

    if (q.required && empty) return "This is a required question";

    if (q.inputType === "number" && !empty) {
      var n = Number(v);
      if (isNaN(n)) return "Enter a valid number";
      if (q.min != null && n < q.min) return "Enter a value of at least " + q.min;
      if (q.max != null && n > q.max) return "Enter a value of at most " + q.max;
    }

    if (isIdentityHost(q) && !isConfirmed(q.identityProvider)) {
      return "Please confirm the user before continuing.";
    }
    return null;
  }

  function markError(q, msg) {
    var card = getCard(q.id);
    if (!card) return;
    card.classList.add("has-error");
    if (msg) {
      var err = card.querySelector(".q-error");
      if (err) err.textContent = msg;
    }
  }
  function clearError(q) {
    var card = getCard(q.id);
    if (card) card.classList.remove("has-error");
  }

  function validateSection(i) {
    var valid = true;
    var firstBad = null;
    (FORM_CONFIG.sections[i].questions || []).forEach(function (q) {
      var msg = checkQuestion(q);
      if (msg) {
        markError(q, msg);
        valid = false;
        if (!firstBad) firstBad = getCard(q.id);
      } else {
        clearError(q);
      }
    });
    if (firstBad && firstBad.scrollIntoView) {
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return valid;
  }

  /* ---------- Navigation ---------- */
  function updateNavButtons() {
    var total = FORM_CONFIG.sections.length;
    var isFirst = state.currentSection === 0;
    var isLast = state.currentSection === total - 1;
    $("#back-btn").hidden = isFirst;
    $("#next-btn").hidden = isLast;
    $("#submit-btn").hidden = !isLast;
  }

  function goTo(i) {
    saveNow();
    state.currentSection = i;
    renderSection(i);
    updateNavButtons();
    window.scrollTo(0, 0);
  }

  function onNext() {
    if (!validateSection(state.currentSection)) return;
    goTo(state.currentSection + 1);
  }
  function onBack() {
    goTo(state.currentSection - 1);
  }

  /* ---------- Screens ---------- */
  function showSuccess() {
    $("#success-screen").hidden = false;
    $("#locked-screen").hidden = true;
    $("#page").hidden = true;
    window.scrollTo(0, 0);
  }
  function hideLoader() {
    var l = $("#app-loader");
    if (l) l.hidden = true;
  }
  function showLocked() {
    hideLoader();
    $("#locked-screen").hidden = false;
    $("#success-screen").hidden = true;
    $("#page").hidden = true;
    window.scrollTo(0, 0);
  }
  function showForm() {
    hideLoader();
    $("#success-screen").hidden = true;
    $("#locked-screen").hidden = true;
    $("#page").hidden = false;
    window.scrollTo(0, 0);
  }

  /* ---------- Live input handling ---------- */
  function onInput(e) {
    var t = e.target;
    var qid = t.getAttribute && t.getAttribute("data-qid");
    if (!qid) return;
    var q = findQuestion(qid);
    if (!q) return;
    if (q.type === "country") return;   // handled by its own listeners

    if (t.tagName === "TEXTAREA") autoResize(t);

    state.draft[qid] = getValue(q);
    scheduleSave();

    var filled = q.type === "checkboxes"
      ? (Array.isArray(state.draft[qid]) && state.draft[qid].length > 0)
      : (state.draft[qid] !== "" && state.draft[qid] !== null && state.draft[qid] !== undefined && String(state.draft[qid]).trim() !== "");
    if (getCard(q.id).classList.contains("has-error") && filled) clearError(q);

    if (q.identityProvider) handleIdentityInput(q);
  }

  /* ---------- Submit ---------- */
  function setSubmitState(busy) {
    var b = $("#submit-btn");
    if (busy) {
      b.disabled = true;
      b.textContent = "Submitting…";
    } else {
      b.disabled = false;
      b.textContent = "Submit";
    }
  }

  function showSubmitError(msg) {
    var el = $("#submit-error");
    el.textContent = msg || "";
    el.style.display = msg ? "block" : "none";
  }

  function submit() {
    if (!validateSection(state.currentSection)) return;
    setSubmitState(true);
    showSubmitError("");

    var answers = QUESTIONS.map(function (q) {
      // Read from the saved draft: with pagination only the current section is
      // in the DOM, so getValue() would return empty for earlier pages.
      var value;
      if (Object.prototype.hasOwnProperty.call(state.draft, q.id)) {
        value = state.draft[q.id];
      } else {
        value = getValue(q);
      }
      return { id: q.id, title: q.title, value: value };
    });

    Object.keys(FORM_CONFIG.identities).forEach(function (provider) {
      var rec = getIdRec(provider);
      if (rec && rec.confirmed) {
        var label = FORM_CONFIG.identities[provider].label;
        answers.push({
          id: "_identity_" + provider,
          title: "Verified " + label + " user",
          value: rec.displayName + " (@" + rec.username + ")"
        });
      }
    });

    if (state.draft._country && state.draft._country.name) {
      answers.push({
        id: "_country",
        title: "Country / Timezone",
        value: state.draft._country.name + " (" + (state.draft._country.offset || state.draft._country.tz || "") + ")"
      });
    }

    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answers })
    })
      .then(function (res) {
        if (res.status === 409) {
          return res.json().then(function (d) { return { locked: true, message: d && d.message }; });
        }
        if (!res.ok) throw new Error("http " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.locked) { lockOut(); return; }
        if (data && data.ok) {
          storage.set(FORM_CONFIG.submittedKey, Date.now());
          state.draft = {};
          storage.remove(FORM_CONFIG.storageKey);
          setSubmitState(false);
          showSuccess();
        }
      })
      .catch(function () {
        setSubmitState(false);
        showSubmitError("Could not submit your response. Please try again.");
      });
  }

  function lockOut() {
    storage.set(FORM_CONFIG.submittedKey, Date.now());
    storage.remove(FORM_CONFIG.storageKey);
    state.draft = {};
    showLocked();
  }

  var TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

  function checkAlreadySubmitted() {
    // Backend: server checks the visitor's IP (48-hour window). Keep a local
    // fallback for the rare case the API is unreachable.
    var localTs = storage.get(FORM_CONFIG.submittedKey, 0);
    var locallyLocked = !!localTs && (Date.now() - localTs) < TWO_DAYS_MS;
    fetch("/api/status", { method: "GET", headers: { "Accept": "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("bad status"); return r.json(); })
      .then(function (d) {
        if (d && d.submitted) { lockOut(); } else { showForm(); }
      })
      .catch(function () {
        if (locallyLocked) { lockOut(); } else { showForm(); }
      });
  }

  /* ---------- Actions ---------- */
  function resetForm() {
    state.draft = {};
    storage.remove(FORM_CONFIG.storageKey);
    QUESTIONS.forEach(function (q) {
      setValue(q, "");
      clearError(q);
    });
    Object.keys(FORM_CONFIG.identities).forEach(function (provider) {
      hideIdentity(provider);
    });
    setSaveStatus(null);
  }

  /* ---------- Init ---------- */
  function init() {
    flattenQuestions();
    renderHeader();

    var hasCountry = QUESTIONS.some(function (q) { return q.type === "country"; });
    if (hasCountry) loadCountries();

    goTo(0);

    $("#questions").addEventListener("input", onInput);
    $("#questions").addEventListener("change", onInput);

    $("#submit-btn").addEventListener("click", submit);
    $("#next-btn").addEventListener("click", onNext);
    $("#back-btn").addEventListener("click", onBack);
    $("#clear-btn").addEventListener("click", function () {
      if (window.confirm("Clear all answers? This cannot be undone.")) {
        resetForm();
        goTo(0);
      }
    });

    // Guarantee a save even if the user closes the tab/window mid-typing
    window.addEventListener("pagehide", saveNow);
    window.addEventListener("beforeunload", saveNow);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") saveNow();
    });

    // Hide the form and show a spinner until the server confirms whether this
    // IP already submitted (prevents the form flashing before the locked screen).
    $("#page").hidden = true;
    var loader = $("#app-loader");
    if (loader) loader.hidden = false;
    checkAlreadySubmitted();
  }

  init();
})();
