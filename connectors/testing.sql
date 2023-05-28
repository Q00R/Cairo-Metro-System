insert into se_project.zones values(1,2,3)
INSERT INTO se_project.subsription
VALUES (1,'monthly', 1, 2,4);

CREATE TABLE IF NOT EXISTS se_project.transactions
(
    id SERIAL NOT NULL,
    amount INTEGER NOT NULL,
    userid INTEGER NOT NULL,
    purchasedIid text NOT NULL,
	type text not Null,
    FOREIGN KEY( userid ) REFERENCES se_project.users,
    CONSTRAINT transactions_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS se_project.rides
(
    id SERIAL NOT NULL,
    status text NOT NULL,
    origin text NOT NULL, 
    destination text NOT NULL, 
    userId INTEGER NOT NULL,
    ticketId integer not null,
    tripDate timestamp not null,
    FOREIGN KEY( userid ) REFERENCES se_project.users,
    FOREIGN KEY( ticketid ) REFERENCES se_project.tickets,
    CONSTRAINT rides_pkey PRIMARY KEY (id)
);

-- Table: se_project.tickets

-- DROP TABLE IF EXISTS se_project.tickets;

CREATE TABLE IF NOT EXISTS se_project.tickets
(
    id integer NOT NULL DEFAULT nextval('se_project.tickets_id_seq'::regclass),
    origin text COLLATE pg_catalog."default" NOT NULL,
    destination text COLLATE pg_catalog."default" NOT NULL,
    "userId" integer NOT NULL,
    "subId" integer,
    "tripDate" timestamp without time zone NOT NULL,
    CONSTRAINT tickets_pkey PRIMARY KEY (id),
    CONSTRAINT tickets_subid_fkey FOREIGN KEY ("subId")
        REFERENCES se_project.subsription (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tickets_userid_fkey FOREIGN KEY ("userId")
        REFERENCES se_project.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS se_project.tickets
    OWNER to postgres;

    insert into user values("4","4","4","4",3)