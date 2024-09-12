class RecintosZoo {

    analisaRecintos(animal, quantidade) {
    }

}

// Definição dos recintos existentes
const recintos = [
    { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
    { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
    { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
    { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
    { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] }
];

// Definição dos animais habilitados
const animaisPermitidos = {
    LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
    LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
    CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
    MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
    GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
    HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
};

// Função principal para verificar recintos viáveis
function encontrarRecintosViaveis(especie, quantidade) {
    // Validar entrada
    if (!animaisPermitidos[especie]) {
        return "Animal inválido";
    }
    if (isNaN(quantidade) || quantidade <= 0) {
        return "Quantidade inválida";
    }

    const animalInfo = animaisPermitidos[especie];
    const tamanhoNecessario = quantidade * animalInfo.tamanho;

    const recintosViaveis = recintos.filter(recinto => {
        const animaisExistentes = recinto.animaisExistentes;
        let espacoOcupado = animaisExistentes.reduce((total, animal) => {
            return total + animal.quantidade * animaisPermitidos[animal.especie].tamanho;
        }, 0);
        
        // Verifica se o bioma do recinto é compatível
        if (!animalInfo.biomas.includes(recinto.bioma) && recinto.bioma !== 'savana e rio') {
            return false;
        }

        // Verifica se o recinto tem espaço suficiente
        const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
        if (espacoLivre < tamanhoNecessario) {
            return false;
        }

        // Regra para carnivoros: só podem habitar com a própria espécie
        if (animalInfo.carnivoro && animaisExistentes.length > 0 && animaisExistentes[0].especie !== especie) {
            return false;
        }

        // Regra para hipopotamos: só convivem com outras espécies em bioma "savana e rio"
        if (especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && animaisExistentes.length > 0) {
            return false;
        }

        // Regra para macacos: não podem ficar sozinhos
        if (especie === 'MACACO' && animaisExistentes.length === 0 && quantidade === 1) {
            return false;
        }

        // Verifica se os animais existentes continuarão confortáveis com os novos
        for (const animal of animaisExistentes) {
            const especieExistente = animaisPermitidos[animal.especie];
            if (especieExistente.carnivoro && especieExistente.especie !== especie) {
                return false;
            }
        }

        // Considerar espaço extra se houver mais de uma espécie no recinto
        if (animaisExistentes.length > 0 && !animaisExistentes.some(animal => animal.especie === especie)) {
            espacoOcupado += 1;
        }

        return espacoLivre >= tamanhoNecessario + (animaisExistentes.length > 0 ? 1 : 0);
    });

    // Ordenar recintos viáveis e formatar a resposta
    if (recintosViaveis.length === 0) {
        return "Não há recinto viável";
    }

    return recintosViaveis.map(recinto => {
        const espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => {
            return total + animal.quantidade * animaisPermitidos[animal.especie].tamanho;
        }, 0);
        const espacoLivre = recinto.tamanhoTotal - espacoOcupado - (recinto.animaisExistentes.length > 0 ? 1 : 0);
        return `Recinto nro ${recinto.numero} (espaço livre: ${espacoLivre}, total: ${recinto.tamanhoTotal})`;
    });
}

// Exemplos de uso:
console.log(encontrarRecintosViaveis('LEAO', 1)); // Deve indicar os recintos disponíveis para o leão
console.log(encontrarRecintosViaveis('MACACO', 2)); // Deve indicar os recintos disponíveis para os macacos
console.log(encontrarRecintosViaveis('CROCODILO', 3)); // Deve indicar os recintos disponíveis para os crocodilos
console.log(encontrarRecintosViaveis('HIPOPOTAMO', 1)); // Deve indicar os recintos disponíveis para o hipopótamo
console.log(encontrarRecintosViaveis('ELEFANTE', 1)); // Deve retornar "Animal inválido"


export { RecintosZoo as RecintosZoo };
