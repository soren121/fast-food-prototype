import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import App from './app';
import menuJson from './project.json';

const testMenu = {
    menu: [
        {
            item: 'Fries',
            options: [
                {
                    size: 'small',
                    price: 0.99,
                },
                {
                    size: 'regular',
                    price: 1.5,
                },
                {
                    size: 'large',
                    price: 1.99,
                },
            ],
        },
    ],
};

test('Layout appears', () => {
    render(<App />);
    const linkElement = screen.getByText(/Online Ordering/);
    expect(linkElement).toBeInTheDocument();
});

test('Menu data loads', async () => {
    await act(async () =>
        render(<App menuJson={menuJson} networkTime={100} />)
    );
    await waitFor(() => {
        expect(screen.getByText(/Burger/i)).toBeInTheDocument();
    });
});

test('All sizes load', async () => {
    await act(async () =>
        render(<App menuJson={menuJson} networkTime={100} />)
    );
    await waitFor(() => {
        expect(screen.getByText(/Burger/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/regular/i)).toHaveLength(3);
});

test('Item can be added to order', async () => {
    await act(async () => render(<App menuJson={testMenu} networkTime={0} />));
    await waitFor(() => {
        expect(screen.getByText(/Fries/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText(/Add to Order/i));

    await waitFor(() => {
        expect(
            screen
                .getByText('Total')
                .parentElement.parentElement.querySelector('.orderItemPrice')
        ).toHaveTextContent('$0.99');
    });
});

test('Item can be added & removed from order', async () => {
    await act(async () => render(<App menuJson={testMenu} networkTime={0} />));
    await waitFor(() => {
        expect(screen.getByText(/Fries/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText(/Add to Order/i));
    await userEvent.click(screen.getByLabelText(/Remove/i));
});
