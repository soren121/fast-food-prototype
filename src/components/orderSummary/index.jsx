import { Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import clsx from 'clsx';

import { useOrder } from '../../data/OrderProvider';
import { getCurrencyFormatter } from '../../lib/util';
import styles from './orderSummary.module.scss';
import { ReactComponent as RemoveIcon } from '../../assets/trash-o.svg';

const priceFmt = getCurrencyFormatter();

/**
 * Renders an individual item in the user's order.
 *
 * @param {object} props
 * @param {string} props.text The text to display on the order item.
 * @param {number} props.price The price of the item.
 * @param {function} props.onRemove A callback to remove the item from the
 *  order.
 * @param {boolean} props.canRemove True if the item can be removed from the
 *  order.
 * @param {string} props.className An optional classname to add to the item's
 *  outermost element.
 */
const OrderItem = ({
    text,
    price,
    onRemove = null,
    canRemove = false,
    className = '',
}) => {
    return (
        <ListGroup.Item className={clsx(styles.orderItem, className)}>
            <div>
                {typeof onRemove === 'function' && (
                    <button
                        className={styles.orderItemRemoveBtn}
                        aria-label="Remove item"
                        disabled={!canRemove}
                        onClick={onRemove}
                    >
                        <RemoveIcon />
                    </button>
                )}

                <span className={styles.orderItemName}>{text}</span>
            </div>

            <span className={styles.orderItemPrice}>
                {priceFmt.format(price)}
            </span>
        </ListGroup.Item>
    );
};

/**
 * Renders the order summary card.
 */
export default function OrderSummary() {
    const { items, removeItem, getTotal, submitOrder, isSubmitting } =
        useOrder();

    return (
        <Card className={styles.orderCard}>
            <h2 className={styles.sectionTitle}>Your order</h2>

            <ListGroup variant="flush" className={styles.orderItems}>
                {items.map((item) => (
                    <OrderItem
                        key={item.uid}
                        text={`${item.item} (${item.option.size})`}
                        price={item.option.price}
                        onRemove={() => removeItem(item)}
                        canRemove={!isSubmitting}
                    />
                ))}

                <OrderItem
                    className={styles.orderTotal}
                    text="Total"
                    price={getTotal()}
                />
            </ListGroup>

            {items.length > 0 && (
                <Button
                    variant="primary"
                    block
                    className={styles.submitOrderBtn}
                    onClick={submitOrder}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        'Submit Order'
                    )}
                </Button>
            )}
        </Card>
    );
}
