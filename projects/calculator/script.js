* {
    box-sizing: border-box;
}

:root {
    --background: #0b0d12;
    --surface: #141821;
    --surface2: #1c2230;
    --border: #2a3140;
    --text: #f5f7fb;
    --muted: #8e98aa;
    --accent: #7d8cff;
    --accent2: #9b7cff;
    --danger: #ef6262;
    --shadow: 0 20px 60px rgba(0,0,0,.35);
}

body.light {
    --background: #f3f5f9;
    --surface: #ffffff;
    --surface2: #eef1f6;
    --border: #dce1e9;
    --text: #151923;
    --muted: #697386;
    --shadow: 0 15px 40px rgba(20,30,50,.08);
}

body {
    margin: 0;
    min-height: 100vh;

    background:
        radial-gradient(
            circle at top left,
            rgba(100,110,220,.18),
            transparent 35%
        ),
        var(--background);

    color: var(--text);

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
}


/* ================= APP ================= */

.app {
    display: flex;
    min-height: 100vh;
}


/* ================= SIDEBAR ================= */

.sidebar {
    width: 250px;

    background: var(--surface);

    border-right: 1px solid var(--border);

    padding: 20px 14px;

    display: flex;
    flex-direction: column;

    position: fixed;

    left: 0;
    top: 0;
    bottom: 0;

    z-index: 20;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 10px;
    margin-bottom: 20px;
}

.brand-icon {
    width: 42px;
    height: 42px;

    display: grid;
    place-items: center;

    border-radius: 14px;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent2)
        );

    color: white;

    font-size: 22px;
}

.brand strong {
    display: block;
    font-size: 18px;
}

.brand small {
    color: var(--muted);
    font-size: 11px;
}

nav {
    display: flex;
    flex-direction: column;
}

.nav-item {
    width: 100%;

    border: none;

    background: transparent;

    color: var(--muted);

    text-align: left;

    padding: 12px;

    border-radius: 12px;

    cursor: pointer;

    font-size: 14px;

    margin-bottom: 3px;

    transition: .15s;
}

.nav-item:hover,
.nav-item.active {
    background: var(--surface2);
    color: var(--text);
}

.sidebar-footer {
    margin-top: auto;

    padding: 12px;

    color: var(--muted);

    font-size: 11px;

    line-height: 1.6;
}


/* ================= MAIN ================= */

main {
    margin-left: 250px;

    width: calc(100% - 250px);

    min-height: 100vh;
}


/* ================= TOP BAR ================= */

.topbar {
    height: 70px;

    display: flex;
    align-items: center;

    gap: 15px;

    padding: 0 25px;

    border-bottom: 1px solid var(--border);

    background: var(--background);

    position: sticky;
    top: 0;

    z-index: 10;
}

.topbar h2 {
    font-size: 18px;
}

.icon-button {
    border: 1px solid var(--border);

    background: var(--surface);

    color: var(--text);

    padding: 9px 12px;

    border-radius: 10px;

    cursor: pointer;
}

.top-actions {
    margin-left: auto;

    display: flex;

    align-items: center;

    gap: 10px;
}

.memory-indicator {
    display: none;

    background: var(--accent);

    color: white;

    font-size: 11px;

    padding: 3px 6px;

    border-radius: 6px;
}


/* ================= PAGES ================= */

.page {
    display: none;

    padding: 30px;

    max-width: 1150px;

    margin: auto;
}

.page.active {
    display: block;
}


/* ================= CALCULATOR ================= */

.calculator {
    width: 100%;
    max-width: 520px;

    margin: 10px auto;

    padding: 18px;

    background: var(--surface);

    border: 1px solid var(--border);

    border-radius: 28px;

    box-shadow: var(--shadow);
}

.display {
    min-height: 175px;

    padding: 15px;

    display: flex;

    flex-direction: column;

    justify-content: flex-end;

    overflow: hidden;
}

.display-top {
    display: flex;

    justify-content: space-between;

    color: var(--muted);

    font-size: 11px;
}

.display-top button {
    border: 0;

    background: transparent;

    color: var(--muted);

    cursor: pointer;
}

.expression {
    min-height: 35px;

    text-align: right;

    font-size: 21px;

    color: var(--muted);

    white-space: nowrap;

    overflow-x: auto;
}

.result {
    text-align: right;

    font-size: 48px;

    font-weight: 700;

    white-space: nowrap;

    overflow-x: auto;
}

.error {
    color: var(--danger);

    font-size: 12px;

    text-align: right;

    min-height: 18px;
}


/* MEMORY */

.memory-buttons {
    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 7px;

    margin-bottom: 10px;
}

.memory-buttons button {
    border: 0;

    background: var(--surface2);

    color: var(--text);

    padding: 10px;

    border-radius: 11px;

    cursor: pointer;
}


/* KEYPAD */

.keypad {
    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 9px;
}

.keypad button {
    min-height: 62px;

    border: 0;

    border-radius: 18px;

    background: var(--surface2);

    color: var(--text);

    font-size: 20px;

    cursor: pointer;

    transition: .12s;
}

.keypad button:hover {
    filter: brightness(1.12);
}

.keypad button:active {
    transform: scale(.96);
}

.keypad .operator {
    background: #29304a;
}

.keypad .function {
    color: #aeb8ff;
}

.keypad .equals {
    grid-row: span 2;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent2)
        );

    color: white;
}

.keypad .zero {
    grid-column: span 2;
}

