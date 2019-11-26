import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import './index.css';
import App from './App';
import 'antd/dist/antd.css';

axios.defaults.baseURL = 'http://47.254.26.213/api';

ReactDOM.render(<App />, document.getElementById('root'));