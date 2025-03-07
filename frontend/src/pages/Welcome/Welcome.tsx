import {Card, Carousel } from 'antd'
import './welcome.scss'
import slide01 from './slides/slide01.jpg'
import slide02 from './slides/slide02.jpg'
import slide03 from './slides/slide03.jpg'


export default function Welcome() {
  return (


    <Card className='card'
      title={<h1>Облачное хранилище MyCloud</h1>}
      bordered={false}
    >
      <Carousel autoplay>
        <div className='details'>
          <img className='displayed' src={slide01} alt="First slide" width={305} />
          <div className='details__info'>
            <h2>Облочное хранилище</h2>
          </div>
        </div>
        <div className='details'>
          <img className='displayed' src={slide03} alt="First slide" width={305} />
          <div className='details__info'>
            <h2>Простой и безопасный доступ к файлам</h2>
          </div>
        </div>
        <div className='details'>
          <img className='displayed' src={slide02} alt="First slide" width={305} />
          <div className='details__info'>
            <h2>Создано для конфиденциальности</h2>
          </div>
        </div>
      
      </Carousel>
  
    </Card>
    
  );
}