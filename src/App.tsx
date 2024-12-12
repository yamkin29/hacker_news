import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import MainPage from "./Components/MainPage";

const App = (): React.ReactElement => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className={'App'}>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </Provider>
    );
};

export default App;