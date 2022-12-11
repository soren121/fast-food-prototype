import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import './layout/global.scss';
import App from './app';
import menuJson from './project.json';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App menuJson={menuJson} />
        <Toaster />
    </React.StrictMode>
);
