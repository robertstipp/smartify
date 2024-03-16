import React from 'react'
import { createRoot } from 'react-dom/client';
import { App } from './App'
import DragAndDrop from './components/DragAndDrop'


import './index.css'
createRoot(document.querySelector('#app'))
    .render(<DragAndDrop />);