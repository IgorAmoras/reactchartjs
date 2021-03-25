/* Usando funções do gráfico 
*
*  Precisamos receber a instância do gráfico por referência para assim poder altera-las
*
*  Para entender mellhor como é feita a manipulação recomendo que faça um console.log na 
*  referência do gráfico. 
*  => console.log(mainGraph.current.chartInstance) 
*
*  A grande jogada do ChartJs é trabalhar seus dados como sendo vetores, assim todas
*  as funções proprietárias do JavaScript já estão incorporadas, facilitando assim o
*  seu uso. 
*
*/

//Essa função adiciona um valor, passado pela chamada da função ao gráfico
// Sempre que se for referenciar o gráfico é necessário verificar se sua referência já foi instanciada
// no componente principal, isso é, na página, caso contrário ocorrerá um erro. 
export function updateData(mainGraph, data, line) {
    if(!(mainGraph?.current?.chartInstance)) return
        // Checa a instanciação do gráfico
        // chartInstance é onde está, efetivamente, a chamada para o gráfico, dentro deste pode se ter acesso 
        // aos dados já criados, alterando seus valores.
        mainGraph.current.chartInstance.data.datasets[line].data.push(data);// Datasets é onde estão salvos os dados
                                                                            // do eixo y, para acessar e alterar seu
                                                                            // valor é preciso usar a posição do vetor 
                                                                            // e dentro dela acessar sua componente
                                                                            // "data", que também é um vetor.
                                                                            // Desta maneira podemos usar as funções
                                                                            // de um vetor normal.

        mainGraph.current.chartInstance.update(); // Toda vez que se altera os valores do gráfico é preciso chamar a 
                                                  // função update(), isso pela definição do ChartJs
  }

// É interessante que exista uma função separada para adicionar o nome da componente x do gráfico, isso pois 
// como essa componente é compartilhada entre todos os conjuntos de dados do gráfico, basta adiciona-la uma
// vez que todos os componentes perceberam a diferença e evita erros de lógica, como adicionar mais de uma vez

export function dataName(mainGraph, label){
    if(!(mainGraph?.current?.chartInstance)) return 
        mainGraph.current.chartInstance.data.labels.push(label); // Aqui é o trecho onde se atualiza
                                                                 // o eixo x do gráfico.
        mainGraph.current.chartInstance.update();
  }

//A lógica por trás das próximas funções é a mesma, acessasse os componentes a serem alterados e é usado
// as próprias funções Javascript para brincar com o gráfico

export function eraseFirstData(mainGraph){
    if(!(mainGraph?.current?.chartInstance)) return 
        mainGraph.current.chartInstance.data.labels.shift();
        mainGraph.current.chartInstance.data.datasets.forEach(elem => {
            elem.data.shift();
        });
        mainGraph.current.chartInstance.update();
}

export function eraseLastData(mainGraph){
    if(!(mainGraph?.current?.chartInstance)) return 
        mainGraph.current.chartInstance.data.labels.pop();
        mainGraph.current.chartInstance.data.datasets.forEach(elem => {
            elem.data.pop();
        });
        mainGraph.current.chartInstance.update();
}

export function reverseData(mainGraph){
    if(!(mainGraph?.current?.chartInstance)) return 
        mainGraph.current.chartInstance.data.labels.reverse();
        mainGraph.current.chartInstance.data.datasets.forEach(elem => {
            elem.data.reverse();
        });
        mainGraph.current.chartInstance.update();
}

export function addManualData(mainGraph){
    if(!(mainGraph?.current?.chartInstance)) return 
        var labelName = prompt('Digite o nome da label:') 
        var labelData = prompt('Digite o valor:');
        mainGraph.current.chartInstance.data.labels.push(labelName);
        mainGraph.current.chartInstance.data.datasets.forEach(elem => {
            elem.data.push(labelData);
        });
        mainGraph.current.chartInstance.update();
}

