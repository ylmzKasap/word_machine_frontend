const Cards: React.FC<SvgCardTypes> = ({
  firstCardColor='#009740',
  secondCardColor='#3153a1',
  thirdCardColor='#4d4d4b'
}) => 
  <svg id="cards" data-name="cards" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 221.32 165.25"><rect x="188.77"
      y="318.1" width="113.99" height="145.34" rx="30.45"
      transform="translate(-251.97 -251.19) rotate(-11.52)"
      fill={firstCardColor} stroke="#fff" strokeMiterlimit="10" strokeWidth="4"/>
    <rect x="233.77" y="311.79" width="113.99" height="153.16" rx="30.45"
      transform="translate(-197.04 -293.85) rotate(-2.73)" fill={secondCardColor} stroke="#fff"
      strokeMiterlimit="10" strokeWidth="4"/><rect x="280.87" y="311.89" width="113.99"
      height="157.77" rx="30.45" transform="matrix(1, 0.07, -0.07, 1, -150.67, -330.85)"
      fill={thirdCardColor} stroke="#fff" strokeMiterlimit="10" strokeWidth="4"/></svg>;

export default Cards;

interface SvgCardTypes {
  firstCardColor?: string;
  secondCardColor?: string;
  thirdCardColor?: string;
}
