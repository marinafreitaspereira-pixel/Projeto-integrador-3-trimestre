```javascript
document.addEventListener("DOMContentLoaded", () => {
    // 1. Controle automático do espaço reservado da imagem ("A SER COLOCADA")
    const projectImage = document.getElementById("projectImage");
    const imageFrame = document.getElementById("imageFrame");

    if (projectImage && imageFrame) {
        projectImage.addEventListener("load", () => {
            imageFrame.classList.add("has-image");
        });

        projectImage.addEventListener("error", () => {
            projectImage.style.display = "none";
        });

        // Caso a imagem já esteja carregada no cache
        if (projectImage.complete && projectImage.naturalWidth > 0) {
            imageFrame.classList.add("has-image");
        }
    }

    // 2. Dados do Simulador de Comportamento Óptico
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

    // 3. Eventos de clique nos botões do simulador
    const botoes = document.querySelectorAll(".sim-btn");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            botao.classList.add("active");

            const materialKey = botao.getAttribute("data-material");
            const dados = materialsData[materialKey];
            if (!dados) return;

            document.getElementById("simTitle").textContent = dados.title;
            document.getElementById("simDesc").textContent = dados.desc;

            document.getElementById("valAbs").textContent = dados.abs + "%";
            document.getElementById("valRef").textContent = dados.ref + "%";
            document.getElementById("valTra").textContent = dados.tra + "%";

            document.getElementById("barAbs").style.width = dados.abs + "%";
            document.getElementById("barRef").style.width = dados.ref + "%";
            document.getElementById("barTra").style.width = dados.tra + "%";
        });
    });
});
