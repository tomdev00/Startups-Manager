import { Button, List, Modal, Input } from "antd";
import { Content } from "antd/es/layout/layout";
import { addStartup, deleteStartup, isAdminFunc, showStartups, updateStartup, addToFavourites, showStartupById, profiles } from "../connections/connection";
import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { DeleteOutlined, StarOutlined, EditOutlined } from '@ant-design/icons';

interface Startup {
    id: string;
    name: string;
}

export const Startup: React.FC = () => {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        async function fetchStart() {
            const admin = await isAdminFunc();
            const startupsData = await showStartups();
            const data = startupsData.flat();
            setStartups(data);
            setIsAdmin(admin);
        };
        fetchStart();
    }, []);

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Confirm Removal',
            content: 'Are you sure you want to delete this startup?',
            onOk: async () => {
                try {
                    const result = await deleteStartup(id);
                    if (result) {
                        console.log(`Deleting startup with ID: ${id}`);
                        const updatedStartups = await showStartups();
                        setStartups(updatedStartups);
                    } else {
                        console.log("Failed to delete startup.");
                    }
                } catch (error) {
                    console.error("Error deleting startup:", error);
                }
            },
            onCancel: () => {
                console.log('Removal cancelled');
            },
        });
    }

    const handleAddToFavorites = async (id: string) => {
        Modal.confirm({
            title: 'Confirm Addition to your favourites',
            content: 'Are you sure you want to add this startup to you favourites?',
            onOk: async () => {
                try {
                    const result = await addToFavourites(id);
                    if (result) {
                        console.log(`Adding startup with ID: ${id} to favorites`);
                        const updatedStartups = await showStartups();
                        setStartups(updatedStartups);
                        console.log('Startup added to favorites:', result);
                    }
                } catch (error) {
                    console.error('Error adding startup to favorites:', error);
                }
            },
            onCancel: () => {
                console.log('Removal cancelled');
            },
        });
    }

    const handleUpdateStartup = async (id: string) => {
        Modal.confirm({
            title: 'Update Startup Name',
            content: (
                <div>
                    <p>Enter the new name for the startup:</p>
                    <Input id="newNameInput" type="text" />
                </div>
            ),
            onOk: async () => {
                const newNameInput: any = document.getElementById('newNameInput') as HTMLInputElement;
                const newName = newNameInput.value;
                if (newName) {
                    try {
                        const result = await updateStartup(id, newName);
                        if (result) {
                            console.log(`Updated startup with ID: ${id}`);
                            const updatedStartups = await showStartups();
                            setStartups(updatedStartups);
                        } else {
                            console.log("Failed to update startup.");
                        }
                    } catch (error) {
                        console.error("Error updating startup:", error);
                    }
                } else {
                    console.log("No new name entered for the startup.");
                }
            },
            onCancel: () => {
                console.log('Update cancelled');
            },
        });
    };

    const handleAddMore = async () => {
        Modal.confirm({
            title: 'Add New Startup',
            content: (
                <div>
                    <p>Enter the new name for the startup:</p>
                    <Input id="nameInput" type="text" />
                </div>
            ),
            onOk: async () => {
                const nameInput: any = document.getElementById('nameInput') as HTMLInputElement;
                const name = nameInput.value;
                if (name) {
                    try {
                        console.log(name);
                        const newStartup = await addStartup(name);
                        if (newStartup) {
                            console.log("New startup added successfully:", newStartup);
                            const updatedStartups = await showStartups();
                            setStartups(updatedStartups);
                        } else {
                            console.log("Failed to add new startup.");
                        }
                    } catch (error) {
                        console.error("Error adding new startup:", error);
                    }
                } else {
                    console.log("No name entered for the new startup.");
                }
                console.log("Adding more startups");
            },
            onCancel: () => {
                console.log('Update cancelled');
            },
        });
    };

    return (
        <div>
            <h2>Startups</h2>
            <List
                itemLayout="horizontal"
                dataSource={startups}
                renderItem={(startup: Startup) => (
                    <List.Item key={startup.id} actions={[
                        isAdmin && <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(startup.id)}>Delete</Button>,
                        isAdmin && <Button icon={<EditOutlined />} onClick={() => handleUpdateStartup(startup.id)}>Update</Button>,
                        (isAdmin || !isAdmin) && <Button icon={<StarOutlined />} onClick={() => handleAddToFavorites(startup.id)}></Button>,
                    ].filter(Boolean)}>
                        <List.Item.Meta
                            title={`${startup.id} - ${startup.name}`}
                        />
                    </List.Item>
                )}
            />
            {isAdmin && <Button onClick={handleAddMore} style={{ display: isAdmin ? 'block' : 'none' }}>Add More Startups</Button>}
        </div>
    )
}

export default Startup;