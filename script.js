const form = document.querySelector("#terminal-form");
const input = document.querySelector("#command-input");
const output = document.querySelector("#terminal-output");

// Capture the default DOM state on load
const defaultOutput = output.innerHTML;

// Command History State
const commandHistory = [];
let historyIndex = -1;

const commands = {
    help: () => [
        "Available commands:",
        "  help      Show available commands",
        "  whoami    About me",
        "  projects  View my projects",
        "  skills    My technical stack",
        "  contact   How to reach me",
        "  clear     Reset the terminal to default view"
    ],
    skills: () => [
        "Languages: Python, SQL, Bash",
        "Backend: FastAPI, Django, REST APIs",
        "Infrastructure: Linux, Docker, Proxmox",
        "Databases: PostgreSQL, SQLite"
    ],
    whoami: () => [
        "Sidharth Sunu",
        "Python backend developer | Linux enthusiast",
        "",
        "I build backend services, automate infrastructure, and enjoy understanding what happens under the hood."
    ],
    projects: () => [
        "collector/         - Linux host monitoring · FastAPI · SQLite",
        "homelab/           - Linux · Proxmox · Docker · Networking",
        "backend-projects/  - Python · APIs · PostgreSQL"
    ],
    contact: () => [
        "GitHub:   [Add your URL]",
        "LinkedIn: [Add your URL]",
        "Email:    [Add your Email]"
    ]
};

function printLine(text = "") {
    const line = document.createElement("p");
    line.textContent = text;
    output.appendChild(line);
}

function runCommand(rawCommand) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    // Save to history
    commandHistory.push(rawCommand);
    historyIndex = commandHistory.length;

    const historyLine = document.createElement("p");
    historyLine.className = "terminal-line";
    
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "sidh@dev:~$";
    
    const enteredCommand = document.createElement("span");
    enteredCommand.textContent = rawCommand;
    
    historyLine.append(prompt, " ", enteredCommand);
    output.appendChild(historyLine);

    if (command === "clear") {
        output.innerHTML = defaultOutput;
        return;
    }

    const handler = commands[command];
    if (!handler) {
        printLine(`command not found: ${command}`);
        printLine("Type 'help' to see available commands.");
    } else {
        handler().forEach(printLine);
    }
}

// Command History Navigation
input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = "";
        }
    }
});

// Global Focus (Clicking anywhere in terminal focuses the input)
document.querySelector(".terminal").addEventListener("click", () => {
    input.focus();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    runCommand(input.value);
    input.value = "";
    output.scrollTop = output.scrollHeight;
    input.focus();
});