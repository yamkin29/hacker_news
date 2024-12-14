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

        </div>
    );
};

export default NewsDetails;