import React, { useState, useContext, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

/**
 * OrderItem describes an item in the user's order.
 *
 * @typedef OrderItem
 * @property {string} uid The unique ID of this item within the order.
 * @property {string} item The name of the order item.
 * @property {{ size: string, price: number }} option The chosen size option.
 */

export const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

/**
 * A React context provider that keeps the user's order state.
 *
 * @param {object} props
 * @param {object} props.menu The menu JSON data.
 * @param {React.Children} props.children
 * @returns {OrderContext.Provider}
 */
export const OrderProvider = ({ menu = null, children }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    /**
     * Adds an item to the user's order.
     *
     * @param {string} itemName
     * @param {{ size: string, price: number }} option
     * @returns {void}
     */
    const addItem = (itemName, option) => {
        const newItem = {
            // Generate a unique ID for this option so we can easily find or
            // remove it later among identical options in the order
            uid: uuidv4(),
            item: itemName,
            option,
        };

        setSelectedItems([...selectedItems, newItem]);
    };

    /**
     * Removes a given item from the user's order.
     * @param {OrderItem} item
     * @returns {void}
     */
    const removeItem = (item) => {
        const index = selectedItems.findIndex((val) => val.uid === item.uid);
        if (index >= 0) {
            const newSelectedItems = [...selectedItems];
            newSelectedItems.splice(index, 1);
            setSelectedItems(newSelectedItems);
            toast(`${item.item} was removed from your order.`);
        } else {
            console.log(`${item.uid} couldn't be found in order`);
        }
    };

    /**
     * Calculates the current order total.
     *
     * @returns {number}
     */
    const getTotal = () => {
        return selectedItems.reduce((acc, cur) => {
            acc += cur.option.price || 0;
            return acc;
        }, 0);
    };

    /**
     * Simulates submitting the order. It will wait 2.5 seconds, then
     * clears the order and resolves.
     *
     * @returns {Promise<void>}
     */
    const submitOrder = async () => {
        setSubmitting(true);
        toast.dismiss();
        return new Promise((resolve) => {
            setTimeout(() => {
                setSelectedItems([]);
                setSubmitting(false);
                toast.success('Your order was submitted to the kitchen!', {
                    duration: 5000,
                });
                resolve();
            }, 2500);
        });
    };

    return (
        <OrderContext.Provider
            value={{
                menu: menu || [],
                items: selectedItems,
                getTotal,
                addItem,
                removeItem,
                submitOrder,
                isLoading: menu === null,
                isSubmitting: submitting,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
