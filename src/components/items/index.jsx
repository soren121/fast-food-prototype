import { useState } from 'react';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';

import { useOrder } from '../../data/OrderProvider';
import { getCurrencyFormatter } from '../../lib/util';
import styles from './items.module.scss';

const priceFmt = getCurrencyFormatter();

/**
 * Renders an individual menu item.
 *
 * @param {object} props
 * @param {string} props.name The name of the menu item.
 * @param {{ size: string, price: number }} props.options The item's available
 *  size options.
 * @param {(name: string, option: object) => void} props.onAddItem A callback to
 *  add the given item to the order.
 * @param {boolean} props.canAdd True if the item can be added to the cart.
 *
 */
const Item = ({ name, options, onAddItem, canAdd = false }) => {
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleOptionSelect = (e) => {
        const option = options.find((o) => o.size === e.target.value);
        if (option) {
            setSelectedOption(option);
        }
    };

    return (
        <Card className={styles.itemCard}>
            <Card.Body>
                <Card.Title className={styles.itemCardTitle}>{name}</Card.Title>
                <Form.Group controlId={`item-${name.toLowerCase()}-options`}>
                    <Form.Label className={styles.itemOptionLabel}>
                        Select a size:
                    </Form.Label>
                    <Form.Control
                        as="select"
                        custom
                        value={selectedOption?.size}
                        onChange={handleOptionSelect}
                    >
                        {options.map((option) => (
                            <option key={option.size} value={option.size}>
                                {option.size} ({priceFmt.format(option.price)})
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button
                    className={styles.itemCardAddBtn}
                    variant="outline-primary"
                    block
                    onClick={() => onAddItem(name, selectedOption)}
                    disabled={!canAdd}
                >
                    Add to Order
                </Button>
            </Card.Body>
        </Card>
    );
};

/**
 * Renders a grid of menu items.
 */
export default function Items() {
    const { menu, addItem, isSubmitting, isLoading } = useOrder();

    return (
        <section className={styles.items}>
            <h2>Menu items ({menu.length})</h2>

            {!!isLoading ? (
                <div className={styles.itemsLoading}>
                    <Spinner animation="border" variant="primary" />
                    <p>Loading menu, please wait...</p>
                </div>
            ) : (
                <Row noGutters className={styles.itemGrid}>
                    {menu.map((item) => (
                        <Col sm={6} lg={4} key={item.item}>
                            <Item
                                name={item.item}
                                options={item.options}
                                onAddItem={addItem}
                                canAdd={!isSubmitting}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </section>
    );
}
