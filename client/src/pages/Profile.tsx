import { Button, Form, FormProps } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useState, useEffect } from 'react';
import { profiles } from "../connections/connection";
import { getCookie } from '../connections/connection'

export default function Profile() {
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    async function fetchProfile() {
      setProfile(await profiles())
    }
    fetchProfile();
  }, []);

  return (
    <div>
      <div>
        <h2>{profile.username}'s Profile</h2>
        <p>ID: {profile.id}</p>
        <p>Username: {profile.username}</p>
        <p>Role:  {profile?.role != 'admin' ? "User" : "Admin"}</p>
      </div>

    </div>
  );
};

