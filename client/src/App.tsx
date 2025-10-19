import React, { useState } from 'react';
import './styles/client.css'

import Sidebar from './components/Sidebar'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
      <Sidebar />
  )

}
export default App;
