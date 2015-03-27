import Bacon from 'baconjs';
import React from 'react/addons';
import Please from 'pleasejs';

const DOT_WIDTH = 10;
const MAX_DOT_HEIGHT = 50;
const DOT_HEIGHT = 20;

export default class Visualizer extends React.Component {
  constructor(props) {
    super(props);
    this.dots = [];
    this.tutorial = props.tutorial();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    let { metronome, buses, voices } = this.props;
    let total = 1 + buses.length + voices.length;

    let c1 = 'rgb(0,0,0)';
    let colors = [c1];

    let c2 = 'rgb(0,0,0)';
    buses.forEach(() => {
      colors.push(c2);
    });

    let c3 = Please.make_color({ format: 'rgb-string' })[0];
    voices.forEach(() => {
      colors.push(c3);
    });

    metronome.concat(buses, voices).forEach((x, i) => {
      let y = 20 + (i) * (window.innerHeight / total);

      x.onValue(this.handleValue(colors[i], y).bind(this));
    });

    let draw = this.draw.bind(this);

    window.requestAnimationFrame(function raf() {
      draw();
      window.requestAnimationFrame(raf);
    });

    let canvas = this.refs.canvas.getDOMNode();
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;
  }

  draw() {
    let canvas = this.refs.canvas.getDOMNode();
    let context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.dots.forEach((dot) => {
      context.beginPath();

      context.rect(dot.x, dot.y - (dot.extraHeight / 2), DOT_WIDTH, DOT_HEIGHT + dot.extraHeight);
      context.fillStyle = dot.color.replace(')', ', ' + dot.life + ')').replace('rgb', 'rgba');
      //context.fillStyle = `rgba(0, 0, 0, ${dot.life})`;

      context.fill();

      dot.life = Math.max(dot.life - 0.005, 0.05);
      dot.extraHeight = Math.max(dot.extraHeight - 1, 0);
      dot.x--;
    });
  }

  handleValue(color, y) {
    let canvas = this.refs.canvas.getDOMNode();

    return () => {
      this.dots.push({ life: 1, extraHeight: MAX_DOT_HEIGHT - DOT_HEIGHT, x: canvas.width - 1, y, color });
      this.dots = this.dots.filter((val) => {
        return val.x > 0 && val.life > 0;
      });
    };
  }

  handleClick() {
    console.log('click');
    this.tutorial.next();
  }

  render() {
    return <div>
      <canvas onClick={this.handleClick.bind(this)} ref="canvas" style={{display: 'block', margin: '0 auto'}}></canvas>
    </div>;
  }
}