.calculator-actions {
    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 8px;

    margin-top: 10px;
}

.calculator-actions button {
    border: 0;

    background: var(--surface2);

    color: var(--text);

    padding: 11px;

    border-radius: 10px;

    cursor: pointer;
}


/* ================= PANELS ================= */

.panel {
    background: var(--surface);

    border: 1px solid var(--border);

    border-radius: 24px;

    padding: 25px;

    box-shadow: var(--shadow);
}

.panel h1 {
    margin-top: 0;
}

.muted {
    color: var(--muted);
}

.panel input,
.panel select,
.scientific-input {
    width: 100%;

    padding: 13px;

    margin: 6px 0;

    background: var(--surface2);

    color: var(--text);

    border: 1px solid var(--border);

    border-radius: 11px;

    outline: none;
}

.form-row {
    display: flex;

    gap: 10px;

    margin: 12px 0;
}

.form-row > * {
    flex: 1;
}

.primary {
    border: 0;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent2)
        );

    color: white;

    padding: 12px 17px;

    border-radius: 11px;

    cursor: pointer;

    font-weight: 700;
}

.danger {
    border: 0;

    background: var(--danger);

    color: white;

    padding: 11px 16px;

    border-radius: 10px;

    cursor: pointer;
}

.large-result,
.solution {
    margin-top: 18px;

    padding: 20px;

    background: var(--surface2);

    border-radius: 15px;

    font-size: 23px;
}


/* ================= SCIENTIFIC ================= */

.scientific {
    max-width: 800px;

    margin: auto;
}

.scientific-display {
    background: var(--surface);

    border: 1px solid var(--border);

    border-radius: 20px;

    padding: 25px;

    margin-bottom: 10px;

    text-align: right;
}

.scientific-display strong {
    display: block;

    font-size: 45px;

    margin-top: 10px;
}

.scientific-controls {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    gap: 7px;

    margin-bottom: 8px;
}

.scientific-controls button,
.scientific-controls select,
.scientific-grid button {
    border: 0;

    background: var(--surface);

    color: var(--text);

    border: 1px solid var(--border);

    border-radius: 12px;

    min-height: 48px;

    cursor: pointer;
}

.scientific-grid {
    display: grid;

    grid-template-columns:
        repeat(6, 1fr);

    gap: 7px;
}

.scientific-grid .equals {
    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent2)
        );

    color: white;
}


/* ================= CARDS ================= */

.cards {
    display: grid;

    grid-template-columns:
        repeat(auto-fit, minmax(220px, 1fr));

    gap: 15px;
}

.tool-card {
    background: var(--surface2);

    border: 1px solid var(--border);

    border-radius: 17px;

    padding: 18px;

    margin-bottom: 15px;
}

.tool-card h3 {
    margin-top: 0;
}

.tool-card output {
    display: block;

    margin-top: 12px;

    font-weight: 700;

    line-height: 1.5;
}


/* ================= CONSTANTS ================= */

.constants-grid {
    display: grid;

    grid-template-columns:
        repeat(auto-fit, minmax(230px, 1fr));

    gap: 12px;
}

.constant {
    background: var(--surface2);

    border: 1px solid var(--border);

    border-radius: 15px;

    padding: 17px;
}

.constant-name {
    font-weight: 700;
}

.constant-value {
    display: block;

    margin-top: 8px;

    overflow-x: auto;

    color: var(--muted);
}


/* ================= HISTORY ================= */

.panel-header {
    display: flex;

    justify-content: space-between;

    align-items: center;
}

.history-item {
    display: grid;

    grid-template-columns:
        1fr auto;

    gap: 10px;

    padding: 15px 0;

    border-bottom: 1px solid var(--border);
}

.history-expression {
    color: var(--muted);
}

.history-result {
    font-size: 18px;

    font-weight: 700;
}

.history-time {
    font-size: 11px;

    color: var(--muted);
}

.history-actions {
    display: flex;

    gap: 5px;

    align-items: center;
}

.history-actions button {
    border: 1px solid var(--border);

    background: var(--surface2);

    color: var(--text);

    padding: 7px;

    border-radius: 8px;

    cursor: pointer;
}


/* ================= SETTINGS ================= */

.settings label {
    display: flex;

    justify-content: space-between;

    align-items: center;

    padding: 15px 0;

    border-bottom: 1px solid var(--border);
}

.settings label input,
.settings label select {
    width: auto;

    max-width: 180px;
}

.about {
    margin-top: 25px;

    color: var(--muted);

    line-height: 1.6;

    font-size: 13px;
}


/* ================= MOBILE ================= */

@media (max-width: 800px) {

    .sidebar {
        left: -270px;

        transition: .2s;
    }

    .sidebar.open {
        left: 0;
    }

    main {
        margin-left: 0;

        width: 100%;
    }

    .page {
        padding: 15px;
    }

    .topbar {
        padding: 0 15px;
    }

    .scientific-controls {
        grid-template-columns:
            repeat(3, 1fr);
    }

    .scientific-grid {
        grid-template-columns:
            repeat(3, 1fr);
    }

}

@media (max-width: 450px) {

    .calculator {
        padding: 10px;

        border-radius: 20px;
    }

    .keypad {
        gap: 7px;
    }

    .keypad button {
        min-height: 55px;

        border-radius: 15px;
    }

    .result {
        font-size: 38px;
    }

    .expression {
        font-size: 18px;
    }

    .form-row {
        flex-direction: column;
    }

}
