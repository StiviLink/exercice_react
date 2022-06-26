import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const store = createStore(rootReducer);


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
reportWebVitals();