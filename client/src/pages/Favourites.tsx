import React, { useEffect, useState } from 'react';
import { Button, List, Modal, Input } from 'antd';
import { favourites, removeFromFavourites } from '../connections/connection';
import { StarFilled } from '@ant-design/icons';
import '../styles/client.css';

interface Favourites {
    id: string;
    name: string;
}

export const Favourites: React.FC = () => {
    const [favoritedStartups, setFavoritedStartups] = useState<Favourites[]>([]);

    useEffect(() => {
        async function fetchFavoritedStartups() {
            try {
                const startups = await favourites();
                const data = startups.flat();
                console.log('Fetched favorited startups:', startups);
                setFavoritedStartups(data);
            } catch (error) {
                console.error('Error fetching favorited startups:', error);
            }
        };
        fetchFavoritedStartups();
    }, [favoritedStartups]);

    const handleRemoveFromFavorites = async (id: string) => {
        Modal.confirm({
            title: 'Confirm Removal',
            content: 'Are you sure you want to remove this startup from your favorites?',
            onOk: async () => {
                try {
                    console.log(`Removing startup with ID: ${id} from favorites`);
                    const result = await removeFromFavourites(id);
                    if (result) {
                        const updatedFavorites = await favourites();
                        setFavoritedStartups(updatedFavorites);
                    } else {
                        console.log("Failed to delete from favourites.");
                    }
                } catch (error) {
                    console.error('Error removing startup from favorites:', error);
                }
            },
            onCancel: () => {
                console.log('Removal cancelled');
            },
        });
    }

    return (
        <div>
            <h2>Favorited Startups</h2>
            <List
                itemLayout="horizontal"
                dataSource={favoritedStartups}
                renderItem={(startup: Favourites) => (
                    <List.Item key={startup.id} actions={[
                        <Button icon={<StarFilled />} danger onClick={() => handleRemoveFromFavorites(startup.id)}></Button>
                    ]}>
                        <List.Item.Meta
                            title={startup.name}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}

export default Favourites;