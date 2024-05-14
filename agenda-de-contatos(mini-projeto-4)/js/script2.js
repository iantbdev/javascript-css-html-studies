const addCategoria = document.getElementById("btn_addCategoria");
const inputCategoria = document.getElementById("categoria");
const select = document.getElementById("tipo_contato");

document.addEventListener("DOMContentLoaded", function () {
  const selectTipoContato = document.getElementById("tipo_contato");

  fetch(
    "https://agenda-de-contatos-84164-default-rtdb.firebaseio.com/categorias.json"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha ao buscar categorias");
      }
      return response.json();
    })
    .then((data) => {
      for (let key in data) {
        const categoria = data[key];
        const option = new Option(
          categoria.nomeCategoria,
          categoria.nomeCategoria.toLowerCase()
        );
        selectTipoContato.appendChild(option);
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar categorias:", error);
    });
});

// evento ao cliclar no botão de adicionar categoria
addCategoria.addEventListener("click", function () {
  const categoriaValue = inputCategoria.value.trim();

  if (categoriaValue === "") {
    alert("Por favor, insira uma categoria válida.");
    return;
  }
  const categoriaDados = {
    nomeCategoria: categoriaValue,
  };
  addCategoriaBanco(categoriaDados)
    .then(() => {
      alert("Categoria adicionada com sucesso.");
      window.location = window.location; // reload da pagina para que as mudanças reflitam no select
    })
    .catch((error) => {
      console.error("Houve um problema ao adicionar a categoria:", error);
    });
  inputCategoria.value = "";
});

const deletaCategoria = document.getElementById("btn_removeCatagoria");

//evento ao clicar no botao de deletar categoria
deletaCategoria.addEventListener("click", function () {
  const categoriaValue = inputCategoria.value.trim();

  if (categoriaValue === "") {
    alert("Por favor, insira uma categoria válida.");
    return;
  }

  deletaCategoriaBanco(categoriaValue)
    .then(() => {
      const select = document.getElementById("tipo_contato");
      const optionToDelete = select.querySelector(
        `option[value="${categoriaValue.toLowerCase()}"]`
      );
      if (optionToDelete) {
        optionToDelete.remove();
        alert("Categoria deletada com sucesso.");
      } else {
        alert("Categoria não encontrada.");
      }
    })
    .catch((error) => {
      console.error("Houve um problema ao deletar a categoria:", error);
    });
  inputCategoria.value = "";
});

// função para deletar a categoria no banco de dados
function deletaCategoriaBanco(nomeCategoria) {
  return fetch(
    `https://agenda-de-contatos-84164-default-rtdb.firebaseio.com/categorias.json`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha ao buscar categorias");
      }
      return response.json();
    })
    .then((data) => {
      // itera sobre as categorias para encontrar o id da categoria com o nome correspondente
      let categoriaId = null;
      for (let key in data) {
        if (data[key].nomeCategoria === nomeCategoria) {
          categoriaId = key;
          break;
        }
      }

      if (!categoriaId) {
        throw new Error("Categoria não encontrada");
      }
      // após achado o id da categoria é possível deletá-la do banco
      return fetch(
        `https://agenda-de-contatos-84164-default-rtdb.firebaseio.com/categorias/${categoriaId}.json`,
        {
          method: "DELETE",
        }
      ).then((response) => {
        if (!response.ok) {
          throw new Error("Resposta de rede não foi ok");
        }
      });
    });
}

// função para adicionar categoria no banco de dados
function addCategoriaBanco(categoriaDados) {
  return fetch(
    "https://agenda-de-contatos-84164-default-rtdb.firebaseio.com/categorias.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoriaDados),
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Resposta de rede não foi ok");
    }
  });
}
