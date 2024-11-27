const apiBaseUrl = "https://zenlife-u3or.onrender.com/api/"; // Altere para o URL da sua API

async function submitForm(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const formData = {
    peso: document.getElementById("peso").value,
    height: document.getElementById("altura").value,
    nivel_atividade: document.getElementById("diasDisponibilidade").value,
    tipo_exercicio: document.getElementById("tipoExercicio").value,
    tempo: document.getElementById("tempoDisponivel").value,
    lesao: document.getElementById("regiaoRestricao").value,
    area_desenvolvimento: document.getElementById("areasMusculares").value,
    duracao_rotina: document.getElementById("duracao").value,
  };

  try {
    const response = await fetch(`${apiBaseUrl}rotina/`, {
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
      ).innerText = `Rotina criada com sucesso!`;

      setTimeout(() => {
        window.location.href = "menu.html";
      }, 2000);
    }
  } catch (error) {
    document.getElementById(
      "result"
    ).innerText = `Erro ao gerar rotina: ${error.message}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRotina();
});

async function fetchRotina() {
  try {
    const response = await fetch(`${apiBaseUrl}rotina/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }); // Substitua pela URL do seu endpoint

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const rotina = await response.json();

    // Verifica se a rotina foi recebida com sucesso
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

  rotina.rotina[9].treinos.forEach((treino, index) => {
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
              Tempo: ${exercicio.tempo} min
          `;
      exercicioList.appendChild(exercicioItem);
    });
    treinoCard.appendChild(exercicioList);

    // Botão para informações detalhadas
    const infoButton = document.createElement("button");
    infoButton.textContent = "Informações Treino";
    infoButton.classList.add("info-button");
    infoButton.onclick = () => {
      // Redirecionar para uma nova página ou tela
    window.location.href = `/informacoes-treino/${index + 1}`;
};
treinoCard.appendChild(infoButton);

    container.appendChild(treinoCard);
  });
}

// Função para deslogar o usuário
function deslogarUsuario() {
  // Fazendo uma requisição para a rota /deslogarusuario no servidor
  fetch(`${apiBaseUrl}/deslogar`, {
    method: 'GET', // ou 'POST', dependendo da sua API
    headers: {
      'Content-Type': 'application/json',
      // Adicione aqui o token de autenticação se necessário
      // 'Authorization': 'Bearer ' + token 
    },
  })
    .then(response => {
      if (response.ok) {
        // Se a resposta for bem-sucedida, limpar dados do usuário (como cookies, localStorage ou sessionStorage)
        // Ou se os dados estiverem em cookies, você pode apagá-los assim
        document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirecionar para a página 'index.html' após deslogar
        window.location.href = '/index'; // ou '/index.html' se for um arquivo HTML estático
      } else {
        // Se houve algum erro ao deslogar
        alert('Erro ao deslogar. Tente novamente.');
      }
    })
    .catch(error => {
      console.error('Erro ao deslogar:', error);
      alert('Erro de conexão. Tente novamente.');
    });
}

// Exemplo de como chamar a função ao clicar em um botão
document.getElementById('btnDeslogar').addEventListener('click', deslogarUsuario);

