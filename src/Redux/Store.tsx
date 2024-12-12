const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['signalR/connect/fulfilled'],
                ignoredPaths: ['payload'], //ВАЖНО! сейчас ошибки о невозможности серилизовать handler в signalRSlice убрны в игнор
            },
        }),
});