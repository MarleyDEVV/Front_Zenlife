const apiBaseUrl = "http://127.0.0.1:8080/api/"; // Altere para o URL da sua API

async function cadastrar(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const formData = {
    nome: document.getElementById("nome").value,
    login: document.getElementById("email").value,
    senha: document.getElementById("senha").value,
    senha2: document.getElementById("senha2").value,
    data_nasc: document.getElementById("dataNascimento").value,
    genero: document.getElementById("genero").value,
  };

  try {
    const response = await fetch(`${apiBaseUrl}user/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error({ Erro: `${response.status}` });
    }

    const result = await response.json();
    if (result) {
      document.getElementById("result").innerText =
        "Cadastro criado com sucesso!";

      setTimeout(() => {
        window.location.href = "Login.html";
      }, 2000);
    }
  } catch (error) {
    document.getElementById(
      "result"
    ).innerText = `Erro ao fazer cadastro: ${error.message}`;
  }
}
async function login(event) {
  event.preventDefault();
  const formData = {
    login: document.getElementById("email").value,
    senha: document.getElementById("senha").value,
  };

  try {
    const response = await fetch(`${apiBaseUrl}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const result = await response.json();

    if (result) {
      document.getElementById(
        "result"
      ).innerText = `Login realizado com sucesso!`;

      const user = await getUserByEmail(formData.login); // Aguarda o resultado
      const idUser = user.id; // Acessa o campo `id` do objeto retornado
      window.localStorage.setItem("usuarioId", idUser);

      // Redirecionar para a página principal após login
      setTimeout(() => {
        window.location.href = "menu.html";
      }, 2000);
    }
  } catch (error) {
    document.getElementById(
      "result"
    ).innerText = `Erro ao fazer login: ${error.message}`;
  }
}

// Função para buscar rotina
async function fetchRotina() {
  try {
    const response = await fetch(`${apiBaseUrl}rotina/all/${window.localStorage.getItem("usuarioId")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Indica que o corpo da requisição está em JSON
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const rotina = await response.json();

    if (rotina) {
      renderRotina(rotina);
    } else {
      document.getElementById("visualizar_rotina").innerHTML =
        "<p>Nenhuma rotina encontrada.</p>";
    }
  } catch (error) {
    console.error("Erro ao buscar a rotina:", error);
    document.getElementById("visualizar_rotina").innerHTML =
      "<p>Erro ao carregar a rotina.</p>";
  }
}
function renderRotina(rotina) {
  const container = document.getElementById("visualizar_rotina");
  container.innerHTML = ""; // Limpa o conteúdo antes de renderizar
  rotina.rotina[0].treinos.forEach((treino, index) => {
    // Criação do card de treino
    const treinoCard = document.createElement("div");
    treinoCard.classList.add("treino-card");
    // Adiciona o título do treino
    const treinoTitle = document.createElement("h3");
    treinoTitle.textContent = `Treino ${index + 1} - Duração: ${
      treino.duracao
    } min`;
    treinoCard.appendChild(treinoTitle);
    // Lista de exercícios
    const exercicioList = document.createElement("ul");
    treino.exercicios.forEach((exercicio) => {
      const exercicioItem = document.createElement("li");
      exercicioItem.innerHTML = `
              <strong>${exercicio.foco_exercicio}</strong><br>
              Tipo: ${exercicio.tipo_exercicio}<br>
              Séries: ${exercicio.serie} x ${exercicio.repeticao} repetições<br>
              Tempo: ${exercicio.tempo} segundos
          `;
      exercicioList.appendChild(exercicioItem);
    });
    treinoCard.appendChild(exercicioList);
    container.appendChild(treinoCard);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  fetchRotina();
});
async function deslogarUsuario() {
  try {
    // Opcional: faça a requisição de logout ao backend, se necessário
    const response = await fetch(`${apiBaseUrl}deslogar`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Erro ao deslogar. Status: ${response.status}`);
    }

    // Limpa o localStorage
    window.localStorage.clear();

    // Redirecionar para a página de login
    window.location.href = "Login.html";
  } catch (error) {
    console.error("Erro ao deslogar o usuário:", error);
    alert("Não foi possível deslogar. Tente novamente.");
  }
}

// Submeter formulário com autenticação
async function submitForm(event) {
  event.preventDefault();

  // Dados do formulário
  const formData = {
    peso: document.getElementById("peso").value,
    height: document.getElementById("altura").value,
    nivel_atividade: document.getElementById("diasDisponibilidade").value,
    tipo_exercicio: document.getElementById("tipoExercicio").value,
    tempo: document.getElementById("tempoDisponivel").value,
    lesao: document.getElementById("regiaoRestricao").value,
    area_desenvolvimento: document.getElementById("areasMusculares").value,
    duracao_rotina: document.getElementById("duracao").value,
    id: window.localStorage.getItem("usuarioId"),
  };
  showLoader();
  try {
    const response = await fetch(`${apiBaseUrl}rotina`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indica que o corpo da requisição está em JSON
      },
      body: JSON.stringify(formData), // Converte os dados para JSON
    });
    hideLoader();
    // Verificar se a resposta não foi bem-sucedida
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Não autorizado. Por favor, faça login novamente.");
      } else {
        throw new Error(`Erro: ${response.status}`);
      }
    }

    const result = await response.json();

    if (result) {
      // Sucesso ao criar a rotina
      document.getElementById(
        "result"
      ).innerText = `Rotina criada com sucesso!`;

      // Redirecionar para o menu após 2 segundos
      setTimeout(() => {
        window.location.href = "menu.html";
      }, 2000);
    }
  } catch (error) {
    // Exibir mensagem de erro
    hideLoader();
    document.getElementById(
      "result"
    ).innerText = `Erro ao gerar rotina: ${error.message}`;
  }
}

async function getUserByEmail(email) {
  const response = await fetch(`${apiBaseUrl}user/email/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Indica que o corpo da requisição está em JSON
    },
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP! Status: ${response.status}`);
  }

  const rotina = await response.json();

  return rotina;
}

function showLoader() {
  document.getElementById("result").innerText = "Carregando...";
}

function hideLoader() {
  document.getElementById("result").innerText = "";
}
