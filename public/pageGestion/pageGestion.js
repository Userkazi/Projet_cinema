const afficher = document.getElementById("afficher");
const liste = document.getElementById("liste");

async function chargerUsers() {
    const response = await fetch("/users/liste");
    const users = await response.json();

    let html = "<table border='1'>";
    html += "<tr><th>ID</th><th>Email</th><th>Action</th></tr>";

    for (let i = 0; i < users.length; i++) {
        html += `
        <tr>
            <td>${users[i].id}</td>
            <td>${users[i].email}</td>
            <td>
                <button onclick="supprimer(${users[i].id})">Supprimer</button>
                <button onclick="reset(${users[i].id})">Reset</button>
            </td>
        </tr>`;
    }

    html += "</table>";
    liste.innerHTML = html;
}

async function supprimer(id) {
    await fetch("/users/supprimer", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id })
    });

    chargerUsers();
}

async function reset(id) {
    await fetch("/users/reset", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id })
    });

    alert("Mot de passe réinitialisé");
}

afficher.addEventListener("click", chargerUsers);