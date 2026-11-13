```javascript
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

function atualizarSimulador(materialKey, botaoClicado) {
    const botoes = document.querySelectorAll(".sim-btn");
    botoes.forEach(btn => btn.classList.remove("active"));
    botaoClicado.classList.add("active");

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
}
