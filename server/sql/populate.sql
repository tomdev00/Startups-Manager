-- Populate startup table
INSERT INTO startup (name) VALUES
    ('TMNewTechnologies'),
    ('CL & YL CyberSecurity');

-- Populate user table
INSERT INTO user (username, password, role) VALUES
    ('tomasmendes', 'pass123', 'admin'),
    ('cristianaleite', 'pass123', 'user');

-- Populate favourites table
INSERT INTO favourites (id_user, id_startup) VALUES
    (1, 2),
    (2, 1);

