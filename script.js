document.addEventListener("DOMContentLoaded", () => {
    // 1. Animação de entrada suave dos elementos conforme o usuário rola a página
    const revealElements = document.querySelectorAll(".reveal");

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 2. Dados científicos para o Simulador de Comportamento Óptico
    const materialsData = {
        asfalto: {
            title: "Asfalto / Superfície Preta",
            desc: "Alta retenção do espectro visível, convertendo quase toda a radiação incidente em energia térmica (aquecimento intenso).",
            abs: 90,
            ref: 10,
            tra: 0
        },
        espelho: {
            title: "Superfície Metálica / Branca",
            desc: "Reflete a maior parte dos comprimentos de onda visíveis, evitando o superaquecimento da superfície.",
            abs: 15,
            ref: 85,
            tra: 0
        },
        cobertura: {
            title: "Cobertura Transparente (Piscina)",
            desc: "Permite a passagem da luz visível (transmissão) para aquecer a água e bloqueia a fuga de calor infravermelho.",
            abs: 12,
            ref: 8,
            tra: 80
        }
    };

    // 3. Controle interativo dos botões do simulador
    const buttons = document.querySelectorAll(".sim-btn");
    const simTitle = document.getElementById("simTitle");
    const simDesc = document.getElementById("simDesc");
    
    const valAbs = document.getElementById("valAbs");
    const valRef = document.getElementById("valRef");
    const valTra = document.getElementById("valTra");

    const barAbs = document.getElementById("barAbs");
    const barRef = document.getElementById("barRef");
    const barTra = document.getElementById("barTra");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove destaque do botão anterior e ativa o clicado
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Atualiza textos e barras animadas
            const key = btn.getAttribute("data-material");
            const data = materialsData[key];

            simTitle.textContent = data.title;
            simDesc.textContent = data.desc;

            valAbs.textContent = `${data.abs}%`;
            valRef.textContent = `${data.ref}%`;
            valTra.textContent = `${data.tra}%`;

            barAbs.style.width = `${data.abs}%`;
            barRef.style.width = `${data.ref}%`;
            barTra.style.width = `${data.tra}%`;
        });
    });
});
