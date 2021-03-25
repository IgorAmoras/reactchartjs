// Por motivos de simplicidade vou renderizar o conteúdo aqui, direto na raíz do projeto React. 
import React, { useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useMediaQuery } from 'beautiful-react-hooks';
// Para importar diferentes tipos de gráfico basta interpolar o nome do gráfico a ser utilizado
// os gráficos existentes se encontram em https://www.chartjs.org/docs/latest/charts/
// Neste exemplo vou utlizar o Line pois é o de uso mais recorrente em projetos. 
import { dataName, eraseFirstData, updateData, reverseData, addManualData, eraseLastData } from './Functions/updateData'
import 'chartjs-plugin-annotation';

// Como o chartJs não é uma biblioteca originalmente feita para o React atual, vamos fazer alguns
// componentes que facilitem sua utilização quando o projeto é escalonado.
// Esse componente seguinte é onde será gerenciado os dados do gráfico, ele incialmente é estático,
// pois contém as predefinções a serem usadas no projeto, mas pode ser alterado em tempo real.
// (Ele é montado deste jeito pois é como o ChartJs é contruído)

const INITALLDATA = {
  type: 'line', // type é como o dado será interpretado, está ligado a qual gráfico você vai utilizar,
                // caso você use outro componete, basta entrar na documentação e ver qual tipo ele usa.

  labels:['Junho','abril', 'maio', 'março'], // Labels é a o que aparecerá na componente x do gráfico, na área
                // inferior. Ela utiliza um vetor para ler seus valores, caso queira que eles se atualizem
                // basta criar uma variável do tipo vetor e inseri-la aqui. 
  datasets: [ 
    // datasets é um vetor de objetos, dentro de cada objeto você pode definir como o dado será disposto
    // alterando componentes mais específicas para cada linha do gráfico 
    {
      fill: true, // É o preenchimento do gráfico, se for true a área sob o gráfico é preenchida.
      opacity: '10',
      label: 'Produtividade na CPE', // label é o título desse conjunto de dados, ele irá aperecer junto do gráfico
                          // para indicar quem é quem. Esse componente, ao ser clicado, dentro da aplicação,
                          // faz com que os dados sumam ou apareçam do gráfico.

      data: [10, 12, 15, 13], // Aqui é onde são definidos os dados de cada componente do eixo y. Essa 
                                  // componente funciona junto com a componente 'labels', pois juntas elas 
                                  // formam um par (x,y) onde => (labels, data). Os dados se organizam por
                                  // meio da posição no vetor, isso é, o primeiro valor em labels será 
                                  // associado ao primeiro valor em data.

      yAxisID:'left', // Essa componente define um id para que você possa escolher se os dados ficaram na parte 
                      // esquerda ou direita do gráfico
      borderColor: 'blue', // Define a cor da linha
      borderWidth: 3, // Define a espessura da linha
      pointRadius: 0, // Define o tamanho dos pontos onde é formado um par (x,y), 0 significa que não será mostrado
                      // nenhum ponto.
    },
    // Esse processo pode ser repetido para quantos dados seja necessário
    {
      label: 'Projetos de sistemas web',
      yAxisID: 'left',
      data:[10, 5, 15, 10],
      borderColor: 'red',
      borderWidth: 3,
      pointRadius: 1,
    },
    {
      label: 'Horas trabalhadas',
      yAxisID: 'right', // Diferente dos dados anteriores, esse utilizará a escala definida na parte direita do gráfico
                        // Isso será feito na chamada do gráfico
      data:[15, 18, 13, 5],
      borderColor: 'green',
      borderWidth: 3,
      pointRadius: 0,
    },
  ]
  }

  // Aqui eu apenas defino componentes CSS, por motivos de responsividade

  const styles = {
    container: isWideBased => ({
      width: isWideBased ? '60vw': '70vw', 
      paddingLeft: isWideBased ? '20vw': '15vw', 
      paddingTop: '10vh',
      position: 'relative', 
      display:'flex', 
      flexDirection:'column', 
      alignItems: 'center'
    })
  }
  const buttonsStyles = {
    container: elem =>({
      borderRadius: '10px', 
      color: 'whitesmoke', 
      backgroundColor: 'brown', 
      marginTop: '10px', 
      padding: '10px 10px 10px 10px',
    }),
    outainer: elem =>({
      borderRadius: '10px', 
      color: 'whitesmoke', 
      backgroundColor: 'red', 
      marginTop: '10px', 
      padding: '10px 10px 10px 10px',
    })
  }

