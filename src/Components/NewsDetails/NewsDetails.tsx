import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {News} from "../MainPage/MainPage";

const NewsDetails: React.FC = () => {
    const {id} = useParams<{id: string}>();
    const [news, setNews] = React.useState<News | null>(null);

    useEffect(() => {
        const fetchNewsDetails = async () => {
            const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
            const news: News = await response.json();
            setNews(news);
        }

        fetchNewsDetails();
    }, []);

    if (!news) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <h1>{news.title || 'No Title'}</h1>
                <p><strong>Author:</strong> {news.by}</p>
                <p><strong>Score:</strong> {news.score}</p>
                <p><strong>Time:</strong> {new Date(news.time! * 1000).toLocaleString()}</p>
                <p><strong>URL:</strong> <a href={news.url} target="_blank" rel="noopener noreferrer">{news.url}</a></p>
            </div>
        </div>
    );
};

export default NewsDetails;