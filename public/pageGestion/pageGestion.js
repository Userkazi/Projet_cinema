const btn = document.getElementById("afficher");
const liste = document.getElementById("liste");

btn.addEventListener("click", chargerUsers);

async function chargerUsers() {
    const response = await fetch("/users/liste");
    const users = await response.json();

    liste.innerHTML = "";

    const table = document.createElement("table");
    table.border = "1";

    // HEADER
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["ID", "Nom", "Email", "Action"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // BODY
    const tbody = document.createElement("tbody");

    for (let i = 0; i < users.length; i++) {
        const row = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = users[i].id;

        const tdNom = document.createElement("td");
        tdNom.textContent = users[i].nom;

        const tdEmail = document.createElement("td");
        tdEmail.textContent = users[i].email;

        const tdAction = document.createElement("td");

        const btnSupprimer = document.createElement("button");
        btnSupprimer.textContent = "Supprimer";
        btnSupprimer.onclick = () => supprimerUser(users[i].id);

        const btnReset = document.createElement("button");
        btnReset.textContent = "Reset MDP";
        btnReset.onclick = () => resetPassword(users[i].id);

        tdAction.appendChild(btnSupprimer);
        tdAction.appendChild(btnReset);

        row.appendChild(tdId);
        row.appendChild(tdNom);
        row.appendChild(tdEmail);
        row.appendChild(tdAction);

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    liste.appendChild(table);
}

// supprimer
async function supprimerUser(id) {
    await fetch("/users/supprimer", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id })
    });

    chargerUsers();
}

// reset password
async function resetPassword(id) {
    await fetch("/users/reset", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id })
    });

    alert("Mot de passe réinitialisé");
}