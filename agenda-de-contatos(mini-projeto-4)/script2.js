const mudaCategoria = document.getElementById("btn_addCategoria");
const inputCategoria = document.getElementById("categoria");

mudaCategoria.addEventListener("click", function () {
  const categoriaValue = inputCategoria.value.trim();

  if (categoriaValue === "") {
    alert("Por favor, insira uma categoria válida.");
    return;
  }

  let newOption = new Option(categoriaValue, categoriaValue.toLowerCase());

  const select = document.getElementById("tipo_contato");
  select.add(newOption);

  // Limpa o campo de entrada
  inputCategoria.value = "";
  alert("Categoria adicionada.");
});

const deletaCategoria = document.getElementById("btn_removeCatagoria");

deletaCategoria.addEventListener("click", function () {
  const categoriaValue = inputCategoria.value.trim();

  if (categoriaValue === "") {
    alert("Por favor, insira uma categoria válida.");
    return;
  }

  const select = document.getElementById("tipo_contato");

  const optionToDelete = select.querySelector(
    `option[value="${categoriaValue.toLowerCase()}"]`
  );

  if (optionToDelete) {
    optionToDelete.remove();
    alert("Categoria deletada com sucesso.");
    return;
  }

  alert("Categoria não encontrada.");
});
