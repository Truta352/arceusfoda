/* =========================================================
   ARCEUS — interações do site
   Para trocar os contatos, altere só o objeto CONFIG abaixo.
   ========================================================= */

const CONFIG = {
  whatsapp: "5531998623087",      // DDI + DDD + número, só dígitos
  email: "arceus@gmail.com",
};

document.addEventListener("DOMContentLoaded", () => {
  aplicarContatos();
  menuCelular();
  linkAtivoNoMenu();
  animacaoAoRolar();
  botaoVoltarAoTopo();
  servicoPelosCartoes();
  formularioDeContato();

  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
});

/* ---------- Contatos vindos do CONFIG ---------- */
function aplicarContatos() {
  document.querySelectorAll('[data-contato="whatsapp"]').forEach((a) => {
    a.href = `https://wa.me/${CONFIG.whatsapp}`;
  });
  document.querySelectorAll('[data-contato="email"]').forEach((a) => {
    a.href = `mailto:${CONFIG.email}`;
  });
}

/* ---------- Menu do celular ---------- */
function menuCelular() {
  const botao = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  if (!botao || !menu) return;

  const fechar = () => {
    menu.classList.remove("is-open");
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
  };

  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("is-open");
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  // Fecha ao clicar em um link, ao apertar Esc ou ao clicar fora
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", fechar));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      fechar();
      botao.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !botao.contains(e.target)) fechar();
  });
}

/* ---------- Destaca no menu a seção que está na tela ---------- */
function linkAtivoNoMenu() {
  const links = [...document.querySelectorAll(".nav__link")];
  const secoes = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window) || !secoes.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const id = "#" + entrada.target.id;
        links.forEach((l) => {
          const ativo = l.getAttribute("href") === id;
          l.classList.toggle("is-active", ativo);
          if (ativo) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  secoes.forEach((s) => observer.observe(s));
}

/* ---------- Elementos aparecem ao rolar ---------- */
function animacaoAoRolar() {
  const itens = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    itens.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  itens.forEach((el) => observer.observe(el));
}

/* ---------- Botão "voltar ao topo" ---------- */
function botaoVoltarAoTopo() {
  const botao = document.getElementById("voltar-topo");
  if (!botao) return;
  const atualizar = () => { botao.hidden = window.scrollY < 600; };
  window.addEventListener("scroll", atualizar, { passive: true });
  atualizar();
  botao.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector(".brand")?.focus({ preventScroll: true });
  });
}

/* ---------- "Pedir orçamento" de um cartão já escolhe o serviço ---------- */
function servicoPelosCartoes() {
  const select = document.getElementById("ct-servico");
  document.querySelectorAll("[data-servico]").forEach((link) => {
    link.addEventListener("click", () => {
      if (select) select.value = link.dataset.servico;
      setTimeout(() => document.getElementById("ct-nome")?.focus({ preventScroll: true }), 500);
    });
  });
}

/* ---------- Formulário de contato ---------- */
function formularioDeContato() {
  const form = document.getElementById("form-contato");
  if (!form) return;
  const status = document.getElementById("form-status");

  const campos = {
    nome: form.elements.nome,
    contato: form.elements.contato,
    mensagem: form.elements.mensagem,
  };

  const regras = {
    nome: (v) => (v.trim().length >= 2 ? "" : "Informe seu nome."),
    contato: (v) => (ehEmail(v) || ehTelefone(v) ? "" : "Informe um e-mail ou telefone válido."),
    mensagem: (v) => (v.trim().length >= 10 ? "" : "Conte um pouco mais (mínimo de 10 caracteres)."),
  };

  const validarCampo = (nome) => {
    const erro = regras[nome](campos[nome].value);
    const caixa = campos[nome].closest(".field");
    const msg = document.getElementById(`erro-${nome}`);
    caixa.classList.toggle("has-error", !!erro);
    campos[nome].setAttribute("aria-invalid", erro ? "true" : "false");
    if (erro) campos[nome].setAttribute("aria-describedby", `erro-${nome}`);
    msg.textContent = erro;
    return !erro;
  };

  // Valida enquanto a pessoa corrige
  Object.keys(campos).forEach((nome) => {
    campos[nome].addEventListener("blur", () => validarCampo(nome));
    campos[nome].addEventListener("input", () => {
      if (campos[nome].closest(".field").classList.contains("has-error")) validarCampo(nome);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form__status";

    const resultados = Object.keys(campos).map(validarCampo);
    if (resultados.includes(false)) {
      const primeiroErro = Object.keys(campos).find((n) => regras[n](campos[n].value) !== "");
      campos[primeiroErro]?.focus();
      status.textContent = "Confira os campos marcados.";
      status.classList.add("is-error");
      return;
    }

    const dados = {
      nome: campos.nome.value.trim(),
      contato: campos.contato.value.trim(),
      servico: form.elements.servico.value,
      mensagem: campos.mensagem.value.trim(),
    };
    const canal = form.elements.canal.value;

    const texto =
      `Olá, Arceus! Gostaria de um orçamento.\n\n` +
      `Nome: ${dados.nome}\n` +
      `Contato: ${dados.contato}\n` +
      `Serviço: ${dados.servico}\n\n` +
      `${dados.mensagem}`;

    if (canal === "whatsapp") {
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
      status.textContent = "Abrimos o WhatsApp com sua mensagem pronta. É só tocar em enviar.";
    } else {
      const assunto = `Orçamento — ${dados.servico}`;
      window.location.href =
        `mailto:${CONFIG.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(texto)}`;
      status.textContent = "Abrimos seu aplicativo de e-mail com a mensagem pronta.";
    }
    status.classList.add("is-ok");
    form.reset();
    Object.keys(campos).forEach((n) => campos[n].removeAttribute("aria-invalid"));
  });
}

function ehEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

function ehTelefone(v) {
  const digitos = v.replace(/\D/g, "");
  return digitos.length >= 10 && digitos.length <= 13;
}
