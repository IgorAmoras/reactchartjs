// Por motivos de simplicidade vou renderizar o conteúdo aqui, direto na raíz do projeto React.
import React, { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { useMediaQuery } from "beautiful-react-hooks";
// Para importar diferentes tipos de gráfico basta interpolar o nome do gráfico a ser utilizado
// os gráficos existentes se encontram em https://www.chartjs.org/docs/latest/charts/
// Neste exemplo vou utlizar o Line pois é o de uso mais recorrente em projetos.
import { addManualData, eraseLastData } from "./Functions/graphFunctions";
import "chartjs-plugin-annotation";
import "./styles/App.css";
require("typeface-quicksand");

// Como o chartJs não é uma biblioteca originalmente feita para o React atual, vamos fazer alguns
// componentes que facilitem sua utilização quando o projeto é escalonado.
// Esse componente seguinte é onde será gerenciado os dados do gráfico, ele incialmente é estático,
// pois contém as predefinções a serem usadas no projeto, mas pode ser alterado em tempo real.
// (Ele é montado deste jeito pois é como o ChartJs é contruído)
const INITALLDATA = {
  type: "line", // type é como o dado será interpretado, está ligado a qual gráfico você vai utilizar,
  // caso você use outro componete, basta entrar na documentação e ver qual tipo ele usa.

  labels: ["15/10", "19/10", "21/10", "25/10", "27/10", "29/10"], // Labels é a o que aparecerá na componente x do gráfico, na área
  // inferior. Ela utiliza um vetor para ler seus valores, caso queira que eles se atualizem
  // basta criar uma variável do tipo vetor e inseri-la aqui.
  datasets: [
    // datasets é um vetor de objetos, dentro de cada objeto você pode definir como o dado será disposto
    // alterando componentes mais específicas para cada linha do gráfico
    {
      fill: true, // É o preenchimento do gráfico, se for true a área sob o gráfico é preenchida.
      opacity: "10",
      label: "Pontos da sprint", // label é o título desse conjunto de dados, ele irá aperecer junto do gráfico
      // para indicar quem é quem. Esse componente, ao ser clicado, dentro da aplicação,
      // faz com que os dados sumam ou apareçam do gráfico.

      data: [92, 61, 56], // Aqui é onde são definidos os dados de cada componente do eixo y. Essa
      // componente funciona junto com a componente 'labels', pois juntas elas
      // formam um par (x,y) onde => (labels, data). Os dados se organizam por
      // meio da posição no vetor, isso é, o primeiro valor em labels será
      // associado ao primeiro valor em data.
      //Pode ser um vetor, ou valor vazio também, não precisa ser um valor estático.

      yAxisID: "left", // Essa componente define um id para que você possa escolher se os dados ficaram na parte
      // esquerda ou direita do gráfico
      borderColor: "blue", // Define a cor da linha
      borderWidth: 4, // Define a espessura da linha
      pointRadius: 3, // Define o tamanho dos pontos onde é formado um par (x,y), 0 significa que não será mostrado
      // nenhum ponto. Preferencialmente não deixar no valor 0 pois nele não é possivel ver o valor
      // especifico desse ponto.
    },
    {
      fill: true, // É o preenchimento do gráfico, se for true a área sob o gráfico é preenchida.
      opacity: "20",
      label: "Precisão necessária da sprint", // label é o título desse conjunto de dados, ele irá aperecer junto do gráfico
      // para indicar quem é quem. Esse componente, ao ser clicado, dentro da aplicação,
      // faz com que os dados sumam ou apareçam do gráfico.

      data: [19, 19, 19, 19, 19, 19, 19], // Aqui é onde são definidos os dados de cada componente do eixo y. Essa
      // componente funciona junto com a componente 'labels', pois juntas elas
      // formam um par (x,y) onde => (labels, data). Os dados se organizam por
      // meio da posição no vetor, isso é, o primeiro valor em labels será
      // associado ao primeiro valor em data.
      //Pode ser um vetor, ou valor vazio também, não precisa ser um valor estático.

      yAxisID: "left", // Essa componente define um id para que você possa escolher se os dados ficaram na parte
      // esquerda ou direita do gráfico
      borderColor: "red", // Define a cor da linha
      borderWidth: 3, // Define a espessura da linha
      pointRadius: 0, // Define o tamanho dos pontos onde é formado um par (x,y), 0 significa que não será mostrado
      // nenhum ponto. Preferencialmente não deixar no valor 0 pois nele não é possivel ver o valor
      // especifico desse ponto.
    },
    {
      fill: false, // É o preenchimento do gráfico, se for true a área sob o gráfico é preenchida.

      label: "Pontos site Janaína", // label é o título desse conjunto de dados, ele irá aperecer junto do gráfico
      // para indicar quem é quem. Esse componente, ao ser clicado, dentro da aplicação,
      // faz com que os dados sumam ou apareçam do gráfico.

      data: [32, 18, 13], // Aqui é onde são definidos os dados de cada componente do eixo y. Essa
      // componente funciona junto com a componente 'labels', pois juntas elas
      // formam um par (x,y) onde => (labels, data). Os dados se organizam por
      // meio da posição no vetor, isso é, o primeiro valor em labels será
      // associado ao primeiro valor em data.
      //Pode ser um vetor, ou valor vazio também, não precisa ser um valor estático.

      yAxisID: "left", // Essa componente define um id para que você possa escolher se os dados ficaram na parte
      // esquerda ou direita do gráfico
      borderColor: "green", // Define a cor da linha
      borderWidth: 1, // Define a espessura da linha
      pointRadius: 0, // Define o tamanho dos pontos onde é formado um par (x,y), 0 significa que não será mostrado
      // nenhum ponto. Preferencialmente não deixar no valor 0 pois nele não é possivel ver o valor
      // especifico desse ponto.
    },
    {
      fill: false, // É o preenchimento do gráfico, se for true a área sob o gráfico é preenchida.
      opacity: "20",
      label: "Pontos site Aline", // label é o título desse conjunto de dados, ele irá aperecer junto do gráfico
      // para indicar quem é quem. Esse componente, ao ser clicado, dentro da aplicação,
      // faz com que os dados sumam ou apareçam do gráfico.

      data: [33, 16, 16], // Aqui é onde são definidos os dados de cada componente do eixo y. Essa
      // componente funciona junto com a componente 'labels', pois juntas elas
      // formam um par (x,y) onde => (labels, data). Os dados se organizam por
      // meio da posição no vetor, isso é, o primeiro valor em labels será
      // associado ao primeiro valor em data.
      //Pode ser um vetor, ou valor vazio também, não precisa ser um valor estático.

      yAxisID: "left", // Essa componente define um id para que você possa escolher se os dados ficaram na parte
      // esquerda ou direita do gráfico
      borderColor: "yellow", // Define a cor da linha
      borderWidth: 1, // Define a espessura da linha
      pointRadius: 0, // Define o tamanho dos pontos onde é formado um par (x,y), 0 significa que não será mostrado
      // nenhum ponto. Preferencialmente não deixar no valor 0 pois nele não é possivel ver o valor
      // especifico desse ponto.
    },
    {
      fill: false, // É o preenchimento do gráfico, se for true a área sob o gráfico é preenchida.
      opacity: "20",
      label: "Pontos site Débora", // label é o título desse conjunto de dados, ele irá aperecer junto do gráfico
      // para indicar quem é quem. Esse componente, ao ser clicado, dentro da aplicação,
      // faz com que os dados sumam ou apareçam do gráfico.

      data: [13, 13, 13], // Aqui é onde são definidos os dados de cada componente do eixo y. Essa
      // componente funciona junto com a componente 'labels', pois juntas elas
      // formam um par (x,y) onde => (labels, data). Os dados se organizam por
      // meio da posição no vetor, isso é, o primeiro valor em labels será
      // associado ao primeiro valor em data.
      //Pode ser um vetor, ou valor vazio também, não precisa ser um valor estático.

      yAxisID: "left", // Essa componente define um id para que você possa escolher se os dados ficaram na parte
      // esquerda ou direita do gráfico
      borderColor: "white", // Define a cor da linha
      borderWidth: 1, // Define a espessura da linha
      pointRadius: 0, // Define o tamanho dos pontos onde é formado um par (x,y), 0 significa que não será mostrado
      // nenhum ponto. Preferencialmente não deixar no valor 0 pois nele não é possivel ver o valor
      // especifico desse ponto.
    },
    {
      fill: true, // É o preenchimento do gráfico, se for true a área sob o gráfico é preenchida.
      opacity: "20",
      label: "Projeção da sprint", // label é o título desse conjunto de dados, ele irá aperecer junto do gráfico
      // para indicar quem é quem. Esse componente, ao ser clicado, dentro da aplicação,
      // faz com que os dados sumam ou apareçam do gráfico.

      data: [92, 74, 56, 38, 20, 0], // Aqui é onde são definidos os dados de cada componente do eixo y. Essa
      // componente funciona junto com a componente 'labels', pois juntas elas
      // formam um par (x,y) onde => (labels, data). Os dados se organizam por
      // meio da posição no vetor, isso é, o primeiro valor em labels será
      // associado ao primeiro valor em data.
      //Pode ser um vetor, ou valor vazio também, não precisa ser um valor estático.

      yAxisID: "left", // Essa componente define um id para que você possa escolher se os dados ficaram na parte
      // esquerda ou direita do gráfico
      borderColor: "gray", // Define a cor da linha
      borderWidth: 1, // Define a espessura da linha
      pointRadius: 0, // Define o tamanho dos pontos onde é formado um par (x,y), 0 significa que não será mostrado
      // nenhum ponto. Preferencialmente não deixar no valor 0 pois nele não é possivel ver o valor
      // especifico desse ponto.
    },
    {
      fill: false, // É o preenchimento do gráfico, se for true a área sob o gráfico é preenchida.
      opacity: "20",
      label: "Projetado", // label é o título desse conjunto de dados, ele irá aperecer junto do gráfico
      // para indicar quem é quem. Esse componente, ao ser clicado, dentro da aplicação,
      // faz com que os dados sumam ou apareçam do gráfico.

      data: [14, 14, 14], // Aqui é onde são definidos os dados de cada componente do eixo y. Essa
      // componente funciona junto com a componente 'labels', pois juntas elas
      // formam um par (x,y) onde => (labels, data). Os dados se organizam por
      // meio da posição no vetor, isso é, o primeiro valor em labels será
      // associado ao primeiro valor em data.
      //Pode ser um vetor, ou valor vazio também, não precisa ser um valor estático.

      yAxisID: "left", // Essa componente define um id para que você possa escolher se os dados ficaram na parte
      // esquerda ou direita do gráfico
      borderColor: "blue", // Define a cor da linha
      borderWidth: 2, // Define a espessura da linha
      pointRadius: 0, // Define o tamanho dos pontos onde é formado um par (x,y), 0 significa que não será mostrado
      // nenhum ponto. Preferencialmente não deixar no valor 0 pois nele não é possivel ver o valor
      // especifico desse ponto.
    },
  ],
};

// Aqui eu apenas defino componentes CSS, por motivos de responsividade

const styles = {
  container: (isWideBased) => ({
    width: isWideBased ? "60vw" : "80vw",
    paddingLeft: isWideBased ? "20vw" : "10vw",
    paddingTop: "10vh",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
};

const image = {
  container: (isWide) => ({
    paddingTop: isWide ? "40vh" : "330px",
    paddingLeft: isWide ? "47.8vw" : "720px",
    width: isWide ? "100px" : "100px",
  }),
};

const MainGraph = () => {
  const mainGraph = useRef(); // Para manipular as componentes internas do gráfico e executar ações sobre ele, como
  // alterar seus dados por meio de um "push" iremos criar uma refêrencia para ele e chama-la
  // na definição do gráfico. É necessário importar o useRef. Ele é utilizado para evitar
  // a re-renderização do gráfico quando alteramos os dados.

  const [showAnnotation, setShowAnnotation] = useState(false);
  const isWideBased = useMediaQuery("(min-width: 1920px)"); // chamada para mediaQuery inline baseado em React Hook

  const splitDates = (init, fini) => {
    const [initDay, initMonth] = init.split("/").map((num) => parseInt(num));
    const [finiDay, finiMonth] = fini.split("/").map((num) => parseInt(num));
    return {
      initDay,
      initMonth,
      finiDay,
      finiMonth,
    };
  };
  const isSameMonthSprint = (init, fini) => (init === fini ? true : false);

  const is31DayMonth = (day) => {
    return day % 2 === 0 ? false : true;
  };
  const createDateArray = (init, fini) => {
    const parsedTime = [];
    const { initDay, initMonth, finiDay, finiMonth } = splitDates(init, fini);
    let iterator = initDay;
    if (isSameMonthSprint(initMonth, finiMonth)) {
      while (iterator !== finiDay) {
        parsedTime.push(`${iterator}/${initMonth}`);
        iterator += 1;
      }
      console.log(parsedTime);
    }
  };

  const handleSprintTime = () => {
    var init = prompt('Digite o inicio da sprint, como sendo "xx/xx"');
    var fini = prompt('Digite o final da sprint, como sendo "xx/xx"');
    createDateArray(init, fini);
  };

  return (
    <div className="container">
      <img
        src="YellowLogo.png"
        alt="Logo CPE"
        style={image.container(isWideBased)}
      ></img>
      <div style={styles.container(isWideBased)}>
        <Line // Chamamos a componente do gráfico a ser renderizado na tela por meio da sua componente importada, no nosso
          // caso <Line />, mas pode ser de qualquer tipo, como por exemplo <Bar />. Aqui iremos definir aspectos visuais
          // do gráfico, como seu posicionamento, tamanho e et cetera.

          id="main-graph"
          data={INITALLDATA} // Aqui deve ser inserida a variável definida anteriormente, com os dados as serem utilizados.
          ref={mainGraph} // Criar a referência pro gráfico dentro da variável mainGraph
          options={{
            annotation: {
              annotations: [
                {
                  type: "line",
                  mode: "vertical",
                  scaleID: "y-axis-0",
                  value: 20,
                  borderWidth: 2,
                  label: {
                    enabled: true,
                    content: "Precisão da sprint necessária!",
                    position: "bottom",
                  },
                },
              ],
            },
            legend: {
              // A componente legend define onde as legendas do gráfico ficarão, pode ser alterado também o
              // espaçamento, tamanho da fonte e tipo
              position: "bottom", // Tente mudar pra 'left', 'right' ou 'top'
              labels: {
                padding: 20,
                fontFamily: "Quicksand",
                fontColor: "white",
                fontSize: 20,
              },
            },
            responsive: true,
            maintainAspectRatio: true, // As componentes responsive e maintainAspectRatio são referentes à responsividade
            // responsive, por padrão, é true, e ele faz com que o gráfico altere seu tamanho
            // junto da div pai a qual pertence. maintainAspectRation é referente ao tamanho
            // do gráfico. Caso seja true, irá ocupar todo o espaço da div, caso seja false
            // é possível definir o valores do gráfico manualmente.
            // Recomendo FORTEMENTE que não trabalhem com valores manuais dentro do gráfico,
            // mas sim, alterem o tamanho da sua DIV pai, facilitando, e muito a sua vida.

            title: {
              //Define o título do gráfico e como ele irá se comportar
              text: "Sprint 18/10 - 29/10 Psicóticos",
              fontFamily: "Quicksand",
              fontSize: 30,
              fontColor: "smokewhite",
              display: true, //Essa componente serve para controlar se o título irá aparecer ou não
            },

            elements: {
              line: {
                tension: 0.2, // Tension é a "suavização" do gráfico, por default é 0.4, onde o gráfico
                // é mais curvado ao chegar perto do pontos, 0 é um gráfico reto.
                // É possivel definir a curva em cada dataset por meio da variável "lineTension"
              },
            },
            scales: {
              // Aqui é definido o valor das escalas nos eixos x e y, assim como sua abrangência
              // valor mínimo e máximo
              yAxes: [
                {
                  // Intuitivamente, neste objeto são definidos os parametros do eixo y.
                  gridLines: { display: true, color: "rgba(215,215,215,0.3)" }, // Essa componente mostra as linhas de grade no gráfico.
                  id: "left", // Aqui é defindo o id do eixo, ele parametriza os dados que tiverem
                  // a componente yAxesId como sendo 'left'

                  position: "left", // Aqui é definido onde ficará o eixo, isso é na esquerda ou direita
                  ticks: {
                    // Na componente Ticks é definido os valores de máximo e mínimo da escala, assim
                    // como qual sua taxa de crescimento, na componente stepSize.
                    min: 0,
                    stepSize: 5,
                    fontColor: "white",
                  },
                },
              ],
              xAxes: [
                // Aqui ficam salvam as definições do eixo x
                {
                  gridLines: { display: true, color: "rgba(215,215,215,0.3)" }, // Essa componente mostra as linhas de grade no gráfico.
                  ticks: {
                    autoSkip: true, // Limita o número máximo de x's no gráfico, se for false mostra todo
                    // o conteúdo dentro de x.

                    maxTicksLimit: 20, // Aqui é definido o número máximo de x que aparecerão simultaneamente
                    // caso a definição anterior seja true

                    beginAtZero: true, // Apenas define se o valor começa em 0 ou não, se for true adiciona
                    // o valor 0 ao eixo
                    fontColor: "white",
                  },
                },
              ],
            },
          }}
        />

        {/* Aqui embaixo são apenas instanciados botões com as funções definidas dentro da pasta functions, para entender, vá para aquele arquivo*/}
        <div
          style={{
            display: "flex",
            width: "90vw",
            justifyContent: "space-around",
            padding: "5px",
          }}
        >
          <button
            className="button-styles"
            onClick={() => eraseLastData(mainGraph)}
          >
            Retirar ultimo valor
          </button>

          <button
            className="button-styles"
            onClick={() => addManualData(mainGraph)}
          >
            Adicionar dados manualmente
          </button>

          <button
            className="button-styles"
            onClick={() => setShowAnnotation(!showAnnotation)}
          >
            Adicionar anotação
          </button>
          <button className="button-styles" onClick={handleSprintTime}>
            Início e fim da sprint
          </button>
        </div>
      </div>
    </div>
  );
};
export default MainGraph;
