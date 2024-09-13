class RecintosZoo {

    analisaRecintos(animal, quantidade) {
         return encontrarRecintosViaveis(animal, quantidade)
    }

}

// Descrição dos recintos
const recintos = [
    { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
    { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
    { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
    { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
    { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] }
];

// Descrição dos animais
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
        return {erro: "Animal inválido"};
    }
    if (isNaN(quantidade) || quantidade <= 0) {
        return {erro: "Quantidade inválida"};
    }

    let resposta = {
        recintosViaveis: []
    }

    let animalInfo = animaisPermitidos[especie];
    let tamanhoNecessario = quantidade * animalInfo.tamanho;

    //verifica se o recinto é do bioma que o animal precisa
     recintos.forEach(recinto => {
        if (!animalInfo.biomas.some(bioma => recinto.bioma.includes(bioma))){
            return
        }
        
        //Calcula o espaço livre 
        let espacoLivre = recinto.tamanhoTotal - recinto.animaisExistentes.reduce((soma, animal) => soma + (animal.quantidade * animaisPermitidos[animal.especie].tamanho), 0)

        //se houver espécies diferentes é ocupado um espaço extra
        if (recinto.animaisExistentes.length >= 1 && recinto.animaisExistentes.some(animal => animal.especie != especie)) {
            espacoLivre -= 1
        }

        //Verifica se há espaço livre para os animais
        if (espacoLivre < (animalInfo.tamanho * quantidade)){
            return 
        }

        //Verifica se o animal é carnívoro e se ele pode ficar no recinto
        if (animalInfo.carnivoro && recinto.animaisExistentes.some(animal => animal.especie != especie)){
            return 
        }

        //Se não for carnívoro, verifica se há carnívoros no recinto
        if (!animalInfo.carnivoro && recinto.animaisExistentes.some(animal => animaisPermitidos[animal.especie].carnivoro)){
            return
        }

        //Verifica de o hipopótamo pode compatilhar esse recinto
        if (especie == 'HIPOPOTAMO' && recinto.animaisExistentes.length > 1 && recinto.bioma != 'savana e rio'){
            return
        }

        //Verifica se o macaco tem companhia
        if (especie == 'MACACO' && recinto.animaisExistentes.length == 0 && quantidade == 1){
            return
        }

        //Adiciona recinto na resposta
        resposta.recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - (animalInfo.tamanho * quantidade)} total: ${recinto.tamanhoTotal})`)
    });

    //Se não tiver recinto viável retorna erro
    if (resposta.recintosViaveis.length == 0){
        return {
            erro: 'Não há recinto viável'
        }
    }

    return resposta 
}

export { RecintosZoo as RecintosZoo };