const MainGraph = () => {
  const mainGraph = useRef(); // Para manipular as componentes internas do gráfico e executar ações sobre ele, como
                              // alterar seus dados por meio de um "push" iremos criar uma refêrencia para ele e chama-la 
                              // na definição do gráfico. É necessário importar o useRef. Ele é utilizado para evitar
                              // a re-renderização do gráfico quando alteramos os dados.    

  const [showAnnotation, setShowAnnotation] = useState(false) 
  const isWideBased = useMediaQuery('(min-width: 1920px)'); // chamada para mediaQuery inline baseado em React Hook

  return (
    <div style = {{position: 'absolute',display: 'flex', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: 'black'}}>

      <div style={styles.container(isWideBased)}>      

        <Line // Chamamos a componente do gráfico a ser renderizado na tela por meio da sua componente importada, no nosso
              // caso <Line />, mas pode ser de qualquer tipo, como por exemplo <Bar />. Aqui iremos definir aspectos visuais
              // do gráfico, como seu posicionamento, tamanho e et cetera. 
              
          id="main-graph" 
          data={INITALLDATA} // Aqui deve ser inserida a variável definida anteriormente, com os dados as serem utilizados.
          ref={mainGraph} // Criar a referência pro gráfico dentro da variável mainGraph
          options={{ 
            annotation:{
              annotations:[
                  showAnnotation &&{
                  drawTime: "afterDatasetsDraw",
                  type: "line",
                  mode: "vertical",
                  scaleID: "x-axis-0",
                  value: 'abril',
                  borderWidth: 2,
                  borderColor: "silver",
                  label: {
                    content: "Annotation",
                    enabled: true,
                    position: "bottom"
                  }
                }
              ]
            },
            legend: { // A componente legend define onde as legendas do gráfico ficarão, pode ser alterado também o 
                      // espaçamento, tamanho da fonte e tipo
              position: 'bottom', // Tente mudar pra 'left', 'right' ou 'top'
              labels: {
                padding: 20,
                fontSize: 16,
              },
            },
            responsive: true,
            maintainAspectRatio: true,  // As componentes responsive e maintainAspectRatio são referentes à responsividade
                                        // responsive, por padrão, é true, e ele faz com que o gráfico altere seu tamanho 
                                        // junto da div pai a qual pertence. maintainAspectRation é referente ao tamanho 
                                        // do gráfico. Caso seja true, irá ocupar todo o espaço da div, caso seja false
                                        // é possível definir o valores do gráfico manualmente. 
                                        // Recomendo FORTEMENTE que não trabalhem com valores manuais dentro do gráfico, 
                                        // mas sim, alterem o tamanho da sua DIV pai, facilitando, e muito a sua vida.

            title: { //Define o título do gráfico e como ele irá se comportar
              text: 'Gráfico da CPE', 
              fontSize: 30,
              fontColor: 'rgb(215,215,215)',
              fontFamily: 'Times New Roman',
              display: true //Essa componente serve para controlar se o título irá aparecer ou não
            },

            elements: {
              line: {
                  tension: 0 // Tension é a "suavização" do gráfico, por default é 0.4, onde o gráfico
                            // é mais curvado ao chegar perto do pontos, 0 é um gráfico reto.
                            // É possivel definir a curva em cada dataset por meio da variável "lineTension"
              }
          },
            scales: { // Aqui é definido o valor das escalas nos eixos x e y, assim como sua abrangência
                      // valor mínimo e máximo

              yAxes: [{ // Intuitivamente, neste objeto são definidos os parametros do eixo y.
                    gridLines: { display: true, color: 'rgba(215,215,215,0.3)' },
                    id: 'left', // Aqui é defindo o id do eixo, ele parametriza os dados que tiverem 
                                // a componente yAxesId como sendo 'left'

                    position:'left',// Aqui é definido onde ficará o eixo, isso é na esquerda ou direita
                    ticks: {// Na componente Ticks é definido os valores de máximo e mínimo da escala, assim 
                            // como qual sua taxa de crescimento, na componente stepSize.
                      min: 0,
                      max: 20,
                      stepSize: 2,
                    } 
                    },
                    {
                      id:'right', // Seguindo a mesma lógica da componente anterior, os dados com o id
                                  // 'right' serão organizados com base nessass definições.
                      position:'right',
                      ticks:{
                        max: 50,
                        min: 0,
                        stepSize: 5,
                      }
                    }
                ],
              xAxes: [ // Aqui ficam salvam as definições do eixo x
                {
                  gridLines: { display: true, color: 'rgba(215,215,215,0.3)' }, // Essa componente mostra as linhas de grade no gráfico.
                  ticks: {
                    autoSkip: true, // Limita o número máximo de x's no gráfico, se for false mostra todo
                                    // o conteúdo dentro de x.

                    maxTicksLimit:20, // Aqui é definido o número máximo de x que aparecerão simultaneamente
                                      // caso a definição anterior seja true

                    beginAtZero: true, // Apenas define se o valor começa em 0 ou não, se for true adiciona 
                                      // o valor 0 ao eixo
                  },
                },
              ],
            },
          }}
        />
        
        {/* Aqui embaixo são apenas instanciados botões com as funções definidas dentro da pasta functions, para entender, vá para aquele arquivo*/}
        <div style = {{ display: 'flex', width: '80vw', justifyContent: 'space-around', padding: '10px' }}>
          <button style={buttonsStyles.container()} onClick = {() => {updateData(mainGraph, Math.random()*20, 0); 
                                                                     updateData(mainGraph, Math.random()*20, 1);
                                                                     updateData(mainGraph, Math.random()*80, 2);
                                                                     dataName(mainGraph, 'Random Number'); }}>
            Adicionar dados aleatórios
          </button>

          <button style={buttonsStyles.container()} onClick ={() => eraseLastData(mainGraph)}>
            Retirar ultimo valor
          </button>
            
          <button style={buttonsStyles.container()} onClick ={() => eraseFirstData(mainGraph)}>
            Retirar primero valor
          </button>
          
          <button style={buttonsStyles.container()} onClick ={() =>reverseData(mainGraph)}>
            Inverter dados
          </button>

          <button style={buttonsStyles.container()} onClick ={() =>addManualData(mainGraph)}>
            Adicionar dados manualmente
          </button>

          <button style={buttonsStyles.container()} onClick ={() =>setShowAnnotation(!showAnnotation)}>
            Adicionar anotação
          </button>

        </div>
      </div>
    </div>
  );
}
export default MainGraph;
