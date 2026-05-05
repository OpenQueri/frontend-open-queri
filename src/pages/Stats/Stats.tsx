import React, {useEffect, useState} from "react";

export function Stats() {
    const [counter, setCounter] = useState('Подключение...');
    const host = window.location.hostname; 
    useEffect(() => {
        
        const socket = new WebSocket(`ws://${host}:8000/stats-ws`);

        
        socket.onmessage = (event) => {
            console.log('Данные от Rust:', event.data);
            setCounter(event.data);
        };

            socket.onopen = () => console.log('Соединение установлено!');
    socket.onclose = () => console.log('Соединение разорвано');

       
        return () => socket.close();
    }, []);

    return(
        <>
            <div style={{ padding: '20px', fontSize: '24px' }}>
                <h1>Статистика из Rust:</h1>
                <p>{counter}</p>
            </div>
        </>
    );
}