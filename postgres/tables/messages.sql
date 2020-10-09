BEGIN TRANSACTION;

CREATE TABLE messages (
    channel VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    createdAt VARCHAR(50) NOT NULL,
    body text not null,
    img VARCHAR(150)
);

COMMIT;