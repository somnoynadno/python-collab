import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router-dom";
import App from './App';

import history from './history';

import 'antd/dist/antd.css';
import './index.css';

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";


ReactDOM.render(
    <React.StrictMode>
        <Router history={history}>
            <App/>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

