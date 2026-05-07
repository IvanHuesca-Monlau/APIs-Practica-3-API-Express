const API_URL = "http://localhost:3000/api/users";
let editandoId = null;

function getId(id) {
  return document.getElementById(id);
}

function getValor(id) {
  return getId(id).value;
}

function setValor(id, valor) {
  getId(id).value = valor.toString();
}

window.cargarUsuarios = async function () {
  const listEl = getId("listaUsuarios");
  listEl.innerHTML =
    '<div class="text-center py-8 text-slate-500">Cargando usuarios...</div>';

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const usuarios = data.users || [];

    const totalEl = getId("totalUsuarios");
    totalEl.textContent = usuarios.length;

    let html = "";
    if (usuarios.length === 0) {
      html =
        '<div class="text-center py-8 text-slate-500">No hay usuarios</div>';
    } else {
      usuarios.forEach((usuario) => {
        html += `
          <div class="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition">
            <div class="flex-1">
              <h3 class="font-semibold text-slate-800">${usuario.first_name} ${usuario.last_name}</h3>
              <p class="text-xs text-slate-500 mt-1">ID: ${usuario.id}</p>
              <p class="text-sm text-slate-500">Usuario: ${usuario.username}</p>
              <p class="text-sm text-slate-500">Correo: ${usuario.email}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <button onclick="window.eliminarUsuario(${usuario.id})"
                class="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition">
                Eliminar
              </button>
            </div>
          </div>
        `;
      });
    }
    listEl.innerHTML = html;
  } catch (error) {
    listEl.innerHTML =
      '<div class="text-center py-8 text-red-500">Error al cargar usuarios</div>';
  }
};

window.eliminarUsuario = async function (id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    window.cargarUsuarios();
  } catch (error) {
    alert("Error al eliminar el usuario");
  }
};

window.cargarDatosParaEditar = async function () {
  const id = getValor("editId").trim();
  if (!id) {
    alert("Introduce un ID válido");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("No encontrado");

    const data = await response.json();
    const usuario = data.user;

    setValor("editFirst_name", usuario.first_name || "");
    setValor("editLast_name", usuario.last_name || "");
    setValor("editUsername", usuario.username || "");
    setValor("editEmail", usuario.email || "");

    editandoId = usuario.id;
    getId("btnEditar").disabled = false;
  } catch (error) {
    alert("Usuario no encontrado");
  }
};

window.cargarEnFormularioEditar = function (
  id,
  first_name,
  last_name,
  username,
  email,
) {
  setValor("editId", id);
  setValor("editFirst_name", first_name);
  setValor("editLast_name", last_name);
  setValor("editUsername", username);
  setValor("editEmail", email);
  editandoId = id;
  getId("btnEditar").disabled = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.buscarPorId = function () {
  const id = getValor("searchId");
  if (!id) {
    alert("Ingresa un ID");
    return;
  }

  fetch(`${API_URL}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.user) {
        window.cargarEnFormularioEditar(
          data.user.id,
          data.user.first_name,
          data.user.last_name,
          data.user.username,
          data.user.email,
        );
        getId("searchId").value = "";
      } else {
        alert("Usuario no encontrado");
      }
    })
    .catch(() => alert("Error en la búsqueda"));
};

document.addEventListener("DOMContentLoaded", () => window.cargarUsuarios());

getId("formUsuario").addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = {
    first_name: getValor("first_name"),
    last_name: getValor("last_name"),
    username: getValor("username"),
    email: getValor("email"),
  };
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    getId("formUsuario").reset();
    window.cargarUsuarios();
  } catch (error) {
    alert("Error al crear el usuario");
  }
});

getId("formEditar").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!editandoId) {
    alert("Carga un usuario primero");
    return;
  }
  const datos = {
    first_name: getValor("editFirst_name"),
    last_name: getValor("editLast_name"),
    username: getValor("editUsername"),
    email: getValor("editEmail"),
  };
  try {
    await fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    getId("formEditar").reset();
    editandoId = null;
    getId("btnEditar").disabled = true;
    window.cargarUsuarios();
    alert("Usuario editado correctamente");
  } catch (error) {
    alert("Error al editar el usuario");
  }
});
