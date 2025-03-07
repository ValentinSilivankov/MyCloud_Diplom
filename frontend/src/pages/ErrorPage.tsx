import { Card } from 'antd'
import error404 from '../assets/error404.jpg'

export default function ErrorPage() {
    return (
        <Card className='card'
            title={<h1>Страница не найдена</h1>}
            bordered={false}
        >
            <div className='details'>
                <img src={error404} alt='cloud' width={300} />
                <div className='details__info'>
                    <h3>К сожалению, запрашиваемая Вами страница не найдена</h3>
                </div>
            </div>
        </Card>
    );
}