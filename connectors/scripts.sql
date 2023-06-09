-- DROP TABLE IF EXISTS se_project.users;
-- DROP TABLE IF EXISTS roles;
-- DROP TABLE IF EXISTS faculties;
-- DROP TABLE IF EXISTS courses;
-- DROP TABLE IF EXISTS sessions;
-- DROP TABLE IF EXISTS enrollments;
--- Note in pgadmin columns name will be lowerCase 
--so either change them from pgadmin or change in the code to lower
CREATE TABLE IF NOT EXISTS se_project.refund_requests
(
    id integer NOT NULL DEFAULT 'nextval('se_project.refund_requests_id_seq'::regclass)',
    status text COLLATE pg_catalog."default" NOT NULL,
    "userId" integer NOT NULL,
    "refundAmount" integer NOT NULL,
    "ticketId" integer NOT NULL,
    CONSTRAINT refund_requests_pkey PRIMARY KEY (id),
    CONSTRAINT refund_requests_ticketid_fkey FOREIGN KEY ("ticketId")
        REFERENCES se_project.tickets (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT refund_requests_userid_fkey FOREIGN KEY ("userId")
        REFERENCES se_project.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS se_project.rides
(
    id integer NOT NULL DEFAULT 'nextval('se_project.rides_id_seq'::regclass)',
    status text COLLATE pg_catalog."default" NOT NULL,
    origin text COLLATE pg_catalog."default" NOT NULL,
    destination text COLLATE pg_catalog."default" NOT NULL,
    "userId" integer NOT NULL,
    "ticketId" integer NOT NULL,
    "tripDate" timestamp without time zone NOT NULL,
    CONSTRAINT rides_pkey PRIMARY KEY (id),
    CONSTRAINT rides_ticketid_fkey FOREIGN KEY ("ticketId")
        REFERENCES se_project.tickets (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT rides_userid_fkey FOREIGN KEY ("userId")
        REFERENCES se_project.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS se_project.roles
(
    id integer NOT NULL DEFAULT 'nextval('se_project.roles_id_seq'::regclass)',
    role text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS se_project.routes
(
    id integer NOT NULL DEFAULT 'nextval('se_project.routes_id_seq'::regclass)',
    "routeName" text COLLATE pg_catalog."default" NOT NULL,
    "fromStationId" integer NOT NULL,
    "toStationId" integer NOT NULL,
    CONSTRAINT routes_pkey PRIMARY KEY (id),
    CONSTRAINT routes_fromstationid_fkey FOREIGN KEY ("fromStationId")
        REFERENCES se_project.stations (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT routes_tostationid_fkey FOREIGN KEY ("toStationId")
        REFERENCES se_project.stations (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS se_project.senior_requests
(
    id integer NOT NULL DEFAULT 'nextval('se_project.senior_requests_id_seq'::regclass)',
    status text COLLATE pg_catalog."default" NOT NULL,
    "userId" integer NOT NULL,
    "nationalId" integer NOT NULL,
    CONSTRAINT senior_requests_pkey PRIMARY KEY (id),
    CONSTRAINT senior_requests_userid_fkey FOREIGN KEY ("userId")
        REFERENCES se_project.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS se_project.sessions
(
    id integer NOT NULL DEFAULT 'nextval('se_project.sessions_id_seq'::regclass)',
    "userId" integer NOT NULL,
    token text COLLATE pg_catalog."default" NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS se_project."stationRoutes"
(
    id integer NOT NULL DEFAULT 'nextval('se_project.stationroutes_id_seq'::regclass)',
    "stationId" integer NOT NULL,
    "routeId" integer NOT NULL,
    CONSTRAINT stationroutes_pkey PRIMARY KEY (id),
    CONSTRAINT stationroutes_routeid_fkey FOREIGN KEY ("routeId")
        REFERENCES se_project.routes (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT stationroutes_stationid_fkey FOREIGN KEY ("stationId")
        REFERENCES se_project.stations (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS se_project.stations
(
    id integer NOT NULL DEFAULT 'nextval('se_project.stations_id_seq'::regclass)',
    "stationName" text COLLATE pg_catalog."default" NOT NULL,
    "stationType" text COLLATE pg_catalog."default" NOT NULL,
    "stationPosition" text COLLATE pg_catalog."default",
    "stationStatus" text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT stations_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS se_project.subsription
(
    id integer NOT NULL DEFAULT 'nextval('se_project.subsription_id_seq'::regclass)',
    "subType" text COLLATE pg_catalog."default" NOT NULL,
    "zoneId" integer NOT NULL,
    "userId" integer NOT NULL,
    "noOfTickets" integer NOT NULL,
    CONSTRAINT subsription_pkey PRIMARY KEY (id),
    CONSTRAINT subsription_userid_fkey FOREIGN KEY ("userId")
        REFERENCES se_project.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT subsription_zoneid_fkey FOREIGN KEY ("zoneId")
        REFERENCES se_project.zones (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS se_project.tickets
(
    id integer NOT NULL DEFAULT 'nextval('se_project.tickets_id_seq'::regclass)',
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

CREATE TABLE IF NOT EXISTS se_project.transactions
(
    id integer NOT NULL DEFAULT 'nextval('se_project.transactions_id_seq'::regclass)',
    amount integer NOT NULL,
    "userId" integer NOT NULL,
    "purchasedId" integer NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_userid_fkey FOREIGN KEY ("userId")
        REFERENCES se_project.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS se_project.users
(
    id integer NOT NULL DEFAULT 'nextval('se_project.users_id_seq'::regclass)',
    "firstName" text COLLATE pg_catalog."default" NOT NULL,
    "lastName" text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    "roleId" integer NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS se_project.zones
(
    id integer NOT NULL DEFAULT 'nextval('se_project.zones_id_seq'::regclass)',
    "zoneType" text COLLATE pg_catalog."default" NOT NULL,
    price integer NOT NULL,
    CONSTRAINT zones_pkey PRIMARY KEY (id)
)