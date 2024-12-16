import React, {useEffect} from 'react';
import './MiainPage.css';
import {Button, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import { useNavigate } from 'react-router-dom';

export interface News {
    id: number;
    title?: string;
    url?: string;
    by?: string;
    time?: number;
    score?: number;
    descendants?: number;
    type?: string;
    kids?: number[];
}

const MainPage = () => {
    const [news, setNews] = React.useState<News[]>([]);
    const [refreshNews, setRefreshNews] = React.useState<boolean>(false);
    const navigate = useNavigate();

    const handleRefreshClick = () => {
        setRefreshNews(prev => !prev);
    }

    useEffect(() => {
        const fetchTopStories = async () => {
            try {
                const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
                const storiesIds = await response.json();
                const top100Ids = storiesIds.slice(0, 100);

                const storyPromises: Promise<News>[] = top100Ids.map(async (id: number) => {
                    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)

                    if (!res.ok) {
                        throw new Error(`Failed to fetch story with id: ${id}`)
                    }

                    return res.json();
                })

                const stories = await Promise.all(storyPromises);
                setNews(stories);
            } catch (error) {
                console.error(error);
            }
        }

        fetchTopStories();

    }, [refreshNews]);

    useEffect(() => {
        const refreshInterval = setInterval(() => {
            setRefreshNews(prev => !prev);
        }, 3000);

        return () => clearInterval(refreshInterval);
    }, []);

    const columns: ColumnsType<News> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => (<p>{text || 'No Title'}</p>),
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Author',
            dataIndex: 'by',
            key: 'by',
        },
        {
            title: 'Date',
            dataIndex: 'time',
            key: 'time',
            render: (time: number) => new Date(time * 1000).toLocaleString(),
        },
    ];

    const dataSource = news.map((story) => {
        return {
            ...story,
            key: story.id,
        }
    });

    return (
        <div>
            <div className={'header'}>
                <div className={'header__title'}>
                    <div className={'header__title__image'}>
                        <img src='https://news.ycombinator.com/y18.svg' alt='logo'/>
                    </div>
                    <div className={'header__title__text'}>
                        Hacker News
                    </div>
                </div>
                <div className={'header__refresh'}>
                    <Button
                        onClick={handleRefreshClick}
                    >
                        Refresh
                    </Button>
                </div>
            </div>
            <div className={'main-container'}>
                <Table<News>
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={(news) => news.id}
                    loading={news.length === 0}
                    onRow={(news) => ({
                        onClick: () => navigate(`news/${news.id}`)
                    })}
                />
            </div>
        </div>
    );
};

export default MainPage;