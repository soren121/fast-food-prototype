import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Header from './components/header';
import Items from './components/items';
import OrderSummary from './components/orderSummary';
import { OrderProvider } from './data/OrderProvider';

/**
 * Renders the main application layout.
 */
export default function App({ menuJson, networkTime = 1000 }) {
    const [menuData, setMenuData] = useState({});

    // Fake a network call to get data
    useEffect(() => {
        setTimeout(() => setMenuData(menuJson), networkTime);
    }, [menuJson, networkTime]);

    return (
        <OrderProvider menu={menuData?.menu || null}>
            <Container className="mb-4">
                <Header />

                <Row>
                    <Col md={8}>
                        <Items />
                    </Col>
                    <Col md={4}>
                        <OrderSummary />
                    </Col>
                </Row>
            </Container>
        </OrderProvider>
    );
}
