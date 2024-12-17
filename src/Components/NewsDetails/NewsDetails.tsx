import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {News} from "../MainPage/MainPage";
import {Button, Tree, TreeDataNode} from "antd";
import '../NewsDetails/NewDetails.css'
import styled from 'styled-components';

interface CommentItem {
    id: number;
    by?: string;
    kids?: number[];
    parent?: number;
    text?: string;
    time?: number;
    type?: string;
}

const NewsDetails: React.FC = () => {
    const {id} = useParams<{id: string}>();
    const [news, setNews] = useState<News | null>(null);
    const [commentsTree, setCommentsTree] = useState<TreeDataNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshComments, setRefreshComments] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRefreshClick = () => {
        setRefreshComments(prev => !prev);
    }

    const fetchCommentTree = async (commentId: number): Promise<TreeDataNode> => {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json?print=pretty`)
        const comment: CommentItem = await response.json();

        if (!comment || comment.type !== 'comment') {
            return {
                title: 'No comment',
                key: comment.id,
            }
        }

        let children: TreeDataNode[] = [];
        if (comment.kids && comment.kids.length > 0) {
            const childrenPromises = comment.kids.map((kidId: number) => fetchCommentTree(kidId));
            children = await Promise.all(childrenPromises);
        }

        return {
            title: (
                <div>
                    <strong>{comment.by || 'Unknown'}:</strong>{' '}
                    <span dangerouslySetInnerHTML={{ __html: comment.text || 'No text' }} />
                </div>
            ),
            key: commentId,
            children: children,
        }
    }

    useEffect(() => {
        const fetchNewsDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
                const data: News = await response.json();
                setNews(data);
            } catch (error) {
                console.error('Error fetching news details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetails();

    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!news) {
                return;
            }

            setLoading(true);

            try {
               if (news.kids && news.kids.length > 0) {
                   const rootCommentsPromises = news.kids.map(async (id: number) => {
                       return fetchCommentTree(id);
                   });

                   const treeData = await Promise.all(rootCommentsPromises);
                   setCommentsTree(treeData);
               } else {
                   setCommentsTree([]);
               }

            } catch (error) {
               console.error('Error fetching comments:', error);
               setCommentsTree([]);
            } finally {
                setLoading(false);
            }
        }

        fetchComments();

    }, [news, refreshComments]);

    if (!news || loading) {
        return <div>Loading...</div>;
    }

    const CustomButton = styled(Button)`
        margin: 2px;
    `;
    

    return (
        <div>
            <div>
                <div className={'buttons-container'}>
                    <CustomButton onClick={() => navigate('/')}>Back to News</CustomButton>
                    <Button onClick={handleRefreshClick}>Refresh comments</Button>
                </div>
                <h1>{news.title || 'No Title'}</h1>
                <p><strong>Author:</strong> {news.by}</p>
                <p><strong>Score:</strong> {news.score}</p>
                <p><strong>Time:</strong> {new Date(news.time! * 1000).toLocaleString()}</p>
                <p><strong>URL:</strong> <a href={news.url} target="_blank" rel="noopener noreferrer">{news.url}</a></p>
            </div>

            <h2>Comments</h2>

            {commentsTree.length === 0 ?
            <p>No comments</p> :
                (
                    <Tree
                        treeData={commentsTree}
                        defaultExpandAll={true}
                    />
                )
            }
        </div>
    );
};

export default NewsDetails;