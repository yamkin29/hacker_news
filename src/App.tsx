import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import MainPage from "./Components/MainPage/MainPage";
import store from './Redux/Store';
import NewsDetails from "./Components/NewsDetails/NewsDetails";

const App = (): React.ReactElement => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className={'App'}>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/news/:id" element={<NewsDetails />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </Provider>
    );
};

export default App;